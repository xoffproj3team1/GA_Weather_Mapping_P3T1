import os
import psycopg2
from dotenv import load_dotenv
# import requests


# CITIBIKES_URL = "https://gbfs.citibikenyc.com/gbfs/en/station_information.json"
# GEOCODE_URL = "https://geocode.maps.co/search"
# REVERSE_URL = "https://geocode.maps.co/reverse"


# def load_database():
#     result = requests.get(CITIBIKES_URL)
#     if result.status_code != 200:
#         raise Exception(f"HTTP error returned {result}")
#     data = result.json()

#     load_dotenv()
#     db_url = os.environ.get("DATABSE_URL")
#     connection = psycopg2.connect(db_url)
#     cursor = connection.cursor()

#     with open('schema.sql', 'r') as FILE:
#         query = FILE.read()
#     queries = query.split(";")
#     for q in queries[:-1]:
#         cursor.execute(q)
#     connection.commit()

#     q = f'''INSERT INTO bike_stations (capacity, lat, lon) 
#                     VALUES '''
#     updates = []
#     for station in data['data']['stations']:
#         capacity = station['capacity']
#         if capacity > 0:
#             updates.append (f"({capacity}, {station['lat']}, {station['lon']})")
#     q += ','.join(updates)
#     q += ';'
#     cursor.execute(q)
#     connection.commit()

#     cursor.close()
#     connection.close()
            

def search(airport):

    load_dotenv()
    db_url = os.environ.get("link_render")
    connection = psycopg2.connect(db_url)
    cursor = connection.cursor()
    cursor.execute(f"SELECT lat_decimal, long_decimal \
    FROM apt_base \
    WHERE arpt_id='{airport}' OR icao_id='{airport}';")
    data = cursor.fetchall()
    cursor.close()
    connection.close()

    for row in data:
        return ([row[0],row[1]])
   




