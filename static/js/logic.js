
// To recenter the map on the airport entered in the submit field
function submitForm() {
  // console.log(airport.value);
  d3.json("airport_weather_data.json").then(metarInfo => {
    // console.log(metarInfo); // To be removed
    // console.log(metarInfo.length) // To be removed
    let arpt_coord = [];
    for (let i = 0; i < metarInfo.length; i++) {
      // console.log(metarInfo[i].arpt_id);  // To be removed
      if ((metarInfo[i].arpt_id == airport.value.toUpperCase()) || (metarInfo[i].icao_id == airport.value.toUpperCase())) {
        console.log(metarInfo[i].arpt_id == airport.value.toUpperCase());
        console.log(metarInfo[i].icao_id == airport.value.toUpperCase());
        arpt_coord.push(metarInfo[i].lat_decimal, metarInfo[i].long_decimal);
        console.log(arpt_coord)
        break
      }
    };
    myMap.setView(new L.LatLng(arpt_coord[0],arpt_coord[1]), 12);
  })
};










//******************************************************************
// Create the BaseMap.

// Create the tile layers that will be the background of our map.
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

let googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
  maxZoom: 20,
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

let faaSectional = L.tileLayer('http://wms.chartbundle.com/tms/1.0.0/sec/{z}/{x}/{-y}.png');
let faaIFRLow = L.tileLayer('http://wms.chartbundle.com/tms/1.0.0/enrl/{z}/{x}/{-y}.png');


// Create a baseMaps object to hold the map layers.
let baseMaps = {
  "Street Map": street,
  "Topo": topo,
  "Satellite Map": googleSat,
  "Sectional Map": faaSectional,
  "IFR Enroute Low Map": faaIFRLow
};

// Create an overlayMaps object to hold the airport layer and airsigmet layer.
let overlayMaps = {};

// Create the map object with googleSat preselected.
let myMap = L.map("map", {
  center: [39.6, -97.0],
  zoom: 5,
  layers: [googleSat]

});


// Add the legend. The styling is done in the style.css file
var legend = L.control({ position: "bottomright" });

legend.onAdd = function (map) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>SIGMET</h4>";
  div.innerHTML += '<i style="background: #053fcb"></i><span>Convective</span><br>';
  div.innerHTML += '<i style="background: #4c7ffb"></i><span>Turbulences</span><br>';
  div.innerHTML += '<i style="background: #abbce7"></i><span>Icing</span><br>';
  div.innerHTML += "<h4>AIRMET</h4>";
  div.innerHTML += '<i style="background: #891e9d"></i><span>Mountain Obscuration</span><br>';
  div.innerHTML += '<i style="background: #95fbfe"></i><span>Icing</span><br>';
  div.innerHTML += '<i style="background: #477e17"></i><span>Turbulence Low</span><br>';
  div.innerHTML += '<i style="background: #85b958"></i><span>Turbulence High</span><br>';
  div.innerHTML += '<i style="background: #440d8d"></i><span>IFR</span><br>';
  // div.innerHTML += '<i style="background: #ff5f65"></i><span>>90</span><br>';
  return div;
};

legend.addTo(myMap);


//   Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
let control_layer = L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
})
control_layer.addTo(myMap);


//******************************************************************





//******************************************************************

// Addition of the airport makers

