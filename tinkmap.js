var mymap = L.map('mapid').setView([0,0],5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: 'OpenStreetMapData',
maxZoom: 18
}).addTo(mymap); 

function loadJSON(url, callback) { 
var xobj = new XMLHttpRequest();
xobj.overrideMimeType("application/json");
xobj.open('GET', url, true); // Replace 'my_data' with the path to your file
xobj.onreadystatechange = function () {
if (xobj.readyState == 4 && xobj.status == "200") {
// Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
callback(xobj.responseText);
}
};
xobj.send(null); 
}

function refresh(){
	var inputEl = document.getElementById("date_input");
	var url = "https://tinkoffsiriusmobile.firebaseio.com/" + inputEl.value + ".json";
	loadJSON(url, function(response) {
	// Parse JSON string into object
		var coordsObj = JSON.parse(response);
		console.log(coordsObj);
		DrawCoords(coordsObj);
	});

}


function DrawCoords(coordsObj) {
 
// получаем пользователя (первого) для полученной даты
var users = coordsObj["users"];
console.log(users);
var date1user1key = Object.keys(users)[0];
console.log(date1user1key);
var date1user1 = users[date1user1key];
console.log(date1user1);


//координаты начальной точки для ползователя
var startCoords = date1user1["start_coordinates"];
console.log(startCoords);
mymap.setView([startCoords['latitude'],startCoords['longitude']], 8)
var marker = L.marker([ startCoords["latitude"], startCoords["longitude"] ]).addTo(mymap);


// координаты конечной точки для пользователя
var endCoords = date1user1["end_coordinates"];
console.log(endCoords);
var marker = L.marker([ endCoords["latitude"], endCoords["longitude"] ]).addTo(mymap);

var coords = [ [ startCoords["latitude"], startCoords["longitude"]], 
[ endCoords["latitude"], endCoords["longitude"]] 
]; 
var polyline = L.polyline(coords, {color: 'red'}).addTo(mymap);

}
