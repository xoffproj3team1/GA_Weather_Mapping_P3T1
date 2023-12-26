
// Center the map and the zoom to view CONUS + Alaska + Hawaii
let conusCoords = [39.6, -97.0];
let mapZoomLevel = 5; // Note that the value corresponds to different zoom levels on Open Street and on Google.



// Create the createMap function.
function createMap(overlayLayers) {

  // Create the tile layers that will be the background of our map.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  let googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
  });


  // Create a baseMaps object to hold the map layers.
  let baseMaps = {
    "Street Map": street,
    "Topo": topo,
    "Satellite Map": googleSat
  };

  // Create an overlayMaps object to hold the earthquake layer and the tectonic boundaries layer.
  let overlayMaps = overlayLayers;

  // Create the map object with options preselected for Part2.
  let myMap = L.map("map", {
    center: conusCoords,
    zoom: mapZoomLevel,
    layers: [googleSat]

  });


  // Add the legend. The styling is done in the style.css file
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>AirMet SigMet</h4>";
    div.innerHTML += '<i style="background: #4c7ffb"></i><span>Convective</span><br>';
    div.innerHTML += '<i style="background: #891e9d"></i><span>Mountain Obscuration</span><br>';
    div.innerHTML += '<i style="background: #95fbfe"></i><span>Icing</span><br>';
    div.innerHTML += '<i style="background: #477e17"></i><span>Turbulence</span><br>';
    div.innerHTML += '<i style="background: #440d8d"></i><span>IFR</span><br>';
    // div.innerHTML += '<i style="background: #ff5f65"></i><span>>90</span><br>';
    return div;
  };

  legend.addTo(myMap);


  //   Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
};   // end of the createMap function



// Create the createMarkers function.
function createMarkers(response,response2) {
  // Pull the "flight_category property from response.data.
  response.then(response => {

    // // Initialize an array to hold the airport circles.
    let metarMarkers = [];

    console.log(`number of stations reporting: ${response.length}`);
    // // Loop through the stations array.
    
    
    // THIS SECTION USES CIRCLES
    // For each stations, create a circle, and bind a popup with the station's data.
    for (let i = 0; i < response.length; i++) {
      // Create a function to change the color as a function of the flight_category.
      function stationColor(flight_category) {
        var colormetar = "";
        if (flight_category =="MIFR") { colormetar = "#ab28c3" }
        else if (flight_category =="IFR") { colormetar = "#c52d0e" }
        else if (flight_category =="MVFR") { colormetar = "#3458cd" }
        else { colormetar = "#77cd2d" };

        return colormetar;
      };
      // console.log(new Date(response.features[i].properties.time).toUTCString());
      var marker = L.circle([response[i].latitude, response[i].longitude], {
        color: "",
        fillColor: stationColor(response[i].flight_category),
        fillOpacity: 0.7,
        radius: 5000    // Need to find a way to display the size in pixels
      })
      .bindPopup(
        `<h2>${response[i].station_id}</h2>  <h3> ${response[i].raw_text}</h3>
        
        <h4>Time: ${new Date(response[i].observation_time).toUTCString()} </h4>
        `)

        metarMarkers.push(marker);
    };  // End of the markers with Circles section

    // <h2>Depth ${response.features[i].geometry.coordinates[2].toLocaleString()} km</h2> // Reminder to convert numbers to text in the popup window. To be removed



    // // THIS SECTION USES MARKERS WITH ICONS: Works but is slowers than when using Circles
    // // For each stations, create a circle, and bind a popup with the station's data.
    // for (let i = 0; i < response.length; i++) {
    //   // Create a function to change the color as a function of the flight_category.
    //   function stationColor(flight_category) {
  
    //     if (flight_category =="MIFR") { 
    //       var myICon = L.icon({
    //         iconUrl: 'MIFR_icon.png',
    //         iconSize: [18,18],
    //         iconAnchor: [9, 9],
    //         popupAnchor: [-3, -76] })}
    //     else if (flight_category =="IFR") {
    //       var myICon = L.icon({
    //         iconUrl: 'IFR_icon.png',
    //         iconSize: [18,18],
    //         iconAnchor: [9, 9],
    //         popupAnchor: [-3, -76] })}
    //     else if (flight_category =="MVFR") {
    //       var myICon = L.icon({
    //         iconUrl: 'MVFR_icon.png',
    //         iconSize: [18,18],
    //         iconAnchor: [9, 9],
    //         popupAnchor: [-3, -76] })}
    //     else { 
    //       var myICon = L.icon({
    //         iconUrl: 'VFR_icon.png',
    //         iconSize: [18,18],
    //         iconAnchor: [9, 9],
    //         popupAnchor: [-3, -76] })};

    //     return myICon;
    //   };
    //   // console.log(new Date(response.features[i].properties.time).toUTCString());
    //   var marker = L.marker([response[i].latitude, response[i].longitude], {
    //     icon: stationColor(response[i].flight_category)
    //   })
    //   .bindPopup(
    //     `<h2>${response[i].station_id}</h2>  <h3> ${response[i].raw_text}</h3>
        
    //     <h4>Time: ${new Date(response[i].observation_time).toUTCString()} </h4>
    //     `)

    //     metarMarkers.push(marker);
    // };  // End of the markers with Icon section




    // Add airmet and sigmet polygones
    response2.then(response2 => {
      var sigConv = [];
      var airMtnObsc = [];
      var airIce = [];
      var airTurb = [];
      var airIFR = [];


      console.log(`number of entries: ${response2.length}`);
      
      for (let i = 0; i < response2.length; i++) {

        var test3 = response2[i].lat_lon_points;  

        // console.log(`row ${i}: lat_lon= ${test3}`); // to be removed
        // console.log(test3 !== null); // to be removed

        // if (typeof test3 !== "undefined" && test3 !== null){
        if (test3 !== null){    
          // console.log(test3 !== null); // to be removed
          if (response2[i].airsigmet_type=="SIGMET" && response2[i].hazard=="CONVECTIVE") {
            var airsigmetColor="#4c7ffb";
            var airsigmetZone = L.polygon(response2[i].lat_lon_points, {
              color: airsigmetColor,
              fillColor: airsigmetColor,
              fillOpacity: 0.2,
            })
            .bindPopup(
              `<h2>${response2[i].hazard}</h2>
              <h3> Severity: ${response2[i].severity} </h3>
              <h3>min alt MSL: ${response2[i].min_ft_msl}</h3>
              <h3>max alt MSL: ${response2[i].max_ft_msl}</h3>
              <h4>Valid time from: ${new Date(response2[i].valid_time_from).toUTCString()} </h4>
              <h4>Valid time to: ${new Date(response2[i].valid_time_to).toUTCString()} </h4>
              `);

            sigConv.push(airsigmetZone)};
          

          if (response2[i].airsigmet_type=="AIRMET" && response2[i].hazard=="MTN OBSCN") {
            var airsigmetColor="#891e9d";
            var airsigmetZone = L.polygon(response2[i].lat_lon_points, {
              color: airsigmetColor,
              fillColor: airsigmetColor,
              fillOpacity: 0.2,
            })
            .bindPopup(
              `<h2>${response2[i].hazard}</h2>
              <h4>Valid time from: ${new Date(response2[i].valid_time_from).toUTCString()} </h4>
              <h4>Valid time to: ${new Date(response2[i].valid_time_to).toUTCString()} </h4>
              `);

            airMtnObsc.push(airsigmetZone)};


          if (response2[i].airsigmet_type=="AIRMET" && response2[i].hazard=="ICE") {
            var airsigmetColor="#95fbfe";
            var airsigmetZone = L.polygon(response2[i].lat_lon_points, {
              color: airsigmetColor,
              fillColor: airsigmetColor,
              fillOpacity: 0.2,
            })
            .bindPopup(
              `<h2>${response2[i].hazard}</h2>
              <h3> Severity: ${response2[i].severity} </h3>
              <h3>min alt MSL: ${response2[i].min_ft_msl}</h3>
              <h3>max alt MSL: ${response2[i].max_ft_msl}</h3>
              <h4>Valid time from: ${new Date(response2[i].valid_time_from).toUTCString()} </h4>
              <h4>Valid time to: ${new Date(response2[i].valid_time_to).toUTCString()} </h4>
              `);

            airIce.push(airsigmetZone)};


          if (response2[i].airsigmet_type=="AIRMET" && response2[i].hazard=="TURB") {
            var airsigmetColor="#477e17";
            var airsigmetZone = L.polygon(response2[i].lat_lon_points, {
              color: airsigmetColor,
              fillColor: airsigmetColor,
              fillOpacity: 0.2,
            })
            .bindPopup(
              `<h2>${response2[i].hazard}</h2>
              <h3> Severity: ${response2[i].severity} </h3>
              <h3>min alt MSL: ${response2[i].min_ft_msl}</h3>
              <h3>max alt MSL: ${response2[i].max_ft_msl}</h3>
              <h4>Valid time from: ${new Date(response2[i].valid_time_from).toUTCString()} </h4>
              <h4>Valid time to: ${new Date(response2[i].valid_time_to).toUTCString()} </h4>
              `);

            airTurb.push(airsigmetZone)};


          if (response2[i].airsigmet_type=="AIRMET" && response2[i].hazard=="IFR") {
            var airsigmetColor="#440d8d";
            var airsigmetZone = L.polygon(response2[i].lat_lon_points, {
              color: airsigmetColor,
              fillColor: airsigmetColor,
              fillOpacity: 0.2,
            })
            .bindPopup(
              `<h2>${response2[i].hazard}</h2>
              <h3>min alt MSL: ${response2[i].min_ft_msl}</h3>
              <h3>max alt MSL: ${response2[i].max_ft_msl}</h3>
              <h4>Valid time from: ${new Date(response2[i].valid_time_from).toUTCString()} </h4>
              <h4>Valid time to: ${new Date(response2[i].valid_time_to).toUTCString()} </h4>
              `);

            airIFR.push(airsigmetZone)};

          };

      };

      // if (typeof test3 !== "undefined" && test3 !== null){ 

      var metarLayer = L.layerGroup(metarMarkers);
      var sigConvLayer = L.layerGroup(sigConv);
      var airMtnObscLayer = L.layerGroup(airMtnObsc);
      var airIceLayer = L.layerGroup(airIce);
      var airTurLayer = L.layerGroup(airTurb);
      var airIFRLayer = L.layerGroup(airIFR); 

      let overlayLayers = {
        "METAR": metarLayer,
        "SIGMET Convective": sigConvLayer,
        "Mountain Obscuration": airMtnObscLayer,
        "Icing": airIceLayer,
        "Turbulence": airTurLayer,
        "IFR": airIFRLayer,
      };


    createMap(overlayLayers);

    }); // end of the response2 promise

  }); // end of the response promise

}; // end of the function createMarkers


let airsigmetInfo = d3.json("airsigmet_data.json");   // Need to move it to the resource folder
let metartInfo = d3.json("metar_data.json");   // Need to move it to the resource folder

createMarkers(metartInfo,airsigmetInfo);
