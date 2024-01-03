# GA_Weather_Mapping_P3T1
Weather Mapping for General Aviation

Christophe V., Immanuel O., Vanessa V., Max O., Thanos C.

## Overview ##
While commercial aviation is one of the safest method of transportation, the General Aviation (GA) community is still plagued with a much higher rate of accidents and casualties.<br>
Many reasons can explain these statistics: while commercial flights are crewed by a team of highly trained professional pilots with stringent currency requirements flying modern computer-operated aircrafts maintained by specialized mechanics under the supervision of governamental agencies, the GA planes are in average 47 years old (in the US) with very few safeguards and are operated by single pilots whose proficiency and recent experience might lag over time. Most of the General Aviation accidents are caused by pilot errors and a significant portion of them are linked to encounters with bad weather that exceed the capabilities of the pilot and the plane. For example, flying into a cloud can cause spatial disorientation for pilots not instrument-rated leading to a loss of control in less that 3 minutes (University of Illinois study - 1954). Lack of visibility is also the main cause for flying an aircraft into terrain. The deposition of ice on the airfoils degrades the lift dramatically to the point where a stall occurs, and a turbulence that would be a mere bump in a jumbo jet can flip a GA airplane and exceed its structural resistance. It is the reason why the FAA puts a lot of emphasis on weather avoidance during pilot training, but accessing and analysing the relevant weather information in preparation for a flight can be challenging.<br>
The goal of this application is to provide a visual interpretation of the flight conditions to be expected for the pilot to decide if they are safe for flying based on the plane capabilities and on the pilot personal minima (minimum weather he or she is comfortable to fly into).<br>
As best summarized by an old aviation saying: “It’s better to be on the ground wishing you were in the air than in the air wishing you were on the ground.”


## Features ##
The application (https://ga-weather-mapping.onrender.com/) displays by default a __METAR layer__ containing color-coded circles for about 4,880 airports in the US. The layer can be toggled on and off. The color coding follows a FAA standard and therefore does not need a legend:
- Green: Visual Flight Rule (VFR) when the cloud ceiling is greater than 3,000 feet and the visibility greater than 5 statute miles
- Blue: Marginal Visual Flight Rule (MVFR) when the cloud ceiling is 1,000 feet to 3,000 feet and/or the visibility 3 to 5 miles inclusive
- RED: Instrument Flight Rule (IFR) when the cloud ceiling is 500 feet to less than 1,000 feet and/or the visibility 1 to less than 5 statute miles
- Purple: Low Instrument Flight Rule (LIFR) when the cloud ceiling is less than 500 feet and/or the visibility less than 1 statute miles
- Grey: When no weather information is available
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
<br>
By entering the airport codes in input field located in the top left corner, the user will jump directly to the airport location on the map. Both the airport code and the ICAO code are accepted, for example SFO or KSFO for San Francisco Intl., LAX or KLAX for Los Angeles International, etc.
<br>
<br>
In addition to the individual airport information, the app provides additional layers relative to inflight weather information advisories currently active in the national airspace. They follow the FAA classification for SIGMET (Significant Meteorological Information) and AIRMET (AIRman's METeorological Information) corresponding to specific flight risks. Clicking on the polygons will open a popup window with the raw shorthand information describing the boundaries of the polygons and some additional weather-related details. They also include the time window when the advisory is valid.<br>

## Design ##
The information about the airport comes from the FAA website (https://www.faa.gov/air_traffic/flight_info/aeronav/Aero_Data/NASR_Subscription/ ). It is valid for 28 days. It is a zip file containing 22 text files and 4 folders. One of the folder contains another zip file containing a collection of 104 PDF or CSV files. We are going to use 7 of the CSV files to populate 7 tables in a PostgreSQL databased hosted on Render. This database can remain untouched for 28 days until the next cycle is made available. At this stage of the project, the CSV files are loaded manually to their corresponding table on pgAdmin 4: The permanence of the data  in the context of the complication of having the CSV files compressed, stored in a folder, and compressed again, didn't justify the prioritization of an automated retrieval process.<br>
<br>
The weather data comes from the Aviation Weather Center (https://aviationweather.gov/data/api/#/ ). Instead of polling the data for each each individual airport or SIGMET/AIRMET, we chose to coolect the data for all airports at once. The Metar data (METeorological Aviation Routine Weather Report) is typically issued 5 minutes before each hour and is considered to be valid for one hour. The cache files for the METARs and SIGMET/AIRMET are nonetheless updated every minute.
<br>
The __weather_download.py__ file takes care of:
- Automatically extracting the data from the airsigmets.cache.csv.gz, transforming the data, and saving it as a json file that can be read by Leaflet.js with all the granularity required. The information obtained is independant of the airport database and does not justify to be added to a database table.
- Automatically extracting the weather information from the metars.cache.csv.gz file, transforming the data and uploading it to a table in the database.
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
The application (code and database) run on server managed by Render. The Start Command on the Web Service points to a file called __app.py__ (gunicorn app:app), that uses Flask to point to the __index.html__ file.<br>
A PostgreSQL database was chosen because it is natively supported by Render


## Ethical Considerations ##
The data used is not licensed and is freely provided to the public by the US Goverment.<br>


## Meeting Requirements ##


