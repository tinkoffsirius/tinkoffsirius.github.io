var mymap = L.map('mapid').setView([0, 0], 5);

var markers = [];
var polylines = [];


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


function deleteRow(tableID) {
	let tableRef = document.getElementById(tableID);
	//Table.innerHTML = "my-table";
	tableRef.innerHTML = "";

}
function refresh() {

	setTimeout(refresh, 60000);

	for (var marker in markers) {
		markers[marker].remove();
	}
	markers = [];


	for (var polyline in polylines) {
		polylines[polyline].remove();
	}
	polylines = [];

	deleteRow('my-table');

	var inputEl = document.getElementById("date_input");
	var url = "https://tinkoffsiriusmobile.firebaseio.com/" + inputEl.value + ".json";
	loadJSON(url, function (response) {
		// Parse JSON string into object
		var coordsObj = JSON.parse(response);
		console.log(coordsObj);
		DrawCoords(coordsObj);
	});
}

function drawUser(date1user1) {
	var startCoords = date1user1["start_coordinates"];
	console.log(startCoords);
	mymap.setView([startCoords['latitude'], startCoords['longitude']], 18)
	var marker = L.marker([startCoords["latitude"], startCoords["longitude"]]).addTo(mymap);
	markers.push(marker);

	var hiCo = [];

	hiCo.push([startCoords["latitude"], startCoords["longitude"]]);

	var historyCoords = date1user1["history"];
	for (var i in historyCoords) {
		var coords = historyCoords[i];
		hiCo.push([coords["latitude"], coords["longitude"]]);

		var Icon = L.icon({
			iconUrl: 'marker2.png',
			iconSize: [25, 38],
			iconAnchor: [12, 38],
		});
		var lastItem = historyCoords[historyCoords.length - 1];
		var marker = L.marker([lastItem["latitude"], lastItem["longitude"]], { icon: Icon }).addTo(mymap);
		markers.push(marker);
	}
	var endCoords = date1user1["end_coordinates"];
	var myIcon = L.icon({
		iconUrl: 'marker.png',
		iconSize: [38, 38],
		iconAnchor: [19, 34],
	});
	if (endCoords != null) {
		console.log(endCoords);
		var marker = L.marker([endCoords["latitude"], endCoords["longitude"]], { icon: myIcon }).addTo(mymap);
		markers.push(marker)
		hiCo.push([endCoords["latitude"], endCoords["longitude"]]);

		var login = date1user1["login"]
		var popupText = "user login:" + "<br>" + login;
		marker.bindPopup(popupText).openPopup();

	}

	var colorLine = '#' + ('00000' + (Math.random() * (1 << 24) | 0).toString(16)).slice(-6)
	var polyline = L.polyline(hiCo, {
		color: colorLine
	}).addTo(mymap);
	polylines.push(polyline);
}


function DrawCoords(coordsObj) {
	// получаем пользователя (userOrder) для полученной даты
	var users = coordsObj["users"];
	userIds = Object.keys(users);
	var userOrder;

	for (var elem in userIds) {
		userOrder = userIds[elem];
		console.log(userOrder);

		var date1user1 = users[userOrder];
		console.log(date1user1);
		drawUser(date1user1);

		function addRow(tableID) {


			var urla = "https://tinkoffsiriusmobile.firebaseio.com/agents.json";
			loadJSON(urla, function (response) {
				// Parse JSON string into object
				var coordsObj = JSON.parse(response);
				var agOrder;


				for (var elem in coordsObj) {
					agOrder = coordsObj[elem];

					if (login == elem) {
						console.log(agOrder)
						var agentname = "  " + "User name: " + agOrder
						let newText = document.createTextNode(agentname);
						newCell.appendChild(newText);
					}
				}

			});

			var login = date1user1["login"];
			console.log(login);
			var loginText = '  ' + 'User login: ' + login;

			// Get a reference to the table
			let tableRef = document.getElementById(tableID);

			// Insert a row at the end of the table
			let newRow = tableRef.insertRow(-1);

			// Insert a cell in the row at index 0
			let newCell = newRow.insertCell(0);

			// Append a text node to the cell
			//let newText = document.createTextNode(userOrder);
			//newCell.appendChild(newText);
			let new2Text = document.createTextNode(loginText);
			newCell.appendChild(new2Text);

		}


		// Call addRow() with the table's ID
		addRow('my-table');

	}
}