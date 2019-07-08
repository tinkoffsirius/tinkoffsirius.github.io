var mymap = L.map('mapid').setView([0, 0], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'OpenStreetMapData',
    maxZoom: 18
}).addTo(mymap);

function loadJSON(url, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', url, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function refresh() {
    var inputEl = document.getElementById("date_input");
    var url = "https://tinkoffsiriusmobile.firebaseio.com/" + inputEl.value + ".json";
    loadJSON(url, function(response) {
        // Parse JSON string into object
        var coordsObj = JSON.parse(response);
        console.log(coordsObj);
        DrawCoords(coordsObj);
    });
}

function drawUser(date1user1){
	var startCoords = date1user1["start_coordinates"];
    console.log(startCoords);
    mymap.setView([startCoords['latitude'], startCoords['longitude']], 18)
    var marker = L.marker([startCoords["latitude"], startCoords["longitude"]]).addTo(mymap);

    var endCoords = date1user1["end_coordinates"];
    console.log(endCoords);
    var marker = L.marker([endCoords["latitude"], endCoords["longitude"]]).addTo(mymap);

    var hiCo = [];

    hiCo.push([startCoords["latitude"], startCoords["longitude"]]);

    var historyCoords = date1user1["history"];
    for (var i in historyCoords) {
        var coords = historyCoords[i];
        hiCo.push([coords["latitude"], coords["longitude"]]);
        var marker = L.marker([coords["latitude"], coords["longitude"]]);

    }

    hiCo.push([endCoords["latitude"], endCoords["longitude"]]);


    var polyline = L.polyline(hiCo, {
        color: 'red'
    }).addTo(mymap);

}

function DrawCoords(coordsObj) {

    // получаем пользователя (userOrder) для полученной даты
    var userOrder = 3;
    var users = coordsObj["users"];
	var userIds = Object.keys(users);
	
	
    console.log(users);
    var date1user1key = Object.keys(users)[userOrder];
    console.log(date1user1key);
    var date1user1 = users[date1user1key];
    console.log(date1user1);
	drawUser(date1user1);


    
}
