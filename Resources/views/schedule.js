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

win.addEventListener('focus', function() {

	setUpWindow('Schedule');

	var schedule_table;

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

	var button_bar = Titanium.UI.iOS.createTabbedBar({
		labels : buttons,
		top : 10,
		style : Titanium.UI.iPhone.SystemButtonStyle.BAR,
		height : 20,
		backgroundColor : '#4a85c8'
	});

	win.add(button_bar);

	//Get user defined prefs.
	var info = db.getUserPrefs();
	var registration = db.getRegCode();
	var cohortAbbr = info.cohort_prefix + info.year;

	var reload_button = Titanium.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.REFRESH
	});

	getReunionData('/schedule/' + info.school_abbr + '/' + cohortAbbr, function(_respData) {
		var data = JSON.parse(_respData);
		schedule_table = buildTableView(data.schedule, button_bar.getIndex());
		win.add(schedule_table);
		activity_indicator.hide();
	});
	//attach button bar events
	button_bar.addEventListener('click', function(e) {
		var index = e.index;
		//TI.API.info("INDEX: " + index);
		if(index == 0) {
			getReunionData('/schedule/' + info.school_abbr + '/' + cohortAbbr, function(_respData) {
				var data = JSON.parse(_respData);
				schedule_table = buildTableView(data.schedule, button_bar.getIndex());
				win.add(schedule_table);
				activity_indicator.hide();
			});
		}
		if(index == 1) {
			getReunionData('/party_schedule/' + registration.code, function(_respData) {
				//getReunionData('/party_schedule/', function(_respData) {
				var data = JSON.parse(_respData);
				schedule_table = buildTableView(data.schedule, button_bar.getIndex());
				win.add(schedule_table);
				activity_indicator.hide();
			});
		}
	});

	Ti.API.info('CLINT INDEX: ' + button_bar.getIndex());

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
		getReunionData('/schedule/' + info.school_abbr + '/' + cohortAbbr, function(_respData) {
			var data = JSON.parse(_respData);
			schedule_table = buildTableView(data.schedule, button_bar.getIndex());
			win.add(schedule_table);
			activity_indicator.hide();
		});
	});
	buildSettingsButton();

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
	function buildTableView(schedule, bar_index) {
		Titanium.API.info("Building table view [params]: " + JSON.stringify(schedule));

		var last_date = null;

		var rows = [];

		//var my_index = bar_index;

		for(var i = 0; i < schedule.length; i++) {
			var event = schedule[i];

			var row = Ti.UI.createTableViewRow({
				hasChild : true,
				height : 68,
				hasDetail : true
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

			//convert to milliseconds
			var date = new Date(event.date * 1000);

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
			backgroundImage : '../images/background-notile.png',
		});

		if(schedule.length == 0) {
			tableview.style = Titanium.UI.iPhone.TableViewStyle.GROUPED;
			var empty_label = Ti.UI.createLabel({
				top : 5,
				left : 20,
				right : 20,
				text : 'There is currently no schedule information for this class year. Check again soon!',
				font : {
					fontSize : 15,
					fontWeight : 'bold'
				},
				color : '#4D576D',
				textAlign : 'center',
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

			var event = schedule[e.index];

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
				top : 35,
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
				html : '<html><head><meta http-equiv="Content-Type" content="text/html;charset=UTF-8"></head><body style=\"font-family: Helvetica;font-size:13px;\"> ' + event.description + '</body></html>',
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
			if(event.location_name) {
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

			win.addEventListener('close', function() {
				Ti.API.info('INDEX: ' + bar_index);
				button_bar.setIndex(bar_index);
			});

			event_detail_view.addEventListener('click', function(e) {

				//Ti.API.info("____________HI " + event.latitude);
				if(e.index == 1) {
					var map_win = Titanium.UI.createWindow({
						barColor : '#4a85c8',
						navBarHidden : false,
						tabBarHidden : false,
						title : 'Map'
					});

					var annotation = Titanium.Map.createAnnotation({
						latitude : event.latitude,
						longitude : event.longitude,
						title : event.location_name,
						//subtitle : 'Test',
						animate : true,
						leftButton : '../images/atlanta.jpg',
						image : "../images/boston_college.png"
					});

					var new_york = {
						latitude : event.latitude,
						longitude : event.longitude,
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
		return tableview;
	}

});
