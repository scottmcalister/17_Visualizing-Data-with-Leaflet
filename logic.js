var EarthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var tectonicPlatesURL = "https://raw.githubusercontent.ccom/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

d3.json(EarthquakeURL, function(data){
	Features(data.features);
});

function Features(earthquakeData){
	var earthquakes = L.geojson(earthquakeData, {
		onEachFeature: function(feature,layer){
			layer.bindPopup("<h2>Magnitude: " + feature.properties.mag + "</h2><h2>Location: " + feature.properties.place + "</h2><hr><p>" + new Date(feature.properties.time) + "</p>");
		},
		pointtoLayer: function(feature, latlng){
			return new L.circle(latlng, 
				{radius: getRadius(feature.properties.mag),
				fillColor: getColor(feature.properties.mag),
				fillOpacity: .5,
				color: "#000",
				stroke: true,
				weight: .8})
		}
	});
	createMap(earthquakes);
}

function createMap(earthquakes){
	var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
      "access_token=pk.eyJ1Ijoic2NvdHRtY2FsaXN0ZXIxMyIsImEiOiJjamlhdWd2bzMxYjU1M3Ztcm54N2kxaDQ2In0.mGtR6lttrtiEpIqHVEIAtQ." +
      "T6YbdDixkOBWH_k9GbS8JQ");
  
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?" +
      "access_token=pk.eyJ1Ijoic2NvdHRtY2FsaXN0ZXIxMyIsImEiOiJjamlhdWd2bzMxYjU1M3Ztcm54N2kxaDQ2In0.mGtR6lttrtiEpIqHVEIAtQ." +
      "T6YbdDixkOBWH_k9GbS8JQ");

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
      "access_token=pk.eyJ1Ijoic2NvdHRtY2FsaXN0ZXIxMyIsImEiOiJjamlhdWd2bzMxYjU1M3Ztcm54N2kxaDQ2In0.mGtR6lttrtiEpIqHVEIAtQ." +
      "T6YbdDixkOBWH_k9GbS8JQ");

    var baseMaps = {
    	"Outdoors": outdoors,
    	"Satellite": satellite,
    	"Dark Map": darkmap
    };

    var tectonicplates = new L.layerGroup();
    var overlayMaps = {
    	"Earthquakes": earthquakes,
    	"Tectonic Plates: tectonicplates"
    };
    var myMap = L.map("map", {
    	center:[37.09, -95.71], 
    	zoom: 3,
    	layers: [outdoors, earthquakes,darkmap]
    });

    d3.json(tectonicPlatesURL, function(plateData){
    	L.geoJson(plateData{
    		color: "yellow",
    		weight: 2
    	})
    	.addTo(tectonicplates);
    });

    L.control.layers(baseMaps, overlayMaps, {
    	collapsed: false
    })
    .addTo(myMap);

    var legend = L.control({position: "bottomleft"});
    legend.onAdd = function(myMap){
    	var div = L.DomUtil.create("div", "info legend"),
    	grades = [0,1,2,3,4,5],
    	labels = [];

    for (var i =0; i<grades.length; i++){
    	div.innerHTML +=
    		'<i style="background: ' + getColor(grades[i] + 1) + '></i>' + grades[i] + (grades[i + 1]?'&ndash;' + grades[i+1] + '<br>' : '+');
    }
    return div;
    };
    legend.addTo(myMap);
}

function getColor(d){
	return d>5 ? "#a54500":
	d > 4 ? "#cc5500":
	d > 3 ? "#ff6f08":
	d > 2 ? "#ff9143":
	d > 1 ? "#ffb37e": "#ffcca5";
}
function getRadius(value){
	return value*25000
}
