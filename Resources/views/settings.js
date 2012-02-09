/**
 * @author Clint Newsom
 * 02-08-2012
 * cn2284@columbia.edu
 */

var win = Titanium.UI.currentWindow;
Ti.include(Titanium.Filesystem.resourcesDirectory + 'Model/db.js');
Ti.include(Titanium.Filesystem.resourcesDirectory + 'Model/picker.js');

//pull user's registration code.
var reg_code = db.getRegCode();

//initialize array that will hold custom field values.
var field_values = [];

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
var picker = new reunion.PickerClass({
	change : function() {
		schoolYearData.text = picker.view.getSelectedRow(0).title + " " + picker.view.getSelectedRow(1).title;
		tableView.setData(field_values);
	}
});

var done = new reunion.Done({
	click : function() {
		db.updateYearSchool(picker.view.getSelectedRow(1).title, picker.view.getSelectedRow(0).title, picker.view.getSelectedRow(0).school_abbr, picker.view.getSelectedRow(0).cohort_prefix);
		Ti.API.info(JSON.stringify(picker.view.getSelectedRow(0)));
		picker_view.animate(slide_out);
	}
});

var cancel = new reunion.Cancel({
	click : function() {
		combo_box.show();
		picker_view.animate(slide_out);
	}
});

var spacer = new reunion.Spacer();
var toolbar = new reunion.ToolBarClass([cancel.view, spacer.view, done.view]);

//add custom ui objects to picker view.
picker_view.add(picker.view);
picker_view.add(toolbar.view);

var settings_done = Ti.UI.createButton({
	systemButton : Titanium.UI.iPhone.SystemButton.DONE
});

win.setRightNavButton(settings_done);

settings_done.addEventListener('click', function() {
	if(regCodeData.value == '') {
		alert('You can add a valid registration code to retrive your schedule.');
		win.close();
	} else {
		db.updateInsertRegCode(regCodeData.value);
		win.close();
	}
});

// event functions
tableView.addEventListener('click', function(eventObject) {
	if(eventObject.rowData.className == "schoolYearRow") {
		picker_view.animate(slide_in);
	}
});

schoolYearData.text = db.getYearSchoolAsText();

// build display
win.add(tableView);
win.add(picker_view);
