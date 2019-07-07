

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


loadJSON(url, function(response) {
// Parse JSON string into object
var coordsObj = JSON.parse(response);
console.log(coordsObj);
DrawCoords(coordsObj);
});

function DrawCoords(coordsObj) {
var date1 = Object.keys(coordsObj)[0];
//var date2 = Object.keys(coordsObj)[1];
console.log(date1);
  
 
var mymap = L.map('mapid').setView(
coordsObj[date1]["history"], 6 
);
  

var url = "https://tinkoffsiriusmobile.firebaseio.com/.json";
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: 'OpenStreetMapData',
maxZoom: 18
}).addTo(mymap); 


// получаем пользователя (первого) для полученной даты
var date1users = coordsObj[date1]["users"];
console.log(date1users);
var date1user1key = Object.keys(date1users)[0];
console.log(date1user1key);
var date1user1 = date1users[date1user1key];
console.log(date1user1);


//координаты начальной точки для ползователя
var startCoords = date1user1["start_coordinates"];
console.log(startCoords);
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


