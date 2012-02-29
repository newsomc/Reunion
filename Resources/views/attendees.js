/**
 * @file
 * @author Clint Newsom
 * 02-08-2012
 * cn2284@columbia.edu
 */

var win = Titanium.UI.currentWindow;

Ti.include(Titanium.Filesystem.resourcesDirectory + 'Model/db.js');
Ti.include(Titanium.Filesystem.resourcesDirectory + 'Model/xhr.js');
Ti.include(Titanium.Filesystem.resourcesDirectory + 'Model/ui.js');
Ti.include(Titanium.Filesystem.resourcesDirectory + 'views/setupWindow.js');

win.addEventListener('focus', function() {

	var prefs = db.getUserPrefs();

	setUpWindow(prefs.school);

	var cur_tab = Titanium.App.Properties.getInt("attendee_bar_setting", 0);

	var reload_button = Titanium.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.REFRESH
	});

	var activity_indicator = new reunion.ActivityIndicator();

	Ti.API.info('hi');

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
		index : cur_tab,
		backgroundColor : '#4a85c8'
	});

	//set up search bar
	var search = Titanium.UI.createSearchBar({
		showCancel : false,
		hintText : 'search'
	});

	var tableview = Titanium.UI.createTableView({
		top : 39,
		search : search,
		style : Titanium.UI.iPhone.TableViewStyle.GROUPED,
		backgroundImage : '../images/background-notile.png'
	});

	/*
	if(attendees.length != 0) {
	tableview.search = search;
	}

	if(attendees.length == 0) {
	var empty_label = Ti.UI.createLabel({
	top : 5,
	left : 20,
	right : 20,
	text : 'There are currently no attendees. Check again soon!',
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
	}*/

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

	Ti.API.info('Just before load');
	requestReunionData('/attendees/' + prefs.school_abbr);

	//set up events.
	button_bar.addEventListener('click', function(e) {

		var index = e.index;

		if(index == 0) {
			requestReunionData('/attendees/' + prefs.school_abbr);
		}
		if(index == 1) {
			requestReunionData('/attendees/' + prefs.school_abbr + '/' + prefs.year);
		}
	});

	reload_button.addEventListener('click', function() {

		var cur_tab = Titanium.App.Properties.getInt("attendee_bar_setting", 0);
		activity_indicator.view.show();

		if(cur_tab == 0) {
			requestReunionData('/attendees/' + prefs.school_abbr);
		}
		if(cur_tab == 1) {
			requestReunionData('/attendees/' + prefs.school_abbr + '/' + prefs.year);
		}

	});
	/**
	 * @param string
	 */
	function requestReunionData(path) {
		getReunionData(path, function(_respData) {
			var data = JSON.parse(_respData);
			var rows = buildTableRows(data.attendees);

			tableview.setData(rows, {
				animationStyle : Titanium.UI.iPhone.RowAnimationStyle.FADE
			});
			activity_indicator.view.hide();
		});
	}

	/**
	 * @param json array
	 * @return Titanium table rows object.
	 */
	function buildTableRows(attendees) {
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
	}

	activity_indicator.view.show();
	win.add(button_bar, separator, tableview, activity_indicator.view);
	win.setLeftNavButton(reload_button);
	buildSettingsButton();
});

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