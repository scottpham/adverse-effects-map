var myRed = "#933F38";

var hospitalLayer = L.geoJson(hospitals, {
  style: hospitalStyle,
  onEachFeature: onEachHospital,
  pointToLayer: function(feature,latlng){
    return L.circleMarker(latlng, null); //null options.  used style instead
  }
});

//sets map to mountain view
var map = L.map('map', {
	scrollWheelZoom: false,
	layers: [hospitalLayer]
	}).setView([37.0, -118.7], 6);
	

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
function hospitalStyle(feature) {
  return {
    radius: 10,
//	radius: getSize(feature.properties.water_injected),
    fillColor: myRed,
    color:"white",
    weight: .5,
    opacity: 1,
    fillOpacity: 0.65
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
	hospitalLayer.setStyle({fillColor: "gray"});
	layer.setStyle({fillColor: myRed, fillOpacity: 1}); //highlight color
	info.update(e.target.feature);
};

//if the target doesn't have feature data, then reset the color and send an undefined to the update, triggering the false condition, rendering default text
function reset(e) {
	// hospitalLayer.setStyle({color: "gray"});
	if (!e.target.feature){
		hospitalLayer.setStyle({fillColor: myRed});
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

	this._div.innerHTML = (data ? ("<div class='target-info'><p><strong>" + data.id + "</strong></p><p>Total(FY11-13):<strong> " + data.properties.TOTAL + "</strong></p><p>" + printEffects(data.properties)) + '</div><div id="slide-control" class="buttons btn-group btn-group-justified"> <a class="slide-up btn btn-primary"><span class="glyphicon glyphicon-chevron-up"> </span></a> <a class="slide-down btn btn-primary"> <span class="glyphicon glyphicon-chevron-down"></span></a> </div>'
		
		: ("<p><strong>Click on a circle</strong></p>"));


	// //have to put this function here or won't render right
	// $(document).ready(function(){
	// 	$(".slide-up").click(function(){
	// 		$(".target-info").slideUp("slow");
	// 	});

	// 	$(".slide-down").click(function(){
	// 		$(".target-info").slideDown("slow");
	// 	});


	// });

	
	};//end update

info.addTo(map);

/*helper function
function findlocation(e) {
	console.log("The lat and long is " + e.latlng);
} 

//instantiate helper finder function
map.on('click', findlocation);
*/
