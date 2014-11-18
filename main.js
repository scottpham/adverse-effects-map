
var wellLayer= L.geoJson(wellLocations, {
  style: wellStyle,
  onEachFeature: onEachWell,
  pointToLayer: function(feature,latlng){
    return L.circleMarker(latlng, null); //null options.  used style instead
  }
});

//sets map to mountain view
var map = L.map('map', {
	scrollWheelZoom: false,
	layers: [wellLayer]
	}).setView([35.4, -118.7], 9);
	

L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
}).addTo(map);

//size function
//function getSize(d){
//	return d > 50520229 ? 30 :
//		d > 4994335.25 ? 25 :
//		d > 1797653 ? 20 :
//		d > 1101964.25 ? 15 :
//		10;	
//}

//layer style
function wellStyle(feature) {
  return {
    radius: 18,
//	radius: getSize(feature.properties.water_injected),
    fillColor: "steelblue",
    color:"lightgrey",
    weight: 1.5,
    opacity: 1,
    fillOpacity: 0.65
  };
}

//bind click function to layer
function onEachWell(feature, layer) {
	layer.on({
		click: clickToControl
	});
}

//begin control code//
var info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
	this.update();
	return this._div;
};


//listeners

//sends click event to update control
function clickToControl(e) {
	var layer = e.target;
	wellLayer.setStyle({color: "lightgrey", fillOpacity: 0.5});
	e.target.popup
	layer.setStyle({color: "red", fillOpacity: 1}); //highlight color
	info.update(e.target);
}

// Cribbed from http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

//updating the control
info.update = function(data) {
	var that = this; //passing scope

	this._div.innerHTML = (data ? '<div class="target-info"><p>This well has injected <strong>' + numberWithCommas(data.feature.properties.water_injected) + "</strong> barrels of water into the ground.</p><p>It's an <strong>" + ((data.feature.properties.well_status == "I") ? "active" : "inactive") + "</strong> waste water disposal well.</p><p>It's leased by <strong>" + data.feature.properties.leasee + "</strong> and operated by <strong>" + data.feature.properties.operator + "</strong>.</p><p>The Department of Conservation's " + '"Well Finder" has <a href="' + data.feature.properties.url + '" target="blank">lots more info</a>.</p></div> <div id="slide-control" class="buttons btn-group btn-group-justified"> <a class="slide-up btn btn-primary"><span class="glyphicon glyphicon-chevron-up"> </span></a> <a class="slide-down btn btn-primary"> <span class="glyphicon glyphicon-chevron-down"></span></a> </div>' : "<h5><strong>Click a circle marker</strong></h5>");


	//have to put this function here or won't render right
	$(document).ready(function(){
		$(".slide-up").click(function(){
			$(".target-info").slideUp("slow");
		});

		$(".slide-down").click(function(){
			$(".target-info").slideDown("slow");
		});	
	});

	
};

info.addTo(map);

/*helper function
function findlocation(e) {
	console.log("The lat and long is " + e.latlng);
} 

//instantiate helper finder function
map.on('click', findlocation);
*/
