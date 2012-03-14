/**
 * @file
 * @author Clint Newsom
 * 02-08-2012
 * cn2284@columbia.edu
 */

var attendeesScreen = ( function() {

	var screen = {};

	//where focus event once was.
	screen.build = function() {

		screen.win = Titanium.UI.currentWindow;

		screen.win.addEventListener('focus', function() {
			var prefs = db.getUserPrefs();
			screen.setUp(prefs.school);

			var curr_tab = Titanium.App.Properties.getInt("a_bar_setting", 0);

			var reload_button = Titanium.UI.createButton({
				systemButton : Titanium.UI.iPhone.SystemButton.REFRESH
			});

			screen.activityIndicator = new uiElements.ActivityIndicator();
			screen.emptyLabel = new uiElements.EmptyLabel();

			var separator = Ti.UI.createView({
				width : '100%',
				height : 0.50,
				backgroundColor : 'black',
				top : 38
			});

			var buttons = [{
				title : 'All',
				width : 150,
				enabled : true
			}, {
				title : 'My Class',
				width : 150,
				enabled : false
			}];

			var button_bar = Titanium.UI.iOS.createTabbedBar({
				labels : buttons,
				top : 5,
				style : Titanium.UI.iPhone.SystemButtonStyle.BAR,
				height : 30,
				index : curr_tab,
				backgroundColor : '#4a85c8'
			});

			//set up search bar
			var search = Titanium.UI.createSearchBar({
				showCancel : false,
				hintText : 'search'
			});

			screen.tableview = Titanium.UI.createTableView({
				top : 39,
				search : search,
				//style : Titanium.UI.iPhone.TableViewStyle.GROUPED,
				backgroundImage : '../images/background-notile.png'
			});

			//search events.
			search.addEventListener('change', function(e) {
				e.value
			});
			search.addEventListener('return', function(e) {
				search.blur();
			});
			search.addEventListener('cancel', function(e) {
				search.blur();
			});
			if(curr_tab == 0) {
				screen.putData('attendees_class');
				screen.activityIndicator.view.hide();
			}
			if(curr_tab == 1) {
				screen.putData('attendees_class_year');
				screen.activityIndicator.view.hide();
			}

			//set up events.
			button_bar.addEventListener('click', function(e) {

				var index = e.index;

				if(index == 0) {
					screen.putData('attendees_class');
					screen.setButtonBarIndex(index);
					screen.activityIndicator.view.hide();
				}
				if(index == 1) {
					screen.putData('attendees_class_year');
					screen.setButtonBarIndex(index);
					screen.activityIndicator.view.hide();
				}
			});

			reload_button.addEventListener('click', function() {

				var curr_tab = Titanium.App.Properties.getInt("a_bar_setting", 0);
				screen.activityIndicator.view.show();

				if(curr_tab == 0) {
					screen.requestReunionData('/attendees/' + prefs.school_abbr, 'attendees_class');
				}
				if(curr_tab == 1) {
					screen.requestReunionData('/attendees/' + prefs.school_abbr + '/' + prefs.year, 'attendees_class_year');
				}

			});

			screen.win.add(button_bar, separator, screen.tableview, screen.activityIndicator.view, screen.emptyLabel.view);
			screen.win.setLeftNavButton(reload_button);
			screen.buildSettingsButton();
		});

		screen.win.addEventListener('focus', function() {
			var curr_tab = Titanium.App.Properties.getInt("a_bar_setting", 0);
			screen.activityIndicator.view.show();
			if(curr_tab == 0) {
				screen.putData('attendees_class');
				screen.activityIndicator.view.hide();
			}
			if(curr_tab == 1) {
				screen.putData('attendees_class_year');
				screen.activityIndicator.view.hide();
			}
		});
	};
	/**
	 * @param string
	 */
	screen.requestReunionData = function(path, my_property) {
		getReunionData(path, function(_respData) {
			var data = JSON.parse(_respData);
			var rows = screen.buildTableRows(data.attendees);
			screen.tableview.setData(rows, {
				animationStyle : Titanium.UI.iPhone.RowAnimationStyle.FADE
			});
			screen.activityIndicator.view.hide();
			var json = JSON.stringify(data);
			persist.updateString(my_property, json);
		});
	};
	/**
	 * @param json object
	 */
	screen.putData = function(my_property) {
		var json_data = Titanium.App.Properties.getString(my_property);
		var my_data = JSON.parse(json_data);
		var curr_tab = Titanium.App.Properties.getInt("a_bar_setting", 0);
		if(my_data.attendees) {
			var my_rows = screen.buildTableRows(my_data.attendees);
		}
		if(my_data.attendees.length == 0) {
			if( curr_tab = 0) {
				screen.emptyLabel.view.setText('There are currently no attendes indicated for this school.');
			}
			if( curr_tab = 1) {
				screen.emptyLabel.view.setText('There are currently no attendes indicated for this school and class year.');
			}
			screen.emptyLabel.view.show();

		} else {
			screen.emptyLabel.view.hide();
		}
		screen.tableview.setData(my_rows, {
			animationStyle : Titanium.UI.iPhone.RowAnimationStyle.FADE
		});
	};
	/**
	 * @param json array
	 * @return Titanium table rows object.
	 */
	screen.buildTableRows = function(attendees) {
		Ti.API.info(attendees);
		var last_cohort_abbr = null;
		var rows = [];

		for(var i = 0; i < attendees.length; i++) {
			var registrant = attendees[i];

			var row = Ti.UI.createTableViewRow({
				title : registrant.firstname + ' ' + registrant.lastname,
				hasChild : false,
				height : 55,
				hasDetail : false
			});

			if(!last_cohort_abbr || last_cohort_abbr != registrant.cohort_abbr) {
				row.header = registrant.cohort_name;
			}
			last_cohort_abbr = registrant.cohort_abbr;
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
	
	screen.setButtonBarIndex = function(index) {
		Titanium.App.Properties.setInt("a_bar_setting", index);
	};

	screen.setUp = function(title) {
		screen.win.setTitle(title);
		screen.win.barColor = '#4a85c8';
		screen.win.backgroundColor = '#4a85c8';
	};
	return screen;
}());

Ti.include('../db/db.js', '../ui/picker.js', '../ui/elements.js', '../network/network.js');
attendeesScreen.build();
