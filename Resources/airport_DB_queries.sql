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