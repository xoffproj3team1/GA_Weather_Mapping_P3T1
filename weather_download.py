# %%
# Import dependencies
import pandas as pd
import os
from dotenv import load_dotenv    # from Karen's or Khaled's code
from sqlalchemy import create_engine
from sqlalchemy import text
from sqlalchemy import select      # Not used
import psycopg2
import csv   # Not used
import numpy as np
from pprint import pprint
import json


# import gzip    # Not used

# %%

url_metar_gz="https://aviationweather.gov/data/cache/metars.cache.csv.gz"
url_TAF_gz="https://aviationweather.gov/data/cache/tafs.cache.csv.gz"
url_airsigmets_gz="https://aviationweather.gov/data/cache/airsigmets.cache.csv.gz"

# %% [markdown]
# __To retrieve METAR data__

# %%
# Fetch, load, and decompress the data relative to metar
metar_data_df = pd.read_csv(url_metar_gz, header=5, compression='gzip')
metar_data_df.head()

# %%
# Convert the dataframe to a JSON format
# metar_json = json.loads(json.dumps(list(metar_data_df.T.to_dict().values())))   # https://stackoverflow.com/questions/39257147/convert-pandas-dataframe-to-json-format answer #10 Amir.S
# pprint(metar_json, sort_dicts=False)  # the pprint process is slow (10.5sec)

# %%
# pprint(metar_json, sort_dicts=False)

# %%
# Convert some columns to INT
# cols=['wind_dir_degrees','wind_speed_kt','wind_gust_kt','cloud_base_ft_agl','cloud_base_ft_agl.2',\
#     'cloud_base_ft_agl.3','vert_vis_ft','elevation_m']
# metar_data_df[cols]=metar_data_df[cols].apply(pd.to_numeric, errors='coerce', downcast='integer', axis=1) # Does not appear to convert to INT, but to FLOAT64
# metar_data_df[cols]=metar_data_df[cols].astype(int)   # Cannot convert NaN

# %%
# metar_data_df.columns

# %%
# metar_data_df.info()

# %%
# convert the dataframe to a dictionary then to a JSON string
metar_string=json.dumps(list(metar_data_df.T.to_dict().values()))

# open the file in write mode
# output_path = os.path.join("Resources", "metar_data.json")  # To be removed if logic.js cannot read from Resources
output_path = os.path.join("static", "metar_data.json")
with open(output_path, "w") as file:
    # write the JSON string to the file
    file.write(metar_string.replace("NaN","null"))

# file is automatically closed after the with block

# %%
# To save the dataframe as a csv file for future import to database (not needed anymore)
# output_path2 = os.path.join("", "metar_data.csv")
# metar_data_df.to_csv(output_path2, index=False)

# file is automatically closed after the with block

# %% [markdown]
# __To refresh the metar table in the Render database__

# %%
# Empty the metar table

load_dotenv()
db_url = os.environ.get("link_render")
connection = psycopg2.connect(db_url)
cursor = connection.cursor()
cursor.execute("DELETE FROM metar;")    # Deletes all the rows but keep the table
connection.commit()
cursor.close()
connection.close()

# %%
# Repopulate the empty table from a json file
load_dotenv()
db_url = os.environ.get("link_render")
connection = psycopg2.connect(db_url)
cursor = connection.cursor()

cursor.execute("set search_path to public") # https://dba.stackexchange.com/questions/268365/using-python-to-insert-json-into-postgresql

with open(output_path) as file:
    data = file.read()

query_sql = """
INSERT INTO metar SELECT * FROM
json_populate_recordset(NULL::metar, %s);
"""

cursor.execute(query_sql, (data,))
connection.commit()

# %% [markdown]
# __To download a new json file made of the joining of airport data and weather data__ (not used anymore: To be deleted)

# %%
# # download the output of a query across multiple tables with all the active public airport with or without weather information.
# # Will be used to populate the makers that do not have METAR information.
# # There is only one row per airport so only one runway is listed even if the airport as more.
# # More parameters can be added to complete the info on the popup window.

# load_dotenv()
# db_url = os.environ.get("link_render")

# # query="""
# #     SELECT DISTINCT ON (arpt_id)
# # 	arpt_id, icao_id, metar.station_id, arpt_name, apt_rwy.rwy_id, lat_decimal, long_decimal, metar.observation_time, metar.wind_speed_kt, metar.flight_category, metar.raw_text
# #     FROM apt_rwy
# #     JOIN apt_base ON apt_base.site_no = apt_rwy.site_no
# #     FULL JOIN metar ON metar.station_id = apt_base.icao_id
# #     WHERE facility_use_code='PU' AND site_type_code='A' AND arpt_status='O';
# #     """

# query="""
# SELECT DISTINCT ON (arpt_id)
#     arpt_id, icao_id, metar.station_id, arpt_name, apt_rwy.rwy_id, lat_decimal, metar.latitude, long_decimal, metar.longitude, metar.observation_time, metar.wind_speed_kt, metar.flight_category, metar.raw_text, elev, metar.visibility_statute_mi, metar.cloud_base_ft_agl
# FROM apt_rwy
# JOIN apt_base ON apt_base.site_no = apt_rwy.site_no
# FULL JOIN metar ON (RIGHT(metar.station_id, LENGTH(metar.station_id) - 1)) = apt_base.arpt_id
# WHERE facility_use_code='PU' AND site_type_code='A' AND arpt_status='O' AND
# CASE
# 	WHEN metar.station_id IS NOT NULL
# 	THEN (@(lat_decimal - metar.latitude) <1) AND (@(long_decimal - metar.longitude) <1) AND site_type_code='A'
	
# 	WHEN metar.station_id IS NULL
# 	THEN site_type_code='A'
# END
# """

# engine=create_engine(db_url)
# with engine.begin() as conn:
#     results=conn.execute(
#         text(query)
#     )

# arpt_weather_query_df = pd.DataFrame(results)

# # Save the df as a CSV file. Might not be needed if we only use JSON    TO BE REMOVED?
# # arpt_weather_query_df.to_csv (r'airport_weather_data.csv', index = False) # place 'r' before the path name


# # convert the dataframe to a dictionary then to a JSON string
# arpt_weather_string=json.dumps(list(arpt_weather_query_df.T.to_dict().values()))

# # open the file in write mode
# output_path = os.path.join("", "airport_weather_data.json")
# with open(output_path, "w") as file:
#     # write the JSON string to the file
#     file.write(arpt_weather_string.replace("NaN","null"))

# # file is automatically closed after the with block



# %%
# arpt_weather_query_df.head()

# %%
# pprint(arpt_weather_string)

# %% [markdown]
# __To retrieve TAF data__

# %%
# Fetch, load, and decompress the data relative to TAF  (working but not used for now)
# taf_data_df = pd.read_csv(url_TAF_gz, header=5,index_col=False, compression='gzip',dtype='str',low_memory=False)
# taf_data_df.head()

# %%
# Convert the dataframe to a JSON format  (working but not used for now)
# taf_json = json.loads(json.dumps(list(taf_data_df.T.to_dict().values())))   # https://stackoverflow.com/questions/39257147/convert-pandas-dataframe-to-json-format answer #10 Amir.S
# pprint(taf_json, sort_dicts=False)  # the pprint process is slow (10.5sec)

# %%
# # convert the dataframe to a dictionary then to a JSON string  (working but not used for now)
# taf_string=json.dumps(list(taf_data_df.T.to_dict().values()))

# # open the file in write mode
# output_path = os.path.join("Resources", "taf_data.json")
# with open(output_path, "w") as file:
#     # write the JSON string to the file
#     file.write(taf_string.replace("NaN","null"))

# # file is automatically closed after the with block

# %% [markdown]
# __To retrieve AIRMET and SIGMET polygons data__

# %%
# Fetch, load, and decompress the data relative to Airmet and Sigmet
airsigmet_data_df = pd.read_csv(url_airsigmets_gz, header=5, compression='gzip', encoding='utf-8')
airsigmet_data_df.head()

# %%
# airsigmet_data_df["raw_text"] = airsigmet_data_df["raw_text"].replace(r'\x07','\n', regex=True)


# %%
# airsigmet_data_df["raw_text"] = airsigmet_data_df["raw_text"].replace(r'\x07','<br>', regex=True)   # Used to replace \n that does not get decompressed as utf-8 and was converted as \x07

# %%
# import re
# re.findall('[^\w \.-]', airsigmet_data_df['raw_text'][0])

# %%
# re.sub('[^\w \.-]', "\n", airsigmet_data_df['raw_text'][0])

# %%
# Fetch, load, and decompress the data relative to Airmet and Sigmet
# airsigmet_data_df = pd.read_csv(url_airsigmets_gz, header=5, compression='gzip', encoding='utf-8')
# airsigmet_data_df.head()

# %%
# replace with <br> in raw_text
airsigmet_data_df["raw_text"] = airsigmet_data_df["raw_text"].replace(r'\x07','<br>', regex=True)   # Used to replace \n that does not get decompressed as utf-8 and was converted as \x07

# To convert the points delimiting the areas into something Leaflet-friendly
for j in range(len(airsigmet_data_df)):
    test=airsigmet_data_df.iloc[j]['lon:lat points']
    if  pd.isna(test)!=True:    # Test if the cell is not NaN
        test1=test.split(';')
        for i in range(len(test1)):
            test1[i]=test1[i].split(':')    # Creates list of coordinates
            test1[i][0],test1[i][1]=float(test1[i][1]),float(test1[i][0])   # Swap lon:lat to lat:lon
        airsigmet_data_df.at[j,'lon:lat points']=test1

    # shift cells for missing column
    test2=airsigmet_data_df.iloc[j]['airsigmet_type']
    if  pd.isna(test2)==True:    # Test if the cell is NaN
        airsigmet_data_df.at[j,'airsigmet_type']=airsigmet_data_df.at[j,'severity']
        airsigmet_data_df.at[j,'severity']=airsigmet_data_df.at[j,'hazard']
        airsigmet_data_df.at[j,'hazard']=airsigmet_data_df.at[j,'movement_speed_kt']
        airsigmet_data_df.at[j,'movement_speed_kt']=airsigmet_data_df.at[j,'movement_dir_degrees']
        airsigmet_data_df.at[j,'movement_dir_degrees']=airsigmet_data_df.at[j,'max_ft_msl']
        airsigmet_data_df.at[j,'max_ft_msl']=airsigmet_data_df.at[j,'min_ft_msl']
        airsigmet_data_df.at[j,'min_ft_msl']="NaN"

  


airsigmet_data_df.rename(columns={"lon:lat points":"lat_lon_points"}, inplace=True) # Update the column name
airsigmet_data_df.head()

# %%
# Convert the dataframe to a JSON format
# airsigmet_json = json.loads(json.dumps(list(airsigmet_data_df.T.to_dict().values())))   # https://stackoverflow.com/questions/39257147/convert-pandas-dataframe-to-json-format answer #10 Amir.S
# pprint(airsigmet_json, sort_dicts=False)

# %%
# convert the dataframe to a dictionary then to a JSON string
airsigmet_string=json.dumps(list(airsigmet_data_df.T.to_dict().values()))

# open the file in write mode
# output_path = os.path.join("Resources", "airsigmet_data.json")
output_path = os.path.join("static", "airsigmet_data.json")
with open(output_path, "w") as file:
    # write the JSON string to the file
    file.write(airsigmet_string.replace("NaN","null"))

# file is automatically closed after the with block

# %% [markdown]
# __To download headwing and crosswind informations for all runways__ (Not used anymore: to be deleted)

# %%
# # download the output of a query across multiple tables with the wind information relative to all runways.
# # Will be used to update the makers for all airports.
# # There are multiple rows per airport (one per runway).
# # More parameters can be added to complete the info on the popup window.

# load_dotenv()
# db_url = os.environ.get("link_render")


# query="""
# SELECT arpt_id, icao_id, arpt_name, apt_rwy.rwy_id, apt_rwy.rwy_len, apt_rwy_end.rwy_end_id, apt_rwy_end.true_alignment, metar.wind_dir_degrees, metar.wind_speed_kt, metar.wind_gust_kt,
# ROUND(metar.wind_speed_kt*sin(radians(apt_rwy_end.true_alignment - (metar.wind_dir_degrees :: INTEGER)))) AS "cross_wind",
# ROUND(metar.wind_speed_kt*cos(radians(apt_rwy_end.true_alignment - (metar.wind_dir_degrees :: INTEGER)))) AS "head_wind",
# ROUND(metar.wind_gust_kt*sin(radians(apt_rwy_end.true_alignment - (metar.wind_dir_degrees :: INTEGER)))) AS "gust_cross_wind",
# ROUND(metar.wind_gust_kt*cos(radians(apt_rwy_end.true_alignment - (metar.wind_dir_degrees :: INTEGER)))) AS "gust_head_wind"	
# FROM apt_rwy
# JOIN apt_base ON apt_base.site_no = apt_rwy.site_no
# JOIN apt_rwy_end ON apt_base.site_no = apt_rwy_end.site_no AND apt_rwy.rwy_id = apt_rwy_end.rwy_id
# FULL JOIN metar ON (RIGHT(metar.station_id, LENGTH(metar.station_id) - 1)) = apt_base.arpt_id
# WHERE facility_use_code='PU' AND arpt_status='O' AND site_type_code='A' AND (@(lat_decimal - metar.latitude) <1) AND (@(long_decimal - metar.longitude) <1) AND metar.wind_dir_degrees != 'VRB'
# """

# engine=create_engine(db_url)
# with engine.begin() as conn:
#     results=conn.execute(
#         text(query)
#     )

# rwy_wind_query_df = pd.DataFrame(results)


# # convert the dataframe to a dictionary then to a JSON string
# rwy_wind_string=json.dumps(list(rwy_wind_query_df.T.to_dict().values()))

# # open the file in write mode
# output_path = os.path.join("", "rwy_wind_data.json")
# with open(output_path, "w") as file:
#     # write the JSON string to the file
#     file.write(rwy_wind_string.replace("NaN","null"))

# # file is automatically closed after the with block

# %%
# rwy_wind_query_df.head()

# %%
# len(rwy_wind_query_df)

# %%
# rwy_wind_query_df

# %%


# %% [markdown]
# __Retrieve all data to position the circles for all airports and create the popup text__

# %%
# download the output of a consolidated query across multiple tables with all information pertinent to an airport.
# Will be used to update the makers for all airports.
# There are multiple rows per airport (one per runway).
# More parameters can be added to complete the info on the popup window.
# Will be used to consolidate the information in the popups

load_dotenv()
db_url = os.environ.get("link_render")

