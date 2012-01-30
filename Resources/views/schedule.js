var win = Titanium.UI.currentWindow;
Ti.include(Titanium.Filesystem.resourcesDirectory + 'Model/db.js');
win.barColor = '#477AAB';
win.backgroundColor = '#477AAB';
var schedule_table;
//win.backgroundImage = '../images/background.png';
//win.addEventListener('focus', function() {

	win.setTitle('Schedule');

	var activity_indicator = Titanium.UI.createActivityIndicator({
		height : 50,
		width : 150,
		style : Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN,
		font : {
			fontFamily : 'Helvetica Neue',
			fontSize : 15,
			fontWeight : 'bold'
		},
		backgroundColor : '#000',
		opacity : 0.5,
		borderRadius : 5,
		color : 'white',
		message : 'Loading...',
	});

	activity_indicator.show();
	win.add(activity_indicator);

	//button bar buttons
	var buttons = [{
		title : 'Class Schedule',
		width : 155,
		enabled : true
	}, {
		title : 'My Schedule',
		width : 155,
		enabled : false
	}];

	var button_bar = Titanium.UI.createTabbedBar({
		labels : buttons,
		top : 10,
		style : Titanium.UI.iPhone.SystemButtonStyle.BAR,
		height : 20,
		index : 0,
		backgroundColor : '#477AAB'
	});

	win.add(button_bar);

	//xhr: request remote data
	var info = db.getUserPrefs();
	requestReunionBaseScheduleData(info.school_abbr, info.cohort_prefix + info.year);

	//display data in a tableView
	Ti.App.addEventListener('data.received', function(data) {
		schedule_table = createTableView(data.schedule);
		win.add(schedule_table);
		activity_indicator.hide();
	});
	//attach button bar events
	button_bar.addEventListener('click', function(e) {
		var index = e.index;
		if(index == 0) {
			schedule_table.show();
			Ti.API.info('button 1');
		}
		if(index == 1) {
			schedule_table.hide();
			Ti.API.info('button 2');
		}
	});
	var reload_button = Titanium.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.REFRESH
	});

	win.setLeftNavButton(reload_button);

	reload_button.addEventListener('click', function() {
		var activity_indicator = Titanium.UI.createActivityIndicator({
			height : 50,
			width : 150,
			style : Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN,
			font : {
				fontFamily : 'Helvetica Neue',
				fontSize : 15,
				fontWeight : 'bold'
			},
			backgroundColor : '#000',
			opacity : 0.5,
			borderRadius : 5,
			color : 'white',
			message : 'Loading...',
		});
		activity_indicator.show();
		win.add(activity_indicator);

		//request data.
		requestReunionBaseScheduleData(info.school_abbr, info.cohort_prefix + info.year);
		Ti.App.addEventListener('data.received', function(data) {
			schedule_table = createTableView(data.schedule);
			win.add(schedule_table);
			activity_indicator.hide();
		});
	});
	buildSettingsButton();

//});
function buildReloadButton(options) {
	var reload_button = Titanium.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.REFRESH
	});

	win.setLeftNavButton(reload_button);

	reload_button.addEventListener('click', function() {
		//alert('hi');
		reload_button.systemButton = Titanium.UI.iPhone.SystemButton.ACTIVITY;
	});
}

function buildSettingsButton() {
	var settings_button = Ti.UI.createButton({
		title : "settings",
		image : "../images/settings-icon.png"
	});

	win.setRightNavButton(settings_button);

	settings_button.addEventListener('click', function(e) {
		var settings_win = Titanium.UI.createWindow({
			title : 'Settings',
			backgroundColor : '#A6B7C8',
			statusBarHidden : true,
			tabBarHidden : true,
			modal : true,
			url : "settings.js"
		});

		settings_win.open();
	});
}

function buildButtonBar() {
	var buttons = [{
		title : 'Class Schedule',
		width : 155,
		enabled : true
	}, {
		title : 'My Schedule',
		width : 155,
		enabled : false
	}];

	var button_bar = Titanium.UI.createTabbedBar({
		labels : buttons,
		top : 10,
		style : Titanium.UI.iPhone.SystemButtonStyle.BAR,
		height : 20,
		index : 0,
		backgroundColor : '#477AAB'

	});

	win.add(button_bar);

	button_bar.addEventListener('click', function(e) {
		var index = e.index;

		if(index == 0) {
			alert('first');
		}
		if(index == 1) {
			alert('second');
		}
	});
}

function requestReunionBaseScheduleData(reunion_class, reunion_cohort) {

	var base_url = 'https://chameleon.college.columbia.edu/reunion_base/service/schedule/';
	var request_url = base_url + reunion_class + '/' + reunion_cohort;
	//Ti.API.info(request_url);
	var xhr = Ti.Network.createHTTPClient();
	xhr.timeout = 1000000;
	xhr.open("GET", request_url);
	xhr.onload = function() {
		var s = JSON.parse(this.responseText);
		Ti.App.fireEvent('data.received', s);
		Titanium.API.info(this.responseText);
	};

	xhr.send();

	xhr.onerror = function(e) {
		Ti.API.info(e);
	};
}

// create table view data object
function createTableView(schedule) {
	//Titanium.API.debug("++++ " + JSON.stringify(schedule));

	var last_date = null;

	var rows = [];

	for(var i = 0; i < schedule.length; i++) {
		var event = schedule[i];

		var row = Ti.UI.createTableViewRow({
			hasChild : true,
			height : 55,
			hasDetail : true
		});

		var lbl = Ti.UI.createLabel({
			text : event.title,
			textAlign : 'left',
			font : {
				fontWeight : 'bold',
				fontSize : 14
			},
			left : 5
		});
		var lbl2 = Ti.UI.createLabel({
			text : event.start_time + '-' + event.end_time,
			textAlign : 'left',
			color : '#C7C7C7',
			font : {
				fontWeight : 'bold',
				fontSize : 13
			},
			left : 5,
			top : 35
		});
		var lbl3 = Ti.UI.createLabel({
			text : event.location_name,
			textAlign : 'left',
			color : '#6B90B5',
			font : {
				fontWeight : 'bold',
				fontSize : 13
			},
			left : 5,
			top : 35,
			left : 130
		});

		var date = new Date(event.date * 1000);
		// convert to milliseconds
		row.add(lbl, lbl2, lbl3);

		if(!last_date || last_date.getDay() != date.getDay()) {
			row.header = event.display_date;
		}
		last_date = date;
		rows.push(row);
	}

	// create table view
	var tableview = Titanium.UI.createTableView({
		data : rows,
		top : 39,
		backgroundImage : '../images/background.png'
	});

	if(schedule.length == 0) {
		var empty_label = Ti.UI.createLabel({
			top : 5,
			left: 20,
			right: 20,
			text : 'There is currently no schedule information for this class year. Check again soon!',
			font : {
				fontSize : 15,
				fontWeight : 'bold'
			},
			color : '#4D576D',
			textAlign: 'center',
			shadowColor : '#FAFAFA',
			shadowOffset : {
				x : 0,
				y : 1
			}
		});

		tableview.add(empty_label);
		empty_label.show();
	}

	// create table view event listener
	tableview.addEventListener('click', function(e) {
		Ti.API.info(e);

		var win = Titanium.UI.createWindow({
			barColor : '#477AAB',
			title : 'Event Details'
		});

		var event = schedule[e.index];
		event_info_data = [];
		var mainInfoRow = Titanium.UI.createTableViewRow({
			height : 66,
			className : 'mainInfoRow'
		});
		var mapRow = Titanium.UI.createTableViewRow({
			height : 46,
			className : 'mapRow'
		});
		var descriptionRow = Titanium.UI.createTableViewRow({
			height : 'auto',
			className : 'descriptionRow',
			header : 'Description'
		});

		var eventTitleLabel = Ti.UI.createLabel({
			color : '#000000',
			text : event.title,
			font : {
				fontSize : 15,
				fontWeight : 'bold'
			},
			minimumFontSize : 10,
			top : 5,
			left : 12,
			height : 35,
			width : 'auto'
		});
		var eventTimeLabel = Ti.UI.createLabel({
			color : '#000000',
			text : event.start_time + "-" + event.end_time,
			font : {
				fontSize : 14
			},
			top : 25,
			left : 12,
			height : 30,
			width : 170
		});
		var eventLocationLabel = Ti.UI.createLabel({
			color : '#000000',
			text : event.location_name,
			font : {
				fontSize : 14
			},
			top : 40,
			left : 12,
			height : 30,
			width : 170
		});

		var mapLabel = Ti.UI.createLabel({
			color : '#000000',
			text : "Map",
			font : {
				fontSize : 15,
				fontWeight : 'bold'
			},
			top : 8,
			left : 12,
			height : 24,
			width : 170
		});

		var eventDescriptionLabel = Ti.UI.createLabel({
			color : '#000000',
			text : event.description,
			font : {
				fontSize : 12
			},
			top : 10,
			bottom : 10,
			left : 12,
			height : 'auto',
			width : 'auto'
		});
		//add UI elements to screen.
		mainInfoRow.add(eventTitleLabel, eventTimeLabel, eventLocationLabel);
		mapRow.add(mapLabel);
		descriptionRow.add(eventDescriptionLabel);
		
		//push event data onto our new array.
		event_info_data.push(mainInfoRow, mapRow, descriptionRow);

		//create the event detail view. 
		var event_detail_view = Titanium.UI.createTableView({
			data : event_info_data,
			style : Titanium.UI.iPhone.TableViewStyle.GROUPED,
			backgroundImage : '../images/background.png'
		});

		win.add(event_detail_view);

		event_detail_view.addEventListener('click', function(e) {
			//Ti.API.info(e);
			var event = schedule[e.index];
			//Ti.API.info("____________HI " + event.latitude);
			if(e.index == 1) {
				//Ti.Platform.openURL("http://maps.google.com/maps?saddr=" + event.latitude + "," + event.longitude);
				var map_win = Titanium.UI.createWindow({
					barColor : '#60A0D4',
					translucent : true,
				});

				var annotation = Titanium.Map.createAnnotation({
					latitude : event.latitude,
					longitude : event.longitude,
					title : event.location_name,
					subtitle : 'Test',
					animate : true,
					leftButton : '../images/atlanta.jpg',
					image : "../images/boston_college.png"
				});

				var new_york = {
					latitude : event.latitude,
					longitude : event.longitude,
					latitudeDelta : 0.010,
					longitudeDelta : 0.018
				};

				var mapview = Titanium.Map.createView({
					mapType : Titanium.Map.STANDARD_TYPE,
					region : new_york,
					animate : true,
					regionFit : true,
					userLocation : true,
					annotations : [annotation]
				});

				map_win.add(mapview);
				map_win.open();
			}
		});

		Titanium.UI.currentTab.open(win, {
			animated : true
		});
	});

	tableview.addEventListener('longclick', function(e) {
		showClickEventInfo(e, true);
	});
	// add table view to the window
	//Titanium.UI.currentWindow.add(tableview);
	return tableview;
}