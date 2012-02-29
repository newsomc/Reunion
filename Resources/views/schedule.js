/**
 * @file
 * @author Clint Newsom
 * 02-08-2012
 * cn2284@columbia.edu
 */

var win = Titanium.UI.currentWindow;

Ti.include(Titanium.Filesystem.resourcesDirectory + 'Model/db.js');
Ti.include(Titanium.Filesystem.resourcesDirectory + 'views/setupWindow.js');
Ti.include(Titanium.Filesystem.resourcesDirectory + 'Model/xhr.js');
Ti.include(Titanium.Filesystem.resourcesDirectory + 'Model/ui.js');

win.addEventListener('focus', function() {

	setUpWindow('Schedule');

	//Get user defined prefs.
	var curr_tab = Titanium.App.Properties.getInt("bar_setting", 0);
	var info = db.getUserPrefs();
	var registration = db.getRegCode();
	var cohortAbbr = info.cohort_prefix + info.year;

	//ui elements
	var separator = Ti.UI.createView({
		width : '100%',
		height : 0.50,
		backgroundColor : 'black',
		top : 38
	});

	var activity_indicator = new reunion.ActivityIndicator();

	var emptyLabel = new reunion.EmptyLabel();

	var tableview = Titanium.UI.createTableView({
		top : 39,
		backgroundImage : '../images/background-notile.png',
	});

	var buttons = [{
		title : 'Class Schedule',
		width : 155,
		enabled : true
	}, {
		title : 'My Schedule',
		width : 155,
		enabled : false
	}];

	var button_bar = Titanium.UI.iOS.createTabbedBar({
		labels : buttons,
		top : 10,
		style : Titanium.UI.iPhone.SystemButtonStyle.BAR,
		height : 20,
		index : curr_tab,
		backgroundColor : '#4a85c8'
	});

	var reload_button = Titanium.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.REFRESH
	});

	if(curr_tab == 0) {
		requestReunionData('/schedule/' + info.school_abbr + '/' + cohortAbbr);
	}
	if(curr_tab == 1) {
		requestReunionData('/party_schedule/' + registration.code);
	}

	//Set up events.
	button_bar.addEventListener('click', function(e) {
		var index = e.index;
		if(index == 0) {
			requestReunionData('/schedule/' + info.school_abbr + '/' + cohortAbbr);
			setButtonBarIndex(index);
		}
		if(index == 1) {
			requestReunionData('/party_schedule/' + registration.code);
			setButtonBarIndex(index);
		}
	});

	reload_button.addEventListener('click', function() {

		var curr_tab = Titanium.App.Properties.getInt("bar_setting", 0);
		activity_indicator.view.show();

		if(curr_tab == 0) {
			requestReunionData('/schedule/' + info.school_abbr + '/' + cohortAbbr);
			//activity_indicator.view.hide();
		}
		if(curr_tab == 1) {
			requestReunionData('/party_schedule/' + registration.code);
			//activity_indicator.view.hide();
		}
	});
	// create table view event listener
	tableview.addEventListener('click', function(e) {

		var event_info_data = [];

		var win = Titanium.UI.createWindow({
			barColor : '#477AAB',
			title : 'Event Details'
		});

		var mainInfoRow = Titanium.UI.createTableViewRow({
			height : 'auto',
			className : 'mainInfoRow'
		});

		var mapRow = Titanium.UI.createTableViewRow({
			height : 46,
			className : 'mapRow',
			latitude : e.row.latitude,
			longitude : e.row.longitude,
			location_name : e.row.location_name
		});

		var descriptionRow = Titanium.UI.createTableViewRow({
			height : 'auto',
			className : 'descriptionRow',
			header : 'Description'
		});

		var eventTitleLabel = Ti.UI.createLabel({
			color : '#000000',
			text : e.row.event_title,
			font : {
				fontSize : 15,
				fontWeight : 'bold'
			},
			top : 5,
			left : 12,
			height : 35,
			width : 'auto'
		});

		var eventTimeLabel = Ti.UI.createLabel({
			color : '#000000',
			text : e.row.start_time + "-" + e.row.end_time,
			font : {
				fontSize : 14
			},
			top : 35,
			left : 12,
			height : 30,
			width : 170
		});

		var eventLocationLabel = Ti.UI.createLabel({
			color : '#000000',
			text : e.row.location_name,
			font : {
				fontSize : 14
			},
			top : 50,
			left : 12,
			height : 30,
			width : 'auto'
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

		var eventDescriptionView = Ti.UI.createWebView({
			html : '<html><head><meta http-equiv="Content-Type" content="text/html;charset=UTF-8"></head><body style=\"font-family: Helvetica;font-size:13px;\"> ' + e.row.event_description + '</body></html>',
			top : 15,
			bottom : 15,
			left : 12,
			right : 12,
			height : 250
		});

		//add UI elements to screen.
		mainInfoRow.add(eventTitleLabel, eventTimeLabel, eventLocationLabel);
		mapRow.add(mapLabel);
		descriptionRow.add(eventDescriptionView);

		//Don't put add a faulty location into our table.
		if(e.row.location_name) {
			event_info_data.push(mainInfoRow, mapRow, descriptionRow);
		} else {
			event_info_data.push(mainInfoRow, descriptionRow);
		}

		//create the event detail view.
		var event_detail_view = Titanium.UI.createTableView({
			data : event_info_data,
			style : Titanium.UI.iPhone.TableViewStyle.GROUPED,
			backgroundImage : '../images/background-notile.png'
		});

		win.add(event_detail_view);

		event_detail_view.addEventListener('click', function(e) {
			if(e.index == 1) {
				Ti.API.info(JSON.stringify(e.row));
				var map_win = Titanium.UI.createWindow({
					barColor : '#4a85c8',
					navBarHidden : false,
					tabBarHidden : false,
					title : 'Map'
				});

				var annotation = Titanium.Map.createAnnotation({
					latitude : e.row.latitude,
					longitude : e.row.longitude,
					title : e.row.location_name,
					animate : true,
					leftButton : '../images/atlanta.jpg',
					image : "../images/boston_college.png"
				});

				var new_york = {
					latitude : e.row.latitude,
					longitude : e.row.longitude,
					latitudeDelta : 0.01,
					longitudeDelta : 0.01
				};

				var mapview = Titanium.Map.createView({
					mapType : Titanium.Map.STANDARD_TYPE,
					region : new_york,
					animate : true,
					regionFit : true,
					userLocation : true,
					annotations : [annotation]
				});

				win.add(mapview);
				mapview.selectAnnotation(annotation);
			}
		});

		Titanium.UI.currentTab.open(win, {
			animated : true
		});

	});
	
	function requestReunionData(path) {
		getReunionData(path, function(_respData) {
			var data = JSON.parse(_respData);
			var rows = buildTableRows(data.schedule);
			var curr_tab = Titanium.App.Properties.getInt("bar_setting", 0);

			if(rows.length != 0) {
		
				//alert('hello');
			}

			tableview.setData(rows, {
				animationStyle : Titanium.UI.iPhone.RowAnimationStyle.FADE
			});
			activity_indicator.view.hide();
		});
	}

	function setButtonBarIndex(index) {
		Titanium.App.Properties.setInt("bar_setting", index);
		Titanium.App.fireEvent('app:clicked', {
			bar_flag : button_bar.index
		});
	}

	//add window elements TODO: organize.
	win.add(separator, button_bar, tableview, activity_indicator.view);
	buildSettingsButton();
	win.setLeftNavButton(reload_button);
	activity_indicator.view.show();

});

function buildReloadButton(options) {
	var reload_button = Titanium.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.REFRESH
	});

	win.setLeftNavButton(reload_button);

	reload_button.addEventListener('click', function() {
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

/**
 * @return object
 * @param array
 *
 * This function takes a JSON object
 * and returns a table view.
 */
function buildTableRows(schedule, bar_index) {
	//Titanium.API.info("Building table view [params]: " + JSON.stringify(schedule));

	var last_date = null;
	var rows = [];

	for(var i = 0; i < schedule.length; i++) {
		var event = schedule[i];

		var row = Ti.UI.createTableViewRow({
			hasChild : true,
			height : 68,
			hasDetail : true,
			event_title : event.title,
			start_time : event.start_time,
			end_time : event.end_time,
			location_name : event.location_name,
			event_description : event.description,
			latitude : event.latitude,
			longitude : event.longitude,
		});

		var lbl = Ti.UI.createLabel({
			text : event.title,
			textAlign : 'left',
			font : {
				fontWeight : 'bold',
				fontSize : 14
			},
			top : 0,
			left : 5,
			bottom : 15
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
			top : 40
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
			top : 40,
			left : 130
		});

		var date = new Date(event.date * 1000);

		row.add(lbl, lbl2, lbl3);

		if(!last_date || last_date.getDay() != date.getDay()) {
			row.header = event.display_date;
		}
		last_date = date;
		rows.push(row);
	}

	return rows;
}