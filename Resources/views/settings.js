var win = Titanium.UI.currentWindow;

Ti.include(Titanium.Filesystem.resourcesDirectory + 'Model/db.js');
Ti.include(Titanium.Filesystem.resourcesDirectory + 'Model/picker.js');

var reg_code = db.getRegCode();
//Ti.API.info("++++++++++++++HI " + reg_code);
// build custom tableView data/layout
var array = [];

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
	//textAlign: 'right',
	font : {
		fontSize : 12,
		fontWeight : 'normal'
	},
	//textAlign : 'right'
});

codeData.addEventListener('focus', function() {
	codeData.value = '';

});
/*
 var codeData = Ti.UI.createLabel({
 color : '#3D4460',
 text : reg_code,
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
 */

valueRow.add(valueLabel);
valueRow.add(valueData);
array.push(valueRow);

codeRow.add(codeLabel);
codeRow.add(codeData);
array.push(codeRow);

// view initialization
var pickerView = Titanium.UI.createView({
	height : 251,
	bottom : -251
});
var tableView = Titanium.UI.createTableView({
	data : array,
	style : Titanium.UI.iPhone.TableViewStyle.GROUPED
});

var slide_in = Titanium.UI.createAnimation({
	bottom : 0
});
var slide_out = Titanium.UI.createAnimation({
	bottom : -251
});

var picker = new reunion.PickerClass({
	change : function() {
		valueData.text = picker.view.getSelectedRow(0).title + " " + picker.view.getSelectedRow(1).title;
		tableView.setData(array);
	}
});

var done = new reunion.Done({
	click : function() {
		db.updateYearSchool(picker.view.getSelectedRow(1).title, 
							picker.view.getSelectedRow(0).title,
							picker.view.getSelectedRow(0).school_abbr,
							picker.view.getSelectedRow(0).cohort_prefix);
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
// animations
var slideIn = Titanium.UI.createAnimation({
	bottom : -43
});
var slideOut = Titanium.UI.createAnimation({
	bottom : -251
});

// event functions
tableView.addEventListener('click', function(eventObject) {
	if(eventObject.rowData.className == "valueRow") {
		//titleText.blur();
		//datePickerView.animate(slideOut);
		pickerView.animate(slideIn);
	}
});

valueData.text = db.getYearSchoolAsText();

// build display
win.add(tableView);
win.add(pickerView);
