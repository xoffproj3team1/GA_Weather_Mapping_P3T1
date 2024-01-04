# GA_Weather_Mapping_P3T1
Weather Mapping for General Aviation

Christophe V., Immanuel O., Vanessa V., Max O., Thanos C.

## Overview ##
While commercial aviation is one of the safest method of transportation, the General Aviation (GA) community is still plagued with a much higher rate of accidents and casualties.<br>
Many reasons can explain these statistics: while commercial flights are crewed by a team of highly trained professional pilots with stringent currency requirements flying modern computer-operated aircrafts maintained by specialized mechanics under the supervision of governamental agencies, the GA planes are in average 47 years old (in the US) with very few safeguards and are operated by single pilots whose proficiency and recent experience might lag over time. Most of the General Aviation accidents are caused by pilot errors and a significant portion of them are linked to encounters with bad weather that exceed the capabilities of the pilot and the plane. For example, flying into a cloud can cause spatial disorientation for pilots not instrument-rated leading to a loss of control in less that 3 minutes (University of Illinois study - 1954). Lack of visibility is also the main cause for flying an aircraft into terrain. The deposition of ice on the airfoils degrades the lift dramatically to the point where a stall occurs, and a turbulence that would be a mere bump in a jumbo jet can flip a GA airplane and exceed its structural resistance. It is the reason why the FAA puts a lot of emphasis on weather avoidance during pilot training, but accessing and analysing the relevant weather information in preparation for a flight can be challenging.<br>
The goal of this application is to provide a visual interpretation of the flight conditions to be expected for the pilot to decide if they are safe for flying based on the plane capabilities and on the pilot personal minima (minimum weather he or she is comfortable to fly into).<br>
As best summarized by an old aviation saying: “<i>It’s better to be on the ground wishing you were in the air than in the air wishing you were on the ground.</i>”


## Features ##
The application (https://ga-weather-mapping.onrender.com/) displays by default a __METAR layer__ containing color-coded circles for about 4,880 airports in the US.<br>
<br><br>
<img width="576" alt="Webpage_landing" src="https://github.com/xoffproj3team1/GA_Weather_Mapping_P3T1/assets/154548045/a6137341-4306-42fa-9f75-a9a885cfcd0b">
<br> <i> Website landing page </i>
<br>

The layer can be toggled on and off. The color coding follows a FAA standard and therefore does not need a legend:
- Green: Visual Flight Rule (VFR) when the cloud ceiling is greater than 3,000 feet and the visibility greater than 5 statute miles
- Blue: Marginal Visual Flight Rule (MVFR) when the cloud ceiling is 1,000 feet to 3,000 feet and/or the visibility 3 to 5 miles inclusive
- RED: Instrument Flight Rule (IFR) when the cloud ceiling is 500 feet to less than 1,000 feet and/or the visibility 1 to less than 5 statute miles
- Purple: Low Instrument Flight Rule (LIFR) when the cloud ceiling is less than 500 feet and/or the visibility less than 1 statute miles
- Grey: When no weather information is available
<br><br>
<img width="444" alt="METAR_color_coding" src="https://github.com/xoffproj3team1/GA_Weather_Mapping_P3T1/assets/154548045/44120383-a8af-4074-ae11-ac8827f6b6c0">
<br> <i> View of the airports in the San Francisco Bay Area </i>
<br><br>
Clicking on a circle will open a popup window containing dynamically populated information relative to the airport:
- airport code
- airport ICAO code 
- airport name 
- airport elevation 
- traffic pattern altitude (TPS) when available, and calculated (estimated) when not provided 
- airport visibility when available 
- airport ceiling when available 
- airport runway orientation 
- airport runway length when available
- airport runway width when available
- dynamically calculated crosswind and headwind for each runway direction when weather information is available
- dynamically calculated gust crosswind and gust headwind for each runway direction when relevant
- a "Right Pattern" flag (RP) when the approach pattern to a specific runway is non-standard
- Raw shorthand weather information in a format familiar to pilots
- GMT time when the weather information was collected
<br><br>
<img width="411" alt="SJC_weather_info" src="https://github.com/xoffproj3team1/GA_Weather_Mapping_P3T1/assets/154548045/2b7878ac-e7af-4603-a24d-d979fb52b133">
<br> <i> Airport details and current weather conditions at the San Jose, CA airport </i>
<br><br>
By entering the airport codes in input field located in the top left corner, the user will jump directly to the airport location on the map. Both the airport code and the ICAO code are accepted, for example SFO or KSFO for San Francisco Intl., LAX or KLAX for Los Angeles International, etc.
<br><br>
<img width="347" alt="user_entry" src="https://github.com/xoffproj3team1/GA_Weather_Mapping_P3T1/assets/154548045/f8e8a974-c0d5-4ea7-ae6f-ab6b64f133c2">
<br> <i> Input field to jump directly to the airport of choice </i>

<br><br>
In addition to the individual airport information, the app provides additional layers relative to inflight weather information advisories currently active in the national airspace.
<br><br>
<img width="576" alt="icing_airmet" src="https://github.com/xoffproj3team1/GA_Weather_Mapping_P3T1/assets/154548045/e12aedfa-0aa0-4c27-9c59-c61e22bb799b">
<br> <i> Example of an AIRMET advisory about icing </i>
<br><br>
They follow the FAA classification for SIGMET (Significant Meteorological Information) and AIRMET (AIRman's METeorological Information) corresponding to specific flight risks. Clicking on the polygons will open a popup window with the raw shorthand information describing the boundaries of the polygons and some additional weather-related details. They also include the time window when the advisory is valid.<br>
<br><br>

<img width="1639" alt="icing_popup" src="https://github.com/xoffproj3team1/GA_Weather_Mapping_P3T1/assets/154548045/c1f08b9a-1e2a-4ed9-8394-92b8f34fae47">
<br> <i> Additional details regading a specific sector at risk of icing </i>
<br><br>

## Design ##
The information about the airport comes from the FAA website (https://www.faa.gov/air_traffic/flight_info/aeronav/Aero_Data/NASR_Subscription/ ). It is valid for 28 days. It is a zip file containing 22 text files and 4 folders. One of the folder contains another zip file containing a collection of 104 PDF or CSV files. 
<br><br>
<img width="586" alt="FAA_28_Day_NASR_Subscription" src="https://github.com/xoffproj3team1/GA_Weather_Mapping_P3T1/assets/154548045/c73906f8-a257-481a-9ff0-f1ff0d318f01">
<br><br>
<img width="586" alt="FAA_28_Day_NASR_Subscription_content" src="https://github.com/xoffproj3team1/GA_Weather_Mapping_P3T1/assets/154548045/0cd237f8-48b8-4e2a-8b7b-8a4fa1f1c1a8">
<br><br>
We are going to use 5 of the CSV files to populate 5 tables in a PostgreSQL databased hosted on Render.
<br><br>
![airport_db_schema](https://github.com/xoffproj3team1/GA_Weather_Mapping_P3T1/assets/154548045/3310e43f-6b7d-4082-a28c-dbf7024541d3)
<br> <i> ERD for the airport-related tables and for the weather information table (METAR) </i>
<br><br>
This database can remain untouched for 28 days until the next cycle is made available. At this stage of the project, the CSV files are loaded manually to their corresponding table on pgAdmin 4: The permanence of the data  in the context of the complication of having the CSV files compressed, stored in a folder, and compressed again, didn't justify the prioritization of an automated retrieval process.<br>


<br>
The weather data comes from the Aviation Weather Center (https://aviationweather.gov/data/api/#/ ). Instead of polling the data for each each individual airport or SIGMET/AIRMET, we chose to collect the data for all airports at once. The Metar data (METeorological Aviation Routine Weather Report) is typically issued 5 minutes before each hour and is considered to be valid for one hour. The cache files for the METARs and SIGMET/AIRMET are nonetheless updated every minute.
<br>
<br><img width="746" alt="AWC_APIs" src="https://github.com/xoffproj3team1/GA_Weather_Mapping_P3T1/assets/154548045/73943e3d-113f-439f-9687-6513c1da7843">
<br> <i> AWC APIs </i>


<br><br>
The __weather_download.py__ file takes care of:
- Automatically extracting the data from the airsigmets.cache.csv.gz, transforming the data, and saving it as a json file that can be read by Leaflet.js with all the granularity required. The information obtained is independant of the airport database and does not justify to be added to a database table.
- Automatically extracting the weather information from the metars.cache.csv.gz file, transforming the data and uploading it to a table in the database. This is the 6th table shown in the ERD view.
- Running queries on 4 tables to join the weather information with their matching airports, running calculations about crosswind and headwind for each runway, and filtering out the airports not available to the public (military, private, closed) as well as the heliports. The airports in the FAA and AWC databases are only partially overlapping and are using inconsistent identifications, which requires additional verifications to avoid misattributions.
- Using Pandas to consolidate about 13.330 rows (one per runway direction) into about 4,880 distinct airports while keeping all the information, and saving the resulting database in a json file that Leaflet.js can use to display on the map all the airport circles with their appropriate color without visible delay.
<br><br>
The __logic.js__ file has four functions:
- Displaying a map with multiple base map options by leveraging Leaflet.js. A Google satellite view is the default.
- Placing the airports on the map with the informative popups. The METAR layer is toggled on by default.
- Managing the user interaction by identifying the airport code entered and centering the map over the selected airport.
- Displaying the indivitual layers for all categories of SIGMET and AIRMET. They are toggled off by default.
<br><br>
The __style.css__ file takes care, amongst other things, of the formating of the information in the popup text for the airports.
<br><br>
The application (code and database) run on server managed by Render.
<br><br>
<img width="956" alt="Render" src="https://github.com/xoffproj3team1/GA_Weather_Mapping_P3T1/assets/154548045/0ae5633f-802d-4fe8-b8a0-f2971c7a09f8">
<br> <i> The Web Service, the CRON Job, abd the PostgreSQL Database are hosted on Render</i>
<br><br><br>
The CRON Job runs <b>weather_download.py</b> every hour at the top of the hour. Since the CRON Job and the Web Service do not share filesystems, the output of the the CRON Job is saved in a AWS S3 bucket.
<br><br>
<img width="1081" alt="AWS_S3" src="https://github.com/xoffproj3team1/GA_Weather_Mapping_P3T1/assets/154548045/9228898d-33ab-4bda-9351-6a4f2dbe30e9">
<br> <i> The JSON files used by the Javascript are saved on Amazon Web Services</i>
<br><br><br>
The Start Command on the Web Service points to a file called __app.py__ (gunicorn app:app), that uses Flask to point to the __index.html__ file. The __index.html__ files then points to the __logic.js__ files that uses fixed URLs pointing to the JSON files from the AWS S3 Bucket.<br>
A PostgreSQL database was chosen because it is natively supported by Render, and the testing of the queries is made easy by pgAdmin 4.


## Ethical Considerations ##
The data used is not licensed and is freely provided to the public by the US Goverment.<br>


## Meeting Requirements ##
All the requirements listed in the project are met:
- The dataset contains at least 100 unique records.
  - One of the tables has about 20,000 records. The multi-table query outputs about 13,330 rows that are later displayed as about 4880 unique recors.
- The data is stored in a PostgreSQL database.
- Extensive README file with all relevant details including user instructions.
- Origine and sensitivity of the data is discussed.
- A minimum of three unique views present the data:
  - Layer with about 4,880 airports placed on the map with the corresponding visibility and ceiling information, in addition to several base map providing unique information about the environment of the airports.
  - Popups window specific to an airport with additional information about its runways and about the wind components to expect for each of them.
  - Layers with SIGMET and AIRMET information relevant to flight planning.
- The visualization follows FAA standards and is easy to interpret by any certified or student pilot.
- Additional libraries are leveraged by the code such as __psycopg2__, __gunicorn__, __boto3__ and __dotenv__.
- Leveraging of Leaflet LayerControl to add HTML menus
- Addition of an HTML input box used to move the map to a specific airport.
- Full ETL workflow with automated renewal of the METAR table.
- The Database has 8 tables (only 4 are currently used for the existing features)
- The choice of using PostgreSQL is documented.
- The ERD is in the README.
- Flask is used by the Web Service to identify the index.html file.

In addition:
- Full stack application supported on a commercial server (Render) with the integration of AWS S3.
- Code designed for scalability (addition of new features)
- Code designed to be light on the client 


