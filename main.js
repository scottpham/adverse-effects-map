var myRed = "#933F38";

var hospitalLayer = L.geoJson(hospitals, {
  style: hospitalStyle,
  onEachFeature: onEachHospital,
  pointToLayer: function(feature,latlng){
    return L.circleMarker(latlng, null); //null options.  used style instead
  }
});


var map = L.map('map', {
	scrollWheelZoom: false,
	layers: [hospitalLayer]
	}).setView([37.0, -118.7], 6);
	

L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
}).addTo(map);

//layer style
function hospitalStyle(feature) {
  return {
    radius: 10,
    fillColor: myRed,
    color:"white",
    weight: .5,
    opacity: 1,
    fillOpacity: 0.7
  };
}

//bind click function to layer
function onEachHospital(feature, layer) {
	layer.on({
		click: clickToControl
		//add mouseover event here
	});
};



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
	hospitalLayer.setStyle(hospitalStyle);
	layer.setStyle({fillColor: myRed, fillOpacity: 1, color: "black", weight: 3}); //highlight color
	info.update(e.target.feature);
};

//if the target doesn't have feature data, then reset the color and send an undefined to the update, triggering the false condition, rendering default text
function reset(e) {
	if (!e.target.feature){
		hospitalLayer.setStyle(hospitalStyle);
		info.update(e.target.feature);
}};

map.on('click', reset);


function printEffects(properties){
	//placeholder text
	text = "";
	//run 27 times
	for (i=1; i < 28; i++){
		//skip empty properties
		if ( !properties[i]) continue;
		//append text
		text += '<p><strong>' + properties[i] + ': </strong>' + lookup[i] + '.</p>';
	}
	return text;
};

//updating the control
info.update = function(data) {

	this._div.innerHTML = (data ? ("<div class='target-info'><h5><strong>" + data.id + "</strong></h5><p>Adverse Events:<strong> " + data.properties.TOTAL + "</strong></p><p>" + printEffects(data.properties)) + '</div><div id="slide-control" class="buttons btn-group btn-group-justified"> <a class="slide-up btn btn-primary"><span class="glyphicon glyphicon-chevron-up"> </span></a> </div>'
		
		: ("<h4><strong>Click on a circle</strong></h4>"));
	
};//end update

info.addTo(map);

