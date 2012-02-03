var win = Titanium.UI.currentWindow;
Ti.include(Titanium.Filesystem.resourcesDirectory + 'Model/db.js');
Ti.include(Titanium.Filesystem.resourcesDirectory + 'Model/picker.js');

//pull user's registration code.
var reg_code = db.getRegCode();

//initialize array that will hold custom field values.
var field_values = [];

var valueRow = Titanium.UI.createTableViewRow({
	height : 46,
	className : 'valueRow'
});

var codeRow = Titanium.UI.createTableViewRow({
	height : 46,
	className : 'codeRow'
});

var valueLabel = Ti.UI.createLabel({
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

var valueData = Ti.UI.createLabel({
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

var codeLabel = Ti.UI.createLabel({
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

var codeData = Titanium.UI.createTextField({
	color : '#3D4460',
	value : reg_code.code,
	height : 20,
	width : 150,
	top : 11,
	left : 133,
	font : {
		fontSize : 12,
		fontWeight : 'normal'
	}
});

// zero out field on focus.
codeData.addEventListener('focus', function() {
	codeData.value = '';

});
// add values to rows.
valueRow.add(valueLabel);
valueRow.add(valueData);

// add code values to label.
codeRow.add(codeLabel);
codeRow.add(codeData);

field_values.push(valueRow);
field_values.push(codeRow);

// view initialization.
var pickerView = Titanium.UI.createView({
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
		valueData.text = picker.view.getSelectedRow(0).title + " " + picker.view.getSelectedRow(1).title;
		tableView.setData(field_values);
	}
});

var done = new reunion.Done({
	click : function() {
		db.updateYearSchool(picker.view.getSelectedRow(1).title, picker.view.getSelectedRow(0).title, picker.view.getSelectedRow(0).school_abbr, picker.view.getSelectedRow(0).cohort_prefix);
		Ti.API.info(JSON.stringify(picker.view.getSelectedRow(0)));
		pickerView.animate(slideOut);
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
pickerView.add(picker.view);
pickerView.add(toolbar.view);

var settings_done = Ti.UI.createButton({
	systemButton : Titanium.UI.iPhone.SystemButton.DONE
});

win.setRightNavButton(settings_done);

settings_done.addEventListener('click', function() {

	if(codeData.value == '') {
		alert('You must enter a valid registration code to retrive your schedule.');
	} else {
		db.updateInsertRegCode(codeData.value);
		win.close();
	}
});

// event functions
tableView.addEventListener('click', function(eventObject) {
	if(eventObject.rowData.className == "valueRow") {
		pickerView.animate(slideIn);
	}
});

valueData.text = db.getYearSchoolAsText();

// build display
win.add(tableView);
win.add(pickerView);