query="""
-- Query to get METAR information for each airport as a VIEW
DROP VIEW IF EXISTS all_circles_view;
CREATE VIEW all_circles_view AS
SELECT 
arpt_id, icao_id, metar.station_id, arpt_name, apt_rwy.rwy_id, apt_rwy.rwy_len, lat_decimal, metar.latitude, long_decimal, metar.longitude, metar.observation_time, metar.flight_category, metar.raw_text, elev, metar.visibility_statute_mi, metar.cloud_base_ft_agl
-- , metar.wind_speed_kt
FROM apt_rwy
JOIN apt_base ON apt_base.site_no = apt_rwy.site_no
FULL JOIN metar ON (RIGHT(metar.station_id, LENGTH(metar.station_id) - 1)) = apt_base.arpt_id
WHERE facility_use_code='PU' AND site_type_code='A' AND arpt_status='O' AND
CASE
	WHEN metar.station_id IS NOT NULL
	THEN (@(lat_decimal - metar.latitude) <1) AND (@(long_decimal - metar.longitude) <1) AND site_type_code='A'
	
	WHEN metar.station_id IS NULL
	THEN site_type_code='A'
END;


-- Query to get wind information for each runway as a VIEW
DROP VIEW IF EXISTS all_rwy_xwind_view;
CREATE VIEW all_rwy_xwind_view AS
SELECT arpt_id, icao_id, arpt_name, apt_base.tpa, apt_rwy.rwy_id, apt_rwy.rwy_len, apt_rwy.rwy_width, apt_rwy_end.rwy_end_id, apt_rwy_end.true_alignment, apt_rwy_end.right_hand_traffic_pat_flag, metar.wind_dir_degrees, metar.wind_speed_kt, metar.wind_gust_kt,
	ROUND(metar.wind_speed_kt*sin(radians(apt_rwy_end.true_alignment - (metar.wind_dir_degrees :: INTEGER)))) AS "cross_wind",
	ROUND(metar.wind_speed_kt*cos(radians(apt_rwy_end.true_alignment - (metar.wind_dir_degrees :: INTEGER)))) AS "head_wind",
	ROUND(metar.wind_gust_kt*sin(radians(apt_rwy_end.true_alignment - (metar.wind_dir_degrees :: INTEGER)))) AS "gust_cross_wind",
	ROUND(metar.wind_gust_kt*cos(radians(apt_rwy_end.true_alignment - (metar.wind_dir_degrees :: INTEGER)))) AS "gust_head_wind"	
FROM apt_rwy_end
FULL JOIN apt_base ON apt_base.site_no = apt_rwy_end.site_no
FULL JOIN apt_rwy ON apt_base.site_no = apt_rwy.site_no AND apt_rwy.rwy_id = apt_rwy_end.rwy_id
FULL JOIN metar ON (RIGHT(metar.station_id, LENGTH(metar.station_id) - 1)) = apt_base.arpt_id
WHERE facility_use_code='PU' AND arpt_status='O' AND
CASE -- by not have the CASE, we were not providing the rwy length of the airports without METAR
	WHEN metar.station_id IS NOT NULL
	AND metar.wind_dir_degrees != 'VRB'
	THEN (@(lat_decimal - metar.latitude) <1) AND (@(long_decimal - metar.longitude) <1) AND site_type_code='A'
	
	WHEN metar.station_id IS NULL
	THEN site_type_code='A'
END;


-- Merge the two VIEWS
SELECT 	all_circles_view.arpt_id, all_circles_view.icao_id, all_circles_view.station_id, all_circles_view.arpt_name, all_circles_view.lat_decimal, all_circles_view.long_decimal, all_circles_view.elev, all_rwy_xwind_view.tpa,
		all_circles_view.rwy_id, all_rwy_xwind_view.rwy_end_id, all_rwy_xwind_view.rwy_len, all_rwy_xwind_view.rwy_width, all_rwy_xwind_view.right_hand_traffic_pat_flag,
		all_rwy_xwind_view.cross_wind, all_rwy_xwind_view.head_wind, all_rwy_xwind_view.gust_cross_wind, all_rwy_xwind_view.gust_head_wind,		
		all_rwy_xwind_view.true_alignment,
		all_rwy_xwind_view.wind_dir_degrees, all_rwy_xwind_view.wind_speed_kt, all_rwy_xwind_view.wind_gust_kt,
		all_circles_view.flight_category,  all_circles_view.visibility_statute_mi, all_circles_view.cloud_base_ft_agl,		
		all_circles_view.observation_time, all_circles_view.raw_text
FROM all_circles_view
FULL JOIN all_rwy_xwind_view ON all_circles_view.arpt_id = all_rwy_xwind_view.arpt_id
AND all_circles_view.rwy_id=all_rwy_xwind_view.rwy_id
WHERE all_circles_view.rwy_id NOT LIKE 'H%'
"""


engine=create_engine(db_url)
with engine.begin() as conn:
    results=conn.execute(
        text(query)
    )

airport_info_query_raw_df = pd.DataFrame(results)


# # convert the dataframe to a dictionary then to a JSON string		# The section below will be moved to be used on the consolidated DF.
# airport_info_string=json.dumps(list(airport_info_query_raw_df.T.to_dict().values()))

# # open the file in write mode
# output_path = os.path.join("", "airport_info_data.json")
# with open(output_path, "w") as file:
#     # write the JSON string to the file
#     file.write(rwy_wind_string.replace("NaN","null"))

# # file is automatically closed after the with block

# %%
# airport_info_query_raw_df.head()

# %%
airport_info_query_raw_df.columns

# %%
# Consolidation of the database with only one row per airport regardless of the number of runways

airport_info_query_df=pd.DataFrame(columns=['arpt_id', 'icao_id', 'station_id', 'arpt_name', 'lat_decimal',
       'long_decimal', 'elev', 'tpa', 'rwy_id', 'rwy_end_id', 'rwy_len',
       'rwy_width', 'right_hand_traffic_pat_flag', 'cross_wind', 'head_wind',
       'gust_cross_wind', 'gust_head_wind', 'true_alignment',
       'wind_dir_degrees', 'wind_speed_kt', 'wind_gust_kt', 'flight_category',
       'visibility_statute_mi', 'cloud_base_ft_agl', 'observation_time',
       'raw_text'])

airport_info_query_df["popup_text"]=np.nan

first_row=True
first_rwy=True

a=len(airport_info_query_raw_df)
print(f"View length: {a}")
for i in range (a):
    if first_row:
       k=i
       airport_info_query_df.loc[airport_info_query_raw_df.index[i]] = airport_info_query_raw_df.iloc[i]
       popup_text="""<div class="arpt_id"> """+airport_info_query_raw_df.iloc[i]["arpt_id"]+'</div>'

       if airport_info_query_raw_df.iloc[i]["icao_id"] is not None:
           popup_text=popup_text+"""<div class="icao_id"> / """+airport_info_query_raw_df.iloc[i]["icao_id"]+'</div>'

       popup_text=popup_text+'<br>'+"""<div class="arpt_name"> """+airport_info_query_raw_df.iloc[i]["arpt_name"]+'</div>'
       popup_text=popup_text+'<br>'+"""<div class="elev">Airport Elevation: """+str(int(airport_info_query_raw_df.iloc[i]["elev"]))+""" (ft MSL)</div>"""

       if pd.isna(airport_info_query_raw_df.iloc[i]["tpa"])==False:
           popup_text=popup_text+'<br>'+"""<div class="tpa">TPA: """+str(int(airport_info_query_raw_df.iloc[i]["elev"]+int(airport_info_query_raw_df.iloc[i]["tpa"])))+""" (ft MSL)</div>"""
       else:
           popup_text=popup_text+'<br>'+"""<div class="tpa">TPA (estimated): """+str(int(airport_info_query_raw_df.iloc[i]["elev"]+1000))+""" (ft MSL)</div>"""
             

       if pd.isna(airport_info_query_raw_df.iloc[i]["visibility_statute_mi"])==False:
           popup_text=popup_text+'<br>'+"""<div class="visibility_statute_mi">Airport visibility: """+airport_info_query_raw_df.iloc[i]["visibility_statute_mi"]+' (SM)</div>'

       if pd.isna(airport_info_query_raw_df.iloc[i]["cloud_base_ft_agl"])==False:
           popup_text=popup_text+'<br>'+"""<div class="cloud_base_ft_agl">Airport ceiling: """+str(airport_info_query_raw_df.iloc[i]["cloud_base_ft_agl"])+' (ft AGL)</div>'

       first_row=False

    if first_rwy:
        popup_text=popup_text+'<br>'+"""<div class="rwy_id"> Runway """+airport_info_query_raw_df.iloc[i]["rwy_id"]+' </div>'
        if pd.isna(airport_info_query_raw_df.iloc[i]["rwy_len"])==False:
            popup_text=popup_text+'<br>'+"""<div class="rwy_len"> Runway length: """+str(int(airport_info_query_raw_df.iloc[i]["rwy_len"]))+' (ft)</div>'
        if pd.isna(airport_info_query_raw_df.iloc[i]["rwy_width"])==False:
            popup_text=popup_text+'<br>'+"""<div class="rwy_width"> Runway width: """+str(int(airport_info_query_raw_df.iloc[i]["rwy_width"]))+' (ft)</div>'
        first_rwy=False

    if (pd.isna(airport_info_query_raw_df.iloc[i]["raw_text"])==False & pd.isna(airport_info_query_raw_df.iloc[i]["true_alignment"])==False) | (airport_info_query_raw_df.iloc[i]["right_hand_traffic_pat_flag"]=='Y'):
        if pd.isna(airport_info_query_raw_df.iloc[i]["rwy_end_id"])==False:
            popup_text=popup_text+'<br>'+"""<div class="rwy_end_id"> """+airport_info_query_raw_df.iloc[i]["rwy_end_id"]+' :</div>'
            if airport_info_query_raw_df.iloc[i]["right_hand_traffic_pat_flag"]=='Y':
                popup_text=popup_text+'<br>'+"""<div class="RP"> RP </div>"""


        if pd.isna(airport_info_query_raw_df.iloc[i]["cross_wind"])==False:
            popup_text=popup_text+'<br>'+"""<div class="cross_wind">Crosswind (neg. is from right): """+str(int(airport_info_query_raw_df.iloc[i]["cross_wind"]))+' (kt)</div>'

        if pd.isna(airport_info_query_raw_df.iloc[i]["head_wind"])==False:
            popup_text=popup_text+'<br>'+"""<div class="head_wind">Headwind (neg. is headwind): """+str(int(airport_info_query_raw_df.iloc[i]["head_wind"]))+' (kt)</div>'

        if pd.isna(airport_info_query_raw_df.iloc[i]["gust_cross_wind"])==False:
            popup_text=popup_text+'<br>'+"""<div class="gust_cross_wind">Gust crosswind (neg. is from right): """+str(int(airport_info_query_raw_df.iloc[i]["gust_cross_wind"]))+' (kt)</div>'

        if pd.isna(airport_info_query_raw_df.iloc[i]["gust_head_wind"])==False:
            popup_text=popup_text+'<br>'+"""<div class="gust_head_wind">Gust headwind (neg. is headwind): """+str(int(airport_info_query_raw_df.iloc[i]["gust_head_wind"]))+' (kt)</div>'


    if i<a-1:
        if airport_info_query_raw_df.iloc[i+1]["arpt_id"]!=airport_info_query_raw_df.iloc[i]["arpt_id"]:
            if pd.isna(airport_info_query_raw_df.iloc[i]["raw_text"])==False:
                popup_text=popup_text+'<br>'+"""<div class="raw_text"> """+airport_info_query_raw_df.iloc[i]["raw_text"]+'</div>'
                popup_text=popup_text+'<br>'+"""<div class="observation_time"> """+airport_info_query_raw_df.iloc[i]["observation_time"]+'</div>'
            else:
                popup_text=popup_text+'<br> <div class="raw_text">No weather information</div>'

            airport_info_query_df.at[k,"popup_text"]=popup_text
            # print(f"k={k}, i={i}")
            # print(popup_text)
            first_row=True
            first_rwy=True
        elif airport_info_query_raw_df.iloc[i+1]["rwy_id"]!=airport_info_query_raw_df.iloc[i]["rwy_id"]:
            first_rwy=True

    if i==a-1:
        airport_info_query_df.at[k,"popup_text"]=popup_text




# convert the dataframe to a dictionary then to a JSON string		# The section below will be moved to be used on the consolidated DF.
airport_info_string=json.dumps(list(airport_info_query_df.T.to_dict().values()))

# open the file in write mode
output_path = os.path.join("static", "airport_info_full_data.json")
with open(output_path, "w") as file:
    # write the JSON string to the file
    file.write(airport_info_string.replace("NaN","null"))

# file is automatically closed after the with block
        


# airport_info_query_df




# %%
# airport_info_query_df[airport_info_query_df['arpt_id']=='BLU']

# %% [markdown]
# 


