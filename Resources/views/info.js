/**
 * @author Clint Newsom
 * 02-08-2012
 * cn2284@columbia.edu
 */

var win = Titanium.UI.currentWindow;
Ti.include(Titanium.Filesystem.resourcesDirectory + 'views/setupWindow.js');
Ti.include(Titanium.Filesystem.resourcesDirectory + 'Model/db.js');
Ti.include(Titanium.Filesystem.resourcesDirectory + 'Model/xhr.js');

win.addEventListener('focus', function() {
	setUpWindow('Information');

	var info = db.getUserPrefs();

	Ti.API.info("PREFS: " + JSON.stringify(info));

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
	var info_table;

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

	/*

	var table_view_one = Titanium.UI.createTableView({
	data : registerRow,
	style : Titanium.UI.iPhone.TableViewStyle.GROUPED,
	headerView : tableHeader,
	backgroundImage : '../images/background-notile.png'
	});*/

	//Add table header objects to screen.

	tableHeader.add(logo, schoolLabel, yearLabel, reunionEventLabel, dateLabel);

	var info = db.getUserPrefs();
	Ti.API.info('/information/' + info.school_abbr.toLowerCase());

	getReunionData('/information/' + info.school_abbr.toLowerCase(), function(_respData) {
		var data = JSON.parse(_respData);
		info_table = buildInfoTable(data.information);
		win.add(info_table);
		activity_indicator.hide();
	});
	

	function buildInfoTable(information) {

		information.unshift([{
			"hasDetail" : true,
			"hasChild" : true,
			"height" : 45
		}]);

		var rows = [];

		for(var i = 0; i < information.length; i++) {

			var info = information[i];

			information[0].title = "Register";
			information[1].header = "";

			var row = Ti.UI.createTableViewRow({
				title : info.title,
				hasChild : true,
				height : 45,
				hasDetail : true
			});

			rows.push(row);
		}

		//rows.unshift(registerRow);

		Ti.API.info(JSON.stringify(rows));

		var table_view = Titanium.UI.createTableView({
			data : rows,
			style : Titanium.UI.iPhone.TableViewStyle.GROUPED,
			headerView : tableHeader,
			backgroundImage : '../images/background-notile.png'
		});

		table_view.addEventListener('click', function(e) {
			var prefs = db.getUserPrefs();

			// event data
			var site_info = information[e.index];

			var info_detail_win = Titanium.UI.createWindow({
				title : 'Info',
				barColor : '#4a85c8'
			});

			var info_detail_data = [];

			var descriptionRow = Titanium.UI.createTableViewRow({
				height : 'auto',
			});

			var infoDescriptionView = Ti.UI.createWebView({
				html : '<html><head><meta http-equiv="Content-Type" content="text/html;charset=UTF-8"></head><body style=\"font-family: Helvetica;font-size:14px;\"> ' + site_info.body + '</body></html>',
				top : 5,
				bottom : 15,
				left : 12,
				right : 12,
				height : 500
			});

			descriptionRow.add(infoDescriptionView);
			info_detail_data.push(descriptionRow);

			//create the event detail view.
			var info_detail_view = Titanium.UI.createTableView({
				data : info_detail_data,
				style : Titanium.UI.iPhone.TableViewStyle.GROUPED,
				backgroundImage : '../images/background-notile.png'
			});

			info_detail_win.add(info_detail_view);

			if(e.index != 0) {
				Titanium.UI.currentTab.open(info_detail_win, {
					animated : true
				});
			}

			if(e.index == 0) {
				//Ti.API.info("CLINT " + prefs.school_abbr);
				if(prefs.school_abbr == 'CC') {
					Ti.Platform.openURL('https://alumni.college.columbia.edu/reunion/register/home');
				}
				if(prefs.school_abbr == 'SEAS') {
					Ti.Platform.openURL('https://alumni.engineering.columbia.edu/reunion/register/home');
				}
				if(prefs.school_abbr == 'GS') {
					Ti.Platform.openURL('https://alumni.gs.columbia.edu/reunion/register/home');
				}

			}

		});
		return table_view;
	}

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
});