// Pull the "flight_category property from response.data.
d3.json("airport_weather_data.json").then(airport_json => {

    // Initialize an array to hold the airport circles.
    let metarMarkers = [];

    console.log(`number of stations reporting: ${airport_json.length}`);
    // Loop through the stations array.
    // For each stations, create a circle, and bind a popup with the station's data.
    
    // Create a function to change the color as a function of the flight_category.
    function airportColor(i,category){
      let circleColor="";
      let text1=  `<h2>${airport_json[i].arpt_id} / ${airport_json[i].icao_id}</h2>
                <h3> ${airport_json[i].arpt_name}</h3>
                <h3> Airport Elevation: ${Math.round(airport_json[i].elev)} (ft MSL)</h3>
                <h3> Airport visibility: ${airport_json[i].visibility_statute_mi} (SM)</h3>
                <h3> Airport ceiling: ${airport_json[i].cloud_base_ft_agl} (ft AGL)</h3>
                <h3> ${airport_json[i].raw_text}</h3>
                <h4>Time: ${new Date(airport_json[i].observation_time).toUTCString()} </h4>
                `;
      let text2=`<h2>${airport_json[i].arpt_id}</h2>
                <h3> ${airport_json[i].arpt_name}</h3>
                <h3> Airport Elevation: ${Math.round(airport_json[i].elev)} (ft)</h3>
                <h3> No weather information</h3>
                `;

      if (category == "LIFR") {
        circleColor="#ab28c3";
        text_metar=text1
      }
      else if (category == "IFR") {
        circleColor="#c52d0e";
        text_metar=text1
      }
      else if (category == "MVFR") {
        circleColor="#3458cd";
        text_metar=text1
      }
      else if (category == "VFR") {
        circleColor="#77cd2d";
        text_metar=text1
      }
      else {
        circleColor="#C8C8C8";
        text_metar=text2
      }

      var marker = L.circle([airport_json[i].lat_decimal, airport_json[i].long_decimal], {
        color: "",
        fillColor: circleColor,
        fillOpacity: 0.7,
        radius: 5000
      })
        .bindPopup(text_metar);
      return marker
        };

    
    for (let i = 0; i < airport_json.length; i++) {
      metarMarkers.push(airportColor(i,airport_json[i].flight_category))
      };

    
    // Create an overlayMaps object to hold the airport layer.
    var metarLayer = L.layerGroup(metarMarkers);
    // addOverLay(metarLayer,'Metar')
    metarLayer.addTo(myMap);
    control_layer.addOverlay(metarLayer,"METAR")


  });


//     // <h2>Depth ${response.features[i].geometry.coordinates[2].toLocaleString()} km</h2> // Reminder to convert numbers to text in the popup window. To be removed
//     // ***********************************************************************************************
//******************************************************************




//******************************************************************
// Add airmet and sigmet polygones

