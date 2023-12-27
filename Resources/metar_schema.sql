-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


CREATE TABLE "metar" (
    "raw_text" VARCHAR(300)   NOT NULL,
    "station_id" VARCHAR(7)   NOT NULL,
    "observation_time" VARCHAR(30)   NOT NULL,
    "latitude" FLOAT,
    "longitude" FLOAT,
    "temp_c" FLOAT,
    "dewpoint_c" FLOAT,
    "wind_dir_degrees" VARCHAR(4),
    "wind_speed_kt" FLOAT,
    "wind_gust_kt" FLOAT,
    "visibility_statute_mi" VARCHAR(4),
    "altim_in_hg" FLOAT,
    "sea_level_pressure_mb" FLOAT,
    "corrected" BOOLEAN,
    "auto" BOOLEAN,
    "auto_station" BOOLEAN,
    "maintenance_indicator_on" BOOLEAN,
    "no_signal" BOOLEAN,
    "lightning_sensor_off" BOOLEAN,
    "freezing_rain_sensor_off" BOOLEAN,
    "present_weather_sensor_off" BOOLEAN,
    "wx_string" VARCHAR(20),
    "sky_cover" VARCHAR(5),
    "cloud_base_ft_agl" FLOAT,
    "sky_cover_2" VARCHAR(5),
    "cloud_base_ft_agl_2" FLOAT,
    "sky_cover_3" VARCHAR(5),
    "cloud_base_ft_agl_3" FLOAT,
    "sky_cover_4" VARCHAR(5),
    "cloud_base_ft_agl_4" FLOAT,
    "flight_category" VARCHAR(4),
    "three_hr_pressure_tendency_mb" FLOAT,
    "maxT_c" FLOAT,
    "minT_c" FLOAT,
    "maxT24hr_c" FLOAT,
    "minT24hr_c" FLOAT,
    "precip_in" FLOAT,
    "pcp3hr_in" FLOAT,
    "pcp6hr_in" FLOAT,
    "pcp24hr_in" FLOAT,
    "snow_in" VARCHAR(10),
    "vert_vis_ft" FLOAT,
    "metar_type" VARCHAR(5),
    "elevation_m" FLOAT,
    CONSTRAINT "pk_metar" PRIMARY KEY (
        "station_id"
     )
);

