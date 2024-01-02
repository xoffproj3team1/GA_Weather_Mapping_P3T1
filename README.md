# GA_Weather_Mapping_P3T1
Weather Mapping for General Aviation

Christophe V., Immanuel O., Vanessa V., Max O., Thanos C.

## Overview ##
While commercial aviation is one of the safest method of transportation, the General Aviation (GA) community is still plagued with a much higher rate of accidents and casualties.<br>
Many reasons can explain these statistics: while commercial flights are crewed by a team of highly trained professional pilots with stringent currency requirements flying modern computer-operated aircrafts maintained by specialized mechanics under the supervision of governamental agencies, the GA planes are in average 47 years old (in the US) with very few safeguards and are operated by single pilots whose proficiency and recent experience might lag over time. Most of the General Aviation accidents are caused by pilot errors and a significant portion of them are linked to encounters with bad weather that exceed the capabilities of the pilot and the plane. For example, flying into a cloud can cause spatial disorientation for pilots not instrument-rated leading to a loss of control in less that 3 minutes (University of Illinois study - 1954). Lack of visibility is also the main cause for flying an aircraft into terrain. The deposition of ice on the airfoils degrades the lift dramatically to the point where a stall occurs, and a turbulence that would be a mere bump in a jumbo jet can flip a GA airplane and exceed its structural resistance. It is the reason why the FAA puts a lot of emphasis on weather avoidance during pilot training, but accessing and analysing the relevant weather information in preparation for a flight can be challenging.<br>
The goal of this application is to provide a visual interpretation of the flight conditions to be expected for the pilot to decide if they are safe for flying based on the plane capabilities and on the pilot personal minima (minimum weather he or she is comfortable to fly into).<br>


## Features ##
The application displays by default a __METAR layer__ containing color-coded circles for about 4,880 airports in the US. The layer can be toggled on and off. The color coding follows a FAA standard and therefore does not need a legend:
<ul>Green: Visual Flight Rule (VFR) when the cloud ceiling is greater than 3,000 feet and the visibility greater than 5 statute miles</ul>
<ul>Blue: Marginal Visual Flight Rule (MVFR) when the cloud ceiling is 1,000 feet to 3,000 feet and/or the visibility 3 to 5 miles inclusive</ul>
<ul>RED: Instrument Flight Rule (IFR) when the cloud ceiling is 500 feet to less than 1,000 feet and/or the visibility 1 to less than 5 statute miles</ul>
<ul>Purple: Low Instrument Flight Rule (LIFR) when the cloud ceiling is less than 500 feet and/or the visibility less than 1 statute miles</ul>
<ul>Grey: When no weather information is available</ul>
Clicking on a circle will open a popup window containing dynamically populated information relative to the airport:
<ul> airport code</ul>
<ul> airport ICAO code </ul>
<ul> airport name </ul>
<ul> airport elevation </ul>
<ul> traffic pattern altitude (TPS) when available, and calculated (estimated) when not provided </ul>
<ul> airport visibility when available </ul>
<ul> airport ceiling when available </ul>
<ul> airport runway orientation </ul>
<ul> airport runway length when available</ul>
<ul> airport runway width when available</ul>
<ul> dynamically calculated crosswind and headwind for each runway direction when weather information is available</ul>
<ul> a "Right Pattern" flag (RP) when the approach pattern to a specific runway is non-standard</ul>
<ul> Raw shorthand weather information in a format familiar to pilots</ul>
<ul> GMT time when the weather information was collected</ul>
<br>
By entering the airport codes in input field located in the top left corner, the user will jump directly to the airport location on the map. Both the airport code and the ICAO code are accepted, for example SFO or KSFO for San Francisco Intl., LAX or KLAX for Los Angeles International, etc.
<br>
<br>
In addition to the individual airport information, the app provides additional layers relative to inflight weather information advisories currently active in the national airspace. They follow the FAA classification for SIGMET (Significant Meteorological Information) and AIRMET (AIRman's METeorological Information) corresponding to specific flight risks. Clicking on the polygons will open a popup window with the raw shorthand information describing the boundaries of the polygons and some additional weather-related details. They also include the time window when the advisory is valid.<br>

