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

    /*var endCoords = date1user1["end_coordinates"];
    console.log(endCoords);
    var marker = L.marker([endCoords["latitude"], endCoords["longitude"]]).addTo(mymap);*/

    var hiCo = [];

    hiCo.push([startCoords["latitude"], startCoords["longitude"]]);

    var historyCoords = date1user1["history"];
    for (var i in historyCoords) {
        var coords = historyCoords[i];
        hiCo.push([coords["latitude"], coords["longitude"]]);
        var marker = L.marker([coords["latitude"], coords["longitude"]]);

    }
	
	var endCoords = date1user1["end_coordinates"];
	
	if (endCoords != null) {
    console.log(endCoords);
    var marker = L.marker([endCoords["latitude"], endCoords["longitude"]]).addTo(mymap);
	//hiCo.push([endCoords["latitude"], endCoords["longitude"]]);
	}


    var polyline = L.polyline(hiCo, {
        color: "#"+((1<<24)*Math.random()|0).toString(16) 
    }).addTo(mymap);

}

function DrawCoords(coordsObj) {
    // получаем пользователя (userOrder) для полученной даты
    var users = coordsObj["users"];
	userIds = Object.keys(users);
	var userOrder;
	
	for(var elem in userIds){
		userOrder = userIds[elem];
		console.log(userOrder);
	
		var date1user1 = users[userOrder];
		console.log(date1user1);
		drawUser(date1user1);
		
		function addRow(tableID) {
  // Get a reference to the table
  let tableRef = document.getElementById(tableID);

  // Insert a row at the end of the table
  let newRow = tableRef.insertRow(-1);

  // Insert a cell in the row at index 0
  let newCell = newRow.insertCell(0);

  // Append a text node to the cell
  let newText = document.createTextNode(userOrder);
  newCell.appendChild(newText);
}

// Call addRow() with the table's ID
addRow('my-table');
	
	}
}
