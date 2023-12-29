SELECT 
apt_base.arpt_id, apt_rwy_end.rwy_end_id, apt_rwy_end.true_alignment 
FROM apt_rwy_end
JOIN apt_base ON apt_base.site_no = apt_rwy_end.site_no
WHERE apt_base.arpt_id='RHV';

SELECT * FROM apt_base
WHERE apt_base.arpt_id='RHV';

SELECT arpt_id, arpt_name, lat_decimal, long_decimal, facility_use_code, arpt_status
FROM apt_base
WHERE facility_use_code='PU' AND arpt_status='O';

SELECT arpt_id, arpt_name, apt_rwy_end.rwy_end_id, apt_rwy_end.true_alignment, lat_decimal, long_decimal
FROM apt_rwy_end
JOIN apt_base ON apt_base.site_no = apt_rwy_end.site_no
WHERE facility_use_code='PU' AND arpt_status='O';

SELECT arpt_id, arpt_name, apt_rwy_end.rwy_end_id, apt_rwy_end.true_alignment, lat_decimal, long_decimal
FROM apt_rwy_end
JOIN apt_base ON apt_base.site_no = apt_rwy_end.site_no
WHERE facility_use_code='PU' AND arpt_status='O' AND apt_base.arpt_id='WVI';

SELECT arpt_id, arpt_name, apt_rwy_end.rwy_end_id, apt_rwy_end.true_alignment, lat_decimal, long_decimal
FROM apt_rwy_end
JOIN apt_base ON apt_base.site_no = apt_rwy_end.site_no
WHERE facility_use_code='PU' AND arpt_status='O' AND site_type_code='A';

SELECT arpt_id, icao_id, arpt_name, lat_decimal, long_decimal
FROM apt_base
WHERE arpt_id='KRHV' OR icao_id='KRHV'

SELECT arpt_id, icao_id, arpt_name, apt_rwy_end.rwy_end_id, apt_rwy_end.true_alignment, lat_decimal, long_decimal
FROM apt_rwy_end
JOIN apt_base ON apt_base.site_no = apt_rwy_end.site_no
WHERE facility_use_code='PU' AND arpt_status='O' AND (arpt_id='RHV' OR icao_id='RHV');

SELECT arpt_id, icao_id, arpt_name, apt_rwy_end.rwy_end_id, apt_rwy_end.true_alignment, lat_decimal, long_decimal, metar.wind_dir_degrees, metar.wind_speed_kt
FROM apt_rwy_end
JOIN apt_base ON apt_base.site_no = apt_rwy_end.site_no
JOIN metar ON metar.station_id = apt_base.icao_id
WHERE facility_use_code='PU' AND arpt_status='O' AND (arpt_id='RHV' OR icao_id='KRHV');

SELECT metar.station_id, metar.wind_dir_degrees, metar.wind_speed_kt
FROM metar
WHERE metar.station_id='KHAF'

SELECT * FROM metar;

DELETE FROM metar;

SELECT arpt_id, icao_id, arpt_name, apt_rwy_end.rwy_end_id, apt_rwy_end.true_alignment, lat_decimal, long_decimal, metar.wind_dir_degrees, metar.wind_speed_kt
FROM apt_rwy_end
JOIN apt_base ON apt_base.site_no = apt_rwy_end.site_no
JOIN metar ON metar.station_id = apt_base.icao_id
WHERE facility_use_code='PU' AND arpt_status='O' AND arpt_id='E16';

SELECT arpt_id, icao_id, arpt_name, apt_rwy_end.rwy_end_id, apt_rwy_end.true_alignment, lat_decimal, long_decimal
FROM apt_rwy_end
JOIN apt_base ON apt_base.site_no = apt_rwy_end.site_no
WHERE facility_use_code='PU' AND arpt_status='O' AND arpt_id='E16';

SELECT * FROM apt_base
WHERE icao_id IS NULL


SELECT arpt_id, icao_id, arpt_name, lat_decimal, long_decimal
FROM apt_base
WHERE arpt_id='KRHV' OR icao_id='KRHV'

SELECT arpt_id, icao_id, arpt_name, apt_rwy_end.rwy_end_id, apt_rwy_end.true_alignment, lat_decimal, long_decimal
FROM apt_rwy_end
JOIN apt_base ON apt_base.site_no = apt_rwy_end.site_no
WHERE facility_use_code='PU' AND arpt_status='O' AND (arpt_id='RHV' OR icao_id='RHV');

SELECT arpt_id, icao_id, arpt_name, apt_rwy_end.rwy_end_id, apt_rwy_end.true_alignment, lat_decimal, long_decimal, metar.wind_dir_degrees, metar.wind_speed_kt
FROM apt_rwy_end
JOIN apt_base ON apt_base.site_no = apt_rwy_end.site_no
JOIN metar ON metar.station_id = apt_base.icao_id
WHERE facility_use_code='PU' AND arpt_status='O' AND (arpt_id='RHV' OR icao_id='KRHV');

SELECT metar.station_id, metar.wind_dir_degrees, metar.wind_speed_kt
FROM metar
WHERE metar.station_id='KHAF'

SELECT * FROM metar;

DELETE FROM metar;

SELECT arpt_id, icao_id, arpt_name, apt_rwy_end.rwy_end_id, apt_rwy_end.true_alignment, lat_decimal, long_decimal, metar.wind_dir_degrees, metar.wind_speed_kt
FROM apt_rwy_end
JOIN apt_base ON apt_base.site_no = apt_rwy_end.site_no
JOIN metar ON metar.station_id = apt_base.icao_id
WHERE facility_use_code='PU' AND arpt_status='O' AND arpt_id='E16';

SELECT arpt_id, icao_id, arpt_name, apt_rwy_end.rwy_end_id, apt_rwy_end.true_alignment, lat_decimal, long_decimal
FROM apt_rwy_end
JOIN apt_base ON apt_base.site_no = apt_rwy_end.site_no
WHERE facility_use_code='PU' AND arpt_status='O' AND arpt_id='E16';

SELECT * FROM apt_base
WHERE icao_id IS NULL


SELECT arpt_id, icao_id, arpt_name, apt_rwy_end.rwy_end_id, apt_rwy_end.true_alignment, lat_decimal, long_decimal, metar.wind_dir_degrees, metar.wind_speed_kt, metar.flight_category
FROM apt_rwy_end
JOIN apt_base ON apt_base.site_no = apt_rwy_end.site_no
LEFT JOIN metar ON metar.station_id = apt_base.icao_id
WHERE facility_use_code='PU' AND arpt_status='O' AND arpt_id='RHV';


SELECT DISTINCT ON (arpt_id)
	arpt_id, icao_id, arpt_name, apt_rwy.rwy_id, lat_decimal, long_decimal, metar.wind_dir_degrees, metar.wind_speed_kt, metar.flight_category, metar.raw_text
FROM apt_rwy
JOIN apt_base ON apt_base.site_no = apt_rwy.site_no
LEFT JOIN metar ON metar.station_id = apt_base.icao_id
WHERE facility_use_code='PU' AND arpt_status='O';



SELECT arpt_id, icao_id, arpt_name, apt_rwy.rwy_id, apt_rwy.rwy_len, apt_rwy_end.rwy_end_id, apt_rwy_end.true_alignment, metar.wind_dir_degrees, metar.wind_speed_kt, metar.wind_gust_kt,
	ROUND(metar.wind_speed_kt*sin(radians(apt_rwy_end.true_alignment - (metar.wind_dir_degrees :: INTEGER)))) AS "cross_wind",
	ROUND(metar.wind_speed_kt*cos(radians(apt_rwy_end.true_alignment - (metar.wind_dir_degrees :: INTEGER)))) AS "head_wind",
	ROUND(metar.wind_gust_kt*sin(radians(apt_rwy_end.true_alignment - (metar.wind_dir_degrees :: INTEGER)))) AS "gust_cross_wind",
	ROUND(metar.wind_gust_kt*cos(radians(apt_rwy_end.true_alignment - (metar.wind_dir_degrees :: INTEGER)))) AS "gust_head_wind"	
FROM apt_rwy
JOIN apt_base ON apt_base.site_no = apt_rwy.site_no
JOIN apt_rwy_end ON apt_base.site_no = apt_rwy_end.site_no AND apt_rwy.rwy_id = apt_rwy_end.rwy_id
FULL JOIN metar ON (RIGHT(metar.station_id, LENGTH(metar.station_id) - 1)) = apt_base.arpt_id
WHERE facility_use_code='PU' AND arpt_status='O' AND site_type_code='A' AND (@(lat_decimal - metar.latitude) <1) AND (@(long_decimal - metar.longitude) <1) AND metar.wind_dir_degrees != 'VRB'