/**
 * @file
 * @author Clint Newsom
 * 02-08-2012
 * cn2284@columbia.edu
 */

var scheduleScreen = ( function() {

	var screen = {};
	
	screen.build = function() {
		
		screen.win = Titanium.UI.currentWindow;
		screen.setUp('Schedule');
		screen.win.addEventListener('focus', function() {
			Ti.API.info('focus');
			//Get user defined prefs.
			var curr_tab = Titanium.App.Properties.getInt("bar_setting", 0);
			var prefs = db.getUserPrefs();
			var registration = db.getRegCode();
			var cohortAbbr = prefs.cohort_prefix + prefs.year;

			//ui elements
			var separator = Ti.UI.createView({
				width : '100%',
				height : 0.50,
				backgroundColor : 'black',
				top : 38
			});

			screen.activityIndicator = new uiElements.ActivityIndicator();
			screen.emptyLabel = new uiElements.EmptyLabel();
	
			screen.tableview = Titanium.UI.createTableView({
				top : 39,
				backgroundImage : '../images/background-notile.png',
			});

			var emptyLabel = new uiElements.EmptyLabel();

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
				screen.putData('schedule_class');
				screen.activityIndicator.view.hide();
			}
			if(curr_tab == 1) {
				screen.putData('schedule_registrant');
				screen.activityIndicator.view.hide();
			}

			//Set up events.
			button_bar.addEventListener('click', function(e) {
				var index = e.index;
				if(index == 0) {
					//screen.requestReunionData('/schedule/' + prefs.school_abbr + '/' + cohortAbbr);
					screen.putData('schedule_class');
					screen.setButtonBarIndex(index);
					screen.activityIndicator.view.hide();
				}
				if(index == 1) {
					//screen.requestReunionData('/party_schedule/' + registration.code);
					screen.putData('schedule_registrant');
					screen.setButtonBarIndex(index);
					screen.activityIndicator.view.hide();
				}
			});

			reload_button.addEventListener('click', function() {
				var curr_tab = Titanium.App.Properties.getInt("bar_setting", 0);
				screen.activityIndicator.view.show();

				if(curr_tab == 0) {
					screen.requestReunionData('/schedule/' + prefs.school_abbr + '/' + cohortAbbr, 'schedule_class');
				}
				if(curr_tab == 1) {
					screen.requestReunionData('/party_schedule/' + registration.code, 'schedule_registrant');
				}
			});
			
			// create table view event listener
			screen.tableview.addEventListener('click', function(e) {

				var event_info_data = [];

				var detailsWin = Titanium.UI.createWindow({
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
					height : 'auto'
				});
				
				//add UI elements to screen.
				mainInfoRow.add(eventTitleLabel, eventTimeLabel, eventLocationLabel);
				mapRow.add(mapLabel);
				descriptionRow.add(eventDescriptionView);
				
				//set height ot table row based on web view document height.
				eventDescriptionView.addEventListener('load', function(e){
    				descriptionRow.height = eventDescriptionView.evalJS("document.height;");
				});

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

				detailsWin.add(event_detail_view);

				event_detail_view.addEventListener('click', function(e) {
					if(e.index == 1) {
						//Ti.API.info(JSON.stringify(e.row));
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

						detailsWin.add(mapview);
						mapview.selectAnnotation(annotation);
					}
				});

				Titanium.UI.currentTab.open(detailsWin, {
					animated : true
				});
			});
			//add window elements TODO: organize.	
			screen.win.add(separator, button_bar, screen.tableview, screen.activityIndicator.view, screen.emptyLabel.view);
			screen.win.setLeftNavButton(reload_button);
			screen.buildSettingsButton();
		});
		

		screen.win.addEventListener('focus', function() {
			var curr_tab = Titanium.App.Properties.getInt("bar_setting", 0);
			screen.activityIndicator.view.show();
			if(curr_tab == 0) {
				//Ti.API.info('tryin dude!');
				screen.putData('schedule_class');
				screen.activityIndicator.view.hide();
			} 
			if(curr_tab == 1) {
				screen.putData('schedule_registrant');
				screen.activityIndicator.view.hide();
			}
		});

	};

	screen.requestReunionData = function(path, my_property) {
		screen.activityIndicator.view.show();
		getReunionData(path, function(_respData) {
		    var data = JSON.parse(_respData);
			var rows = screen.buildTableRows(data.schedule);
			if(rows.length != 0) {
				//alert('hello');
			}
			screen.tableview.setData(rows, {
				animationStyle : Titanium.UI.iPhone.RowAnimationStyle.FADE
			});
			screen.activityIndicator.view.hide();
			
			var json = JSON.stringify(data);
			persist.updateString(my_property, json);
			//db.deleteData(my_table);
			//db.setData(my_table, json);
		});
	};
	
	screen.putData = function(my_property){
		var json_data = Titanium.App.Properties.getString(my_property);
		var my_data = JSON.parse(json_data);
		var curr_tab = Titanium.App.Properties.getInt("bar_setting", 0);
		if(my_data.schedule){
			var my_rows = screen.buildTableRows(my_data.schedule);
		}
		if (my_data.schedule.length == 0){
			if(curr_tab = 0){
			 	screen.emptyLabel.view.setText('There are currently no events scheduled for your cohort. Please check again soon!');		
			}		
			if(curr_tab = 1){
				screen.emptyLabel.view.setText('You have not registered for any Reunion events or you have not set a valid registration code.');	
			}
			screen.emptyLabel.view.show();

		}else{
			screen.emptyLabel.view.hide();
		}
		screen.tableview.setData(my_rows, {
			animationStyle : Titanium.UI.iPhone.RowAnimationStyle.FADE
		});
	};

	screen.setButtonBarIndex = function(index) {
		Titanium.App.Properties.setInt("bar_setting", index);
	};
	
	/**
	 * @return object
	 * @param array
	 *
	 * This function takes a JSON object
	 * and returns a table view.
	 */
	screen.buildTableRows = function(schedule) {
		Ti.API.info('build table rows');
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
	};

	screen.buildSettingsButton = function() {
		var settings_button = Ti.UI.createButton({
			title : "settings",
			image : "../images/settings-icon.png"
		});

		screen.win.setRightNavButton(settings_button);

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
	};
	
	screen.setUp = function(title){
		screen.win.setTitle(title);
		screen.win.barColor = '#4a85c8';
		screen.win.backgroundColor = '#4a85c8';
	};
		
	return screen;

}());

Ti.include('../db/db.js', '../ui/picker.js', '../ui/elements.js', '../network/network.js');

scheduleScreen.build();

scheduleScreen.win.addEventListener('focus', function(){
	//Ti.API.info('FOCUSED!');
/*		
	var curr_tab = Titanium.App.Properties.getInt("bar_setting", 0);
	scheduleScreen.activityIndicator.view.show();
	if(curr_tab == 0){
		Ti.API.info('tryin dude!');
		scheduleScreen.putData('schedule_class');
		scheduleScreen.activityIndicator.view.hide();		
	}else{
		scheduleScreen.putData('schedule_registrant');
		scheduleScreen.activityIndicator.view.hide();
	}*/	
});
