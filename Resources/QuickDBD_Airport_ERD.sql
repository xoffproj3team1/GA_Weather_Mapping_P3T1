-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


CREATE TABLE "apt_base" (
    "eff_date" VARCHAR(10)   NOT NULL,
    "site_no" VARCHAR(9)   NOT NULL,
    "site_type_code" VARCHAR(1)   NOT NULL,
    "state_code" VARCHAR(2),
    "arpt_id" VARCHAR(4) UNIQUE  NOT NULL,
    "city" VARCHAR(40)   NOT NULL,
    "country_code" VARCHAR(2)   NOT NULL,
    "region_code" VARCHAR(3),
    "arpt_name" VARCHAR(50)   NOT NULL,
    "facility_use_code" VARCHAR(2)   NOT NULL,
    "lat_decimal" FLOAT   NOT NULL,
    "long_decimal" FLOAT   NOT NULL,
    "elev" FLOAT   NOT NULL,
    "mag_varn" INT,
    "mag_hemis" VARCHAR(1),
    "tpa" INT,
    "dist_city_to_airport" INT,
    "direction_code" VARCHAR(3),
    "resp_artcc_id" VARCHAR(4)   NOT NULL,
    "artcc_name" VARCHAR(30)   NOT NULL,
    "fss_id" VARCHAR(4)   NOT NULL,
    "fss_name" VARCHAR(30)   NOT NULL,
    "phone_no" VARCHAR(16),
    "toll_free_no" VARCHAR(16),
    "arpt_status" VARCHAR(2)   NOT NULL,
    "fuel_types" VARCHAR(40),
    "lgt_sked" VARCHAR(7),
    "bcn_lgt_sked" VARCHAR(7),
    "twr_type_code" VARCHAR(12)   NOT NULL,
    "lndg_fee_flag" VARCHAR(1),
    "wind_ind_flag" VARCHAR(3),
    "icao_id" VARCHAR(7),
    "cta" VARCHAR(4),
    CONSTRAINT "pk_apt_base" PRIMARY KEY (
        "site_no"
     )
);

CREATE TABLE "apt_rwy" (
    "site_no" VARCHAR(9)   NOT NULL,
    "rwy_id" VARCHAR(7)   NOT NULL,
    "rwy_len" INT   NOT NULL,
    "rwy_width" INT   NOT NULL,
    "surface_type_code" VARCHAR(10),
    "cond" VARCHAR(9),
    "rwy_lgt_code" VARCHAR(4)
);

CREATE TABLE "apt_rwy_end" (
    "site_no" VARCHAR(9)   NOT NULL,
    "rwy_id" VARCHAR(7)   NOT NULL,
    "rwy_end_id" VARCHAR(3)   NOT NULL,
    "true_alignment" INT,
    "ils_type" VARCHAR(10),
    "right_hand_traffic_pat_flag" VARCHAR(1),
    "visual_glide_path_angle" FLOAT,
    "displaced_thr_len" INT,
    "vgsi_code" VARCHAR(4),
    "apch_lgt_system_code" VARCHAR(8),
    "rwy_end_lgts_flag" VARCHAR(1),
    "cntrln_lgts_avabl_flag" VARCHAR(1),
    "tdz_lgt_avbl_flag" VARCHAR(1),
    "tkof_run_avbl" INT,
    "tkof_dist_avbl" INT,
    "lndg_dist_avbl" INT
);

CREATE TABLE "atc_atis" (
    "site_no" VARCHAR(9)   NOT NULL,
    "description" VARCHAR(100),
    "atis_hrs" VARCHAR(200)   NOT NULL,
    "atis_phone_no" VARCHAR(18),
    CONSTRAINT "pk_atc_atis" PRIMARY KEY (
        "site_no"
     )
);

CREATE TABLE "awos" (
    "asos_awos_id" VARCHAR(4)   NOT NULL,
    "asos_awos_type" VARCHAR(10)   NOT NULL,
    "phone_no" VARCHAR(14),
    "site_no" VARCHAR(9)
);

CREATE TABLE "cls_arsp" (
    "site_no" VARCHAR(9)   NOT NULL,
    "class_b_airspace" VARCHAR(1),
    "class_c_airspace" VARCHAR(1),
    "class_d_airspace" VARCHAR(1),
    "class_e_airspace" VARCHAR(1),
    "airspace_hrs" VARCHAR(300),
    CONSTRAINT "pk_cls_arsp" PRIMARY KEY (
        "site_no"
     )
);

CREATE TABLE "frq" (
    "facility_type" VARCHAR(12)   NOT NULL,
    "fac_site_no" VARCHAR(9),
    "tower_hrs" VARCHAR(200),
    "serviced_facility" VARCHAR(30)   NOT NULL,
    "tower_or_comm_call" VARCHAR(50),
    "primary_approach_radio_call" VARCHAR(50),
    "freq" VARCHAR(40),
    "sectorization" VARCHAR(50),
    "freq_use" VARCHAR(600)
);

ALTER TABLE "apt_rwy" ADD CONSTRAINT "fk_apt_rwy_site_no" FOREIGN KEY("site_no")
REFERENCES "apt_base" ("site_no")

ALTER TABLE "apt_rwy_end" ADD CONSTRAINT "fk_apt_rwy_end_site_no" FOREIGN KEY("site_no")
REFERENCES "apt_base" ("site_no");

ALTER TABLE "atc_atis" ADD CONSTRAINT "fk_atc_atis_site_no" FOREIGN KEY("site_no")
REFERENCES "apt_base" ("site_no");

ALTER TABLE "awos" ADD CONSTRAINT "fk_awos_site_no" FOREIGN KEY("site_no")
REFERENCES "apt_base" ("site_no");

ALTER TABLE "cls_arsp" ADD CONSTRAINT "fk_cls_arsp_site_no" FOREIGN KEY("site_no")
REFERENCES "apt_base" ("site_no");

ALTER TABLE "frq" ADD CONSTRAINT "fk_frq_serviced_facility" FOREIGN KEY("serviced_facility")
REFERENCES "apt_base" ("arpt_id");

