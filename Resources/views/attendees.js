/**
 * @author Clint Newsom
 * 02-08-2012
 * cn2284@columbia.edu
 */

var win = Titanium.UI.currentWindow;

Ti.include(Titanium.Filesystem.resourcesDirectory + 'Model/db.js');
Ti.include(Titanium.Filesystem.resourcesDirectory + 'views/setupWindow.js');
Ti.include(Titanium.Filesystem.resourcesDirectory + 'Model/xhr.js');

win.addEventListener('focus', function() {

	var info = db.getUserPrefs();

	setUpWindow(info.school);

	var info = db.getUserPrefs();
	var attendee_table;
	var attendee_year_table;

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

	// button bar.
	var buttons = [{
		title : 'All',
		width : 150,
		enabled : true
	}, {
		title : 'My Class',
		width : 150,
		enabled : false
	}];

	var button_bar = Titanium.UI.createTabbedBar({
		labels : buttons,
		top : 5,
		style : Titanium.UI.iPhone.SystemButtonStyle.BAR,
		height : 30,
		index : 0,
		backgroundColor : '#4a85c8'
	});

	//pull data.
	activity_indicator.show();
	win.add(activity_indicator);

	getReunionData('/attendees/' + info.school_abbr, function(_respData) {
		var data = JSON.parse(_respData);
		Ti.API.info(JSON.stringify(data));
		attendee_table = createAttendeeTableView(data.attendees);
		win.add(attendee_table);
		activity_indicator.hide();
	});

	button_bar.addEventListener('click', function(e) {

		var index = e.index;

		var slide_out = Titanium.UI.createAnimation({
			bottom : -251
		});

		if(index == 0) {
			Ti.API.info('/attendees/' + info.school_abbr);
			getReunionData('/attendees/' + info.school_abbr, function(_respData) {
				var data = JSON.parse(_respData);
				Ti.API.info(JSON.stringify(data));
				attendee_table = createAttendeeTableView(data.attendees);
				win.add(attendee_table);
				activity_indicator.hide();
			});
		}
		if(index == 1) {
			Ti.API.info('/attendees/' + info.school_abbr + '/' + info.year);
			getReunionData('/attendees/' + info.school_abbr + '/' + info.year, function(_respData) {
				var data = JSON.parse(_respData);
				Ti.API.info(JSON.stringify(data));
				attendee_year_table = createAttendeeTableView(data.attendees);
				attendee_table.hide();
				win.add(attendee_year_table);
				activity_indicator.hide();
			});
		}
	});

	win.add(button_bar);

	/**
	 * @return table object.
	 */
	
	function createAttendeeTableView(attendees) {

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

		//set up search bar
		var search = Titanium.UI.createSearchBar({
			showCancel : false,
			hintText : 'search'
		});
		
		var tableview = Titanium.UI.createTableView({
			data : rows,
			top : 39,
			style : Titanium.UI.iPhone.TableViewStyle.GROUPED,
			backgroundImage : '../images/background-notile.png'
		});

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
		}

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
		// add table view to the window
		//Titanium.UI.currentWindow.add(tableview);
		return tableview;
	}

});
