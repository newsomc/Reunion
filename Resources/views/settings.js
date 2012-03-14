/**
 * @author Clint Newsom
 * 02-08-2012
 * cn2284@columbia.edu
 */

var settingsScreen = ( function() {

	var screen = {};

	screen.build = function() {
		screen.win = Titanium.UI.currentWindow;
		var reg_code = db.getRegCode();
		var prefs = db.getUserPrefs();

		//initialize array that will hold custom field values.
		var field_values = [];
		var activityIndicator = Titanium.UI.createActivityIndicator({
			height : '100%',
			width : '100%',
			style : Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN,
			font : {
				fontFamily : 'Helvetica Neue',
				fontSize : 15,
				fontWeight : 'bold'
			},
			backgroundColor : '#000',
			opacity : 0.5,
			color : 'white',
		});

		var schoolYearRow = Titanium.UI.createTableViewRow({
			height : 46,
			className : 'schoolYearRow'
		});

		var regCodeRow = Titanium.UI.createTableViewRow({
			height : 46,
			className : 'regCodeRow'
		});

		var schoolYearLabel = Ti.UI.createLabel({
			color : '#000000',
			text : "School and Year",
			font : {
				fontSize : 12,
				fontWeight : 'bold'
			},
			top : 8,
			left : 12,
			height : 24,
			width : 170
		});

		var schoolYearData = Ti.UI.createLabel({
			color : '#3D4460',
			text : "",
			font : {
				fontSize : 12,
				fontWeight : 'normal'
			},
			top : 11,
			left : 102,
			height : 20,
			width : 180,
			textAlign : 'right'
		});

		var regCodeLabel = Ti.UI.createLabel({
			color : '#000000',
			text : "Registration Code",
			font : {
				fontSize : 12,
				fontWeight : 'bold'
			},
			top : 8,
			left : 12,
			height : 24,
			width : 170
		});

		var regCodeData = Titanium.UI.createTextField({
			color : '#3D4460',
			value : reg_code.code,
			height : 20,
			width : 150,
			top : 11,
			left : 159,
			font : {
				fontSize : 12,
				fontWeight : 'normal'
			}
		});

		// zero out field on focus.
		regCodeData.addEventListener('focus', function() {
			regCodeData.value = '';
		});

		regCodeData.addEventListener('return', function() {
			screen.win.fireEvent('showAct');
			if(regCodeData.value == ''){
				Ti.API.info('you did it!');
				persist.updateScheduleByRegistrant('skip-request');
			}else{
				persist.updateScheduleByRegistrant(regCodeData.value);
			}
			screen.win.fireEvent('endAct');
		});
		// add values to rows.
		schoolYearRow.add(schoolYearLabel);
		schoolYearRow.add(schoolYearData);

		// add code values to label.
		regCodeRow.add(regCodeLabel);
		regCodeRow.add(regCodeData);

		field_values.push(schoolYearRow);
		field_values.push(regCodeRow);

		// view initialization.
		var picker_view = Titanium.UI.createView({
			height : 251,
			bottom : -251
		});

		var tableView = Titanium.UI.createTableView({
			data : field_values,
			style : Titanium.UI.iPhone.TableViewStyle.GROUPED
		});

		// set up animations.
		var slide_in = Titanium.UI.createAnimation({
			bottom : 0
		});

		var slide_out = Titanium.UI.createAnimation({
			bottom : -251
		});

		// initialize wrapper classes.
		var picker = new reunionPicker.PickerClass({
			change : function() {
				schoolYearData.text = picker.view.getSelectedRow(0).title + " " + picker.view.getSelectedRow(1).title;
				tableView.setData(field_values);
			}
		});

		var done = new reunionPicker.Done({
			click : function() {
				screen.win.fireEvent('showAct');
				picker_view.animate(slide_out);
				db.updateYearSchool(picker.view.getSelectedRow(1).title, picker.view.getSelectedRow(0).title, picker.view.getSelectedRow(0).school_abbr, picker.view.getSelectedRow(0).cohort_prefix);
				persist.updateScheduleByClass(picker.view.getSelectedRow(0).school_abbr + '/' + picker.view.getSelectedRow(0).cohort_prefix + picker.view.getSelectedRow(1).title);
				persist.updateAttendeesByClass(picker.view.getSelectedRow(0).school_abbr);
				persist.updateAttendeesByClassYear(picker.view.getSelectedRow(0).school_abbr + '/' + picker.view.getSelectedRow(1).title);
				
				screen.win.fireEvent('endAct');
			}
		});

		screen.win.addEventListener('showAct', function() {
			settings_done.enabled = false;
			activityIndicator.show();
		});

		screen.win.addEventListener('endAct', function() {
			t = 0;
			timer = setInterval(function() {
				t++;
				Ti.API.info(t);
				if(t == 5) {
					activityIndicator.hide();
					settings_done.enabled = true;
					clearInterval(timer);
				}
			}, 1000);
		});
		
		var cancel = new reunionPicker.Cancel({
			click : function() {
				picker_view.animate(slide_out);
			}
		});

		var spacer = new reunionPicker.Spacer();
		var toolbar = new reunionPicker.ToolBarClass([cancel.view, spacer.view, done.view]);

		//add custom ui objects to picker view.
		picker_view.add(picker.view);
		picker_view.add(toolbar.view);
		picker.view.setSelectedRow(0, 1, true);

		var settings_done = Ti.UI.createButton({
			systemButton : Titanium.UI.iPhone.SystemButton.DONE
		});

		screen.win.setRightNavButton(settings_done);

		settings_done.addEventListener('click', function() {
			if(regCodeData.value == '') {
				persist.updateScheduleByRegistrant('skip-request');
				alert('You may add a registration code to retrive your schedule. Check your registration reciept for your code.');
				screen.win.close();
			} else {
				db.updateInsertRegCode(regCodeData.value);
				screen.win.close();
			}
		});
		// event functions
		tableView.addEventListener('click', function(eventObject) {
			if(eventObject.rowData.className == "schoolYearRow") {
				picker_view.animate(slide_in);
			}
		});
		// build display
		screen.win.add(tableView, picker_view, activityIndicator);

		//Set picker to current user prefs.
		screen.win.addEventListener('open', function(e) {
			if(prefs.school_abbr == 'CC') {
				picker.view.setSelectedRow(0, 0, false);
			}
			if(prefs.school_abbr == 'SEAS' && prefs.cohort_prefix == 'seas') {
				picker.view.setSelectedRow(0, 1, false);
			}
			if(prefs.school_abbr == 'SEAS' && prefs.cohort_prefix == 'gradEn') {
				picker.view.setSelectedRow(0, 2, false);
			}
			if(prefs.school_abbr == 'GS') {
				picker.view.setSelectedRow(0, 3, false);
			}

			var reunion_years = ['1942', '1947', '1952', '1957', '1962', '1967', '1972', '1977', '1982', '1987', '1992', '1997', '2002', '2007'];
			var user_year = prefs.year;
			//Ti.API.info("USER YEAR: " + user_year);
			for( i = 0; i < reunion_years.length; i++) {
				if(user_year == reunion_years[i]) {
					picker.view.setSelectedRow(1, i, false);
				}
			}

		});

		schoolYearData.text = db.getYearSchoolAsText();
	}
	return screen;
}());

Ti.include('../db/db.js', '../ui/picker.js', '../ui/elements.js', '../network/network.js', '../db/persistData.js');
settingsScreen.build();