d3.json("airsigmet_data.json").then(airport_json => {

  var sigConv = [];
  var sigTurb = []
  var sigIce = []
  var airMtnObsc = [];
  var airIce = [];
  var airTurbHigh = [];
  var airTurbLow = [];
  var airIFR = [];


  console.log(`number of AIRMET/SIGMET entries: ${airport_json.length}`);

  for (let i = 0; i < airport_json.length; i++) {

    var test3 = airport_json[i].lat_lon_points;

    // console.log(`row ${i}: lat_lon= ${test3}`); // to be removed
    // console.log(test3 !== null); // to be removed

    // if (typeof test3 !== "undefined" && test3 !== null){
    if (test3 !== null) {
      // console.log(test3 !== null); // to be removed
      if (airport_json[i].airsigmet_type == "SIGMET" && airport_json[i].hazard == "CONVECTIVE") {
        var airsigmetColor = "#053fcb";
        var airsigmetZone = L.polygon(airport_json[i].lat_lon_points, {
          color: airsigmetColor,
          fillColor: airsigmetColor,
          fillOpacity: 0.2,
        })
          .bindPopup(
            `<h2>${airport_json[i].hazard}</h2>
          <h3> Severity: ${airport_json[i].severity} </h3>
          <h3> Details: ${airport_json[i].raw_text} </h3>
          <h3>min alt MSL: ${airport_json[i].min_ft_msl}</h3>
          <h3>max alt MSL: ${airport_json[i].max_ft_msl}</h3>
          <h4>Valid time from: ${new Date(airport_json[i].valid_time_from).toUTCString()} </h4>
          <h4>Valid time to: ${new Date(airport_json[i].valid_time_to).toUTCString()} </h4>
          `);

        sigConv.push(airsigmetZone)
      };

      if (airport_json[i].airsigmet_type == "SIGMET" && airport_json[i].hazard == "TURB") {
        var airsigmetColor = "#4c7ffb";
        var airsigmetZone = L.polygon(airport_json[i].lat_lon_points, {
          color: airsigmetColor,
          fillColor: airsigmetColor,
          fillOpacity: 0.2,
        })
          .bindPopup(
            `<h2>${airport_json[i].hazard}</h2>
          <h3> Severity: ${airport_json[i].severity} </h3>
          <h3> Details: ${airport_json[i].raw_text} </h3>
          <h3>min alt MSL: ${airport_json[i].min_ft_msl}</h3>
          <h3>max alt MSL: ${airport_json[i].max_ft_msl}</h3>
          <h4>Valid time from: ${new Date(airport_json[i].valid_time_from).toUTCString()} </h4>
          <h4>Valid time to: ${new Date(airport_json[i].valid_time_to).toUTCString()} </h4>
          `);

        sigTurb.push(airsigmetZone)
      };

      if (airport_json[i].airsigmet_type == "SIGMET" && airport_json[i].hazard == "ICE") {
        var airsigmetColor = "#abbce7";
        var airsigmetZone = L.polygon(airport_json[i].lat_lon_points, {
          color: airsigmetColor,
          fillColor: airsigmetColor,
          fillOpacity: 0.2,
        })
          .bindPopup(
            `<h2>${airport_json[i].hazard}</h2>
          <h3> Severity: ${airport_json[i].severity} </h3>
          <h3> Details: ${airport_json[i].raw_text} </h3>
          <h3>min alt MSL: ${airport_json[i].min_ft_msl}</h3>
          <h3>max alt MSL: ${airport_json[i].max_ft_msl}</h3>
          <h4>Valid time from: ${new Date(airport_json[i].valid_time_from).toUTCString()} </h4>
          <h4>Valid time to: ${new Date(airport_json[i].valid_time_to).toUTCString()} </h4>
          `);

        sigIce.push(airsigmetZone)
      };


      if (airport_json[i].airsigmet_type == "AIRMET" && airport_json[i].hazard == "MTN OBSCN") {
        var airsigmetColor = "#891e9d";
        var airsigmetZone = L.polygon(airport_json[i].lat_lon_points, {
          color: airsigmetColor,
          fillColor: airsigmetColor,
          fillOpacity: 0.2,
        })
          .bindPopup(
            `<h2>${airport_json[i].hazard}</h2>
            <h3> Severity: ${airport_json[i].raw_text} </h3>
          <h4>Valid time from: ${new Date(airport_json[i].valid_time_from).toUTCString()} </h4>
          <h4>Valid time to: ${new Date(airport_json[i].valid_time_to).toUTCString()} </h4>
          `);

        airMtnObsc.push(airsigmetZone)
      };


      if (airport_json[i].airsigmet_type == "AIRMET" && airport_json[i].hazard == "ICE") {
        var airsigmetColor = "#95fbfe";
        var airsigmetZone = L.polygon(airport_json[i].lat_lon_points, {
          color: airsigmetColor,
          fillColor: airsigmetColor,
          fillOpacity: 0.2,
        })
          .bindPopup(
            `<h2>${airport_json[i].hazard}</h2>
          <h3> Severity: ${airport_json[i].severity} </h3>
          <h3> Details: ${airport_json[i].raw_text} </h3>
          <h3>min alt MSL: ${airport_json[i].min_ft_msl}</h3>
          <h3>max alt MSL: ${airport_json[i].max_ft_msl}</h3>
          <h4>Valid time from: ${new Date(airport_json[i].valid_time_from).toUTCString()} </h4>
          <h4>Valid time to: ${new Date(airport_json[i].valid_time_to).toUTCString()} </h4>
          `);

        airIce.push(airsigmetZone)
      };


      if (airport_json[i].airsigmet_type == "AIRMET" && airport_json[i].hazard == "TURB"&& airport_json[i].min_ft_msl <=12000) {
        var airsigmetColor = "#477e17";
        var airsigmetZone = L.polygon(airport_json[i].lat_lon_points, {
          color: airsigmetColor,
          fillColor: airsigmetColor,
          fillOpacity: 0.2,
        })
          .bindPopup(
            `<h2>${airport_json[i].hazard}</h2>
          <h3> Severity: ${airport_json[i].severity} </h3>
          <h3> Details: ${airport_json[i].raw_text} </h3>
          <h3>min alt MSL: ${airport_json[i].min_ft_msl}</h3>
          <h3>max alt MSL: ${airport_json[i].max_ft_msl}</h3>
          <h4>Valid time from: ${new Date(airport_json[i].valid_time_from).toUTCString()} </h4>
          <h4>Valid time to: ${new Date(airport_json[i].valid_time_to).toUTCString()} </h4>
          `);

        airTurbLow.push(airsigmetZone)
      };


      if (airport_json[i].airsigmet_type == "AIRMET" && airport_json[i].hazard == "TURB" && airport_json[i].min_ft_msl >12000) {
        var airsigmetColor = "#85b958";
        var airsigmetZone = L.polygon(airport_json[i].lat_lon_points, {
          color: airsigmetColor,
          fillColor: airsigmetColor,
          fillOpacity: 0.2,
        })
          .bindPopup(
            `<h2>${airport_json[i].hazard}</h2>
          <h3> Severity: ${airport_json[i].severity} </h3>
          <h3> Details: ${airport_json[i].raw_text} </h3>
          <h3>min alt MSL: ${airport_json[i].min_ft_msl}</h3>
          <h3>max alt MSL: ${airport_json[i].max_ft_msl}</h3>
          <h4>Valid time from: ${new Date(airport_json[i].valid_time_from).toUTCString()} </h4>
          <h4>Valid time to: ${new Date(airport_json[i].valid_time_to).toUTCString()} </h4>
          `);

        airTurbHigh.push(airsigmetZone)
      };


      if (airport_json[i].airsigmet_type == "AIRMET" && airport_json[i].hazard == "IFR") {
        var airsigmetColor = "#440d8d";
        var airsigmetZone = L.polygon(airport_json[i].lat_lon_points, {
          color: airsigmetColor,
          fillColor: airsigmetColor,
          fillOpacity: 0.2,
        })
          .bindPopup(
            `<h2>${airport_json[i].hazard}</h2>
            <h3> Details: ${airport_json[i].raw_text} </h3>
          <h3>min alt MSL: ${airport_json[i].min_ft_msl}</h3>
          <h3>max alt MSL: ${airport_json[i].max_ft_msl}</h3>
          <h4>Valid time from: ${new Date(airport_json[i].valid_time_from).toUTCString()} </h4>
          <h4>Valid time to: ${new Date(airport_json[i].valid_time_to).toUTCString()} </h4>
          `);

        airIFR.push(airsigmetZone)
      };

    };

  };

  var sigConvLayer = L.layerGroup(sigConv);
  var sigTurbLayer = L.layerGroup(sigTurb);
  var sigIceLayer = L.layerGroup(sigIce);
  var airMtnObscLayer = L.layerGroup(airMtnObsc);
  var airIceLayer = L.layerGroup(airIce);
  var airTurbLowLayer = L.layerGroup(airTurbLow);
  var airTurbHighLayer = L.layerGroup(airTurbHigh);
  var airIFRLayer = L.layerGroup(airIFR);

  // sigConvLayer.addTo(myMap);
  // sigTurbLayer.addTo(myMap);
  // sigIceLayer.addTo(myMap);
  // airMtnObscLayer.addTo(myMap);
  // airIceLayer.addTo(myMap);
  // airTurbLowLayer.addTo(myMap);
  // airTurbHighLayer.addTo(myMap);
  // airIFRLayer.addTo(myMap);

  control_layer.addOverlay(sigConvLayer,"SIGMET Convective")
  control_layer.addOverlay(sigTurbLayer,"SIGMET Turbulences")
  control_layer.addOverlay(sigIceLayer,"SIGMET Icing")
  control_layer.addOverlay(airMtnObscLayer,"Mountain Obscuration")
  control_layer.addOverlay(airIceLayer,"Icing")
  control_layer.addOverlay(airTurbLowLayer,"Turbulences Low")
  control_layer.addOverlay(airTurbHighLayer,"Turbulences High >FL120")
  control_layer.addOverlay(airIFRLayer,"IFR")


});
//******************************************************************



