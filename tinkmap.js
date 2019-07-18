var mymap = L.map('mapid').setView([0, 0], 5);

var markers = [];
var polylines = [];


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: 'OpenStreetMapData',
	maxZoom: 18
}).addTo(mymap);

var urla = "https://tinkoffsiriusmobile.firebaseio.com/agents.json";

$.get(urla, function (agents) {
	window.agents = agents
})

function refresh() {

	if (window.refreshTimeout) {
		clearTimeout(window.refreshTimeout);
	}
	window.refreshTimeout = setTimeout(refresh, 60000);

	function clearMarkersAndPolylines() {
		for (var marker in markers) {
			markers[marker].remove();
		}
		markers = [];


		for (var polyline in polylines) {
			polylines[polyline].remove();
		}
		polylines = [];
	}

	clearMarkersAndPolylines()
	$('#userlist_list').html('')

	var inputEl = document.getElementById("date_input");
	var url = "https://tinkoffsiriusmobile.firebaseio.com/" + inputEl.value + ".json";

	$.get(url, DrawCoords)

}

$('#btn_refresh').on('click', function () {

	// console.log(111);
	refresh()
	var today = moment().format("DD_MM_YYYY");
	// console.log('today', today);
	var inputEl = document.getElementById("date_input");
	if (today == inputEl.value) {
		$("#contrl").show("fast");
	}
	else {
		$("#contrl").hide("fast");
	}
	var url2 = "https://tinkoffsiriusmobile.firebaseio.com/soft_const.json";
	$.get(url2, function (soft_const) {
		window.soft_const = soft_const;
		Object.keys(soft_const).forEach(function (key) {
			var value = soft_const[key] === 1 ? true : false;
			$('#contrl input[name="' + key + '"]').prop("checked", value);
		});
	});
});

$("#objVal").on('submit', function (event) {
	event.preventDefault();
	var form_data = $(this).serializeArray();
	// console.log('form data', form_data);
	var soft_const = window.soft_const;

	var soft_const_res = {};
	Object.keys(soft_const).forEach(function (key) {
		soft_const_res[key] = 0
	})

	for (var i in form_data) {
		soft_const_res[form_data[i].name] = Number(form_data[i].value);
		// console.log('soft_const', soft_const_res);
	}


	$.ajax({
		url: 'https://tinkoffsiriusmobile.firebaseio.com/soft_const.json',
		method: 'PUT',
		data: JSON.stringify(soft_const_res)
	}, function (res) {
		// console.log('res', res)
	});
	$.ajax({
		url: 'http://178.62.221.24:8000/',
		method: 'POST',
		data: JSON.stringify(soft_const_res)
	}, function (res) {
		// console.log('res', res)
	});

	$('#spinner').show()
	$('#contrl').addClass('loading')
	setTimeout(function () {
		$('#contrl').removeClass('loading')
		$('#spinner').hide()
	}, 750)
	

});



function drawUser(date1user1) {
	var startCoords = date1user1["start_coordinates"];
	// console.log(startCoords);
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
		// console.log(endCoords);
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
		// console.log(userOrder);

		var date1user1 = users[userOrder];
		// console.log(date1user1);
		drawUser(date1user1);

		renderUserInfoRow(date1user1);

		$('#userlist_heading').show();

	}
}


function renderUserInfoRow(date1user1) {
	// var card = '<div class="card">'
	// card += '		<div class="card-body">'
	// card += '			<h5 class="card-title name"></h5>'
	// card += '			<h6 class="card-subtitle mb-2 text-muted login"></h6>'
	// card += '			<p class="card-text text"></p>'
	// card += '		</div>'
	// card += '	</div>'
	var card = '<li class="list-group-item" >'
	card += '<div class="name"></div>'
	card += '<div class="login"></div>'
	card += '<div class="text"></div>'
	card += '</li>'

	var $card = $(card)

	var login = date1user1["login"];

	var loginText = 'login: ' + login;
	$card.find('.login').html(loginText)
	
	var agentname = window.agents[login]
	$card.find('.name').html(agentname)

	if (date1user1["profile"] && date1user1["profile"]['car']) {
		var haveCarTxt = 'Has car: ' + date1user1["profile"]['car'];
		$card.find('.text').html(haveCarTxt)
	} else {
		$card.find('.text').hide()
	}

	$('#userlist_list').append($card)


}