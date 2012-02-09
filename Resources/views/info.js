/**
 * @author Clint Newsom
 * 02-08-2012
 * cn2284@columbia.edu
 */

var win = Titanium.UI.currentWindow;
Ti.include(Titanium.Filesystem.resourcesDirectory + 'views/setupWindow.js');
Ti.include(Titanium.Filesystem.resourcesDirectory + 'Model/db.js');

win.addEventListener('focus', function() {
	setUpWindow('Information');

	var info = db.getUserPrefs();
	
	if(info.school_abbr == "CC") {
		var filename = 'cc-crown-for-info-screen.png';
	}
	
	if(info.school_abbr == "SEAS") {
		var filename = 'ce-crown-for-info-screen.png';
	}

	if(info.school_abbr == "GS") {
		var filename = 'cu-crown-for-info-screen.png';
	}

	//Table header objects.
	var logo_fn = Ti.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'images/' + filename);
	var right_pos = 19;
	var left_pos = 90;

	var logo = Titanium.UI.createImageView({
		image : logo_fn,
		top : 20,
		right : 230,
		left : 0,
		zIndex : -1
	});

	var schoolLabel = Ti.UI.createLabel({
		top : 20,
		left : left_pos,
		right : right_pos,
		height : 'auto',
		text : info.school,
		font : {
			fontSize : 17,
			fontWeight : 'bold'
		},
		color : '#4D576D',
		shadowColor : '#FAFAFA',
		shadowOffset : {
			x : 0,
			y : 1
		}
	});

	var yearLabel = Ti.UI.createLabel({
		top : 38,
		left : left_pos,
		right : right_pos,
		height : 'auto',
		text : 'Class of ' + info.year,
		font : {
			fontSize : 17,
			fontWeight : 'bold'
		},
		color : '#4D576D',
		shadowColor : '#FAFAFA',
		shadowOffset : {
			x : 0,
			y : 1
		}
	});

	var reunionEventLabel = Ti.UI.createLabel({
		top : 55,
		left : left_pos,
		right : right_pos,
		height : 'auto',
		text : 'Alumni Reunion Weekend',
		font : {
			fontSize : 17,
			fontWeight : 'bold'
		},
		color : '#4D576D',
		shadowColor : '#FAFAFA',
		shadowOffset : {
			x : 0,
			y : 1
		}
	});

	//Should date be pulled from reunion_base?
	var dateLabel = Ti.UI.createLabel({
		top : 70,
		left : left_pos,
		right : right_pos,
		height : 'auto',
		text : 'May 31 - Jun 3, 2012',
		font : {
			fontSize : 17
		},
		color : '#4D576D',
		shadowColor : '#FAFAFA',
		shadowOffset : {
			x : 0,
			y : 1
		}
	});

	var tableHeader = Ti.UI.createView({
		top : 55,
		width : 320,
		height : 85
	});

	//Add table header objects to screen.
	tableHeader.add(logo, schoolLabel, yearLabel, reunionEventLabel, dateLabel);

	//This table will need to be created in Reunion base. 
	var inputData = [{
		title : 'Registration'
	}, {
		title : 'Early Bird Discount',
		header : '',
		hasChild : true
	}, {
		title : 'Confirmation',
		hasChild : true
	}, {
		title : 'Cancellation',
		hasChild : true
	}, {
		title : 'Lodging',
		hasChild : true
	}, {
		title : 'Parking',
		hasChild : true
	}];

	var tableView = Titanium.UI.createTableView({
		data : inputData,
		style : Titanium.UI.iPhone.TableViewStyle.GROUPED,
		headerView : tableHeader,
		backgroundImage : '../images/background-notile.png'
	});

	win.add(tableView);

	var settings_win = Titanium.UI.createWindow({
		title : 'Settings',
		backgroundColor : '#A6B7C8',
		statusBarHidden : true,
		tabBarHidden : true,
		modal : true,
		url : "settings.js"
	});

	var settings_button = Ti.UI.createButton({
		title : "settings",
		image : "../images/settings-icon.png",
		width : 5,
		opacity : 0.2,
		color : '#A49BBA'
	});

	win.setRightNavButton(settings_button);

	settings_button.addEventListener('click', function() {
		settings_win.open();
	});

	tableView.addEventListener('click', function(e) {
		// event data
		var index = e.index;
		var section = e.section;
		var row = e.row;
		var rowdata = e.rowData;
		if(index == 0) {
			Ti.Platform.openURL('http://www.columbia.edu');
		}
		if(index == 1) {
			alert('second');
		}
	});
});
