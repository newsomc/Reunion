/**
 * @author Clint Newsom
 * 02-08-2012
 * cn2284@columbia.edu
 */

var win = Titanium.UI.currentWindow;
Ti.include(Titanium.Filesystem.resourcesDirectory + 'views/setupWindow.js');
Ti.include(Titanium.Filesystem.resourcesDirectory + 'Model/db.js');
Ti.include(Titanium.Filesystem.resourcesDirectory + 'Model/xhr.js');
Ti.include(Titanium.Filesystem.resourcesDirectory + 'Model/ui.js');

win.addEventListener('focus', function() {

	setUpWindow('Information');

	var info = db.getUserPrefs();

	//Ti.API.info("PREFS: " + JSON.stringify(info));
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

	var activity_indicator = new reunion.ActivityIndicator();

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

	var tableview = Titanium.UI.createTableView({
		style : Titanium.UI.iPhone.TableViewStyle.GROUPED,
		headerView : tableHeader,
		backgroundImage : '../images/background-notile.png'
	});

	getReunionData('/information/' + info.school_abbr.toLowerCase(), function(_respData) {
		var data = JSON.parse(_respData);
		if(!data){
			activity_indicator.view.hide();
		}
		var rows = buildInfoRows(data.information);

		tableview.setData(rows, {
			animationStyle : Titanium.UI.iPhone.RowAnimationStyle.UP
		});

		activity_indicator.view.hide();
	});
	
	function buildInfoRows(information) {

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
				hasDetail : true,
				node : info.nid,
				node_title: info.title,
			});

			rows.push(row);
		}

		return rows;
	}

	tableview.addEventListener('click', function(e) {

		var prefs = db.getUserPrefs();
		var prefix_url;

		if(prefs.school_abbr == 'CC') {
			prefix_url = 'https://alumni.college.columbia.edu/reunion/node/';
		}
		if(prefs.school_abbr == 'SEAS') {
			prefix_url = 'https://alumni.engineering.columbia.edu/reunion/node/';
		}
		if(prefs.school_abbr == 'GS') {
			prefix_url = 'https://alumni.gs.columbia.edu/reunion/node/';
		}

		var link_win = Ti.UI.createWindow({
			title : e.row.node_title,
			barColor : '#4a85c8'
		});

		var webview = Ti.UI.createWebView();

		if(e.row.node) {
			webview.url = prefix_url + e.row.node;
		}

		//Ti.API.info('https://alumni.college.columbia.edu/reunion/node/' + e.row.node);
		
		link_win.add(webview);
		win.tab.open(link_win);

		if(e.index == 0) {
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

	settings_button.addEventListener('click', function() {
		settings_win.open();
	});

	win.setRightNavButton(settings_button);
	tableHeader.add(logo, schoolLabel, yearLabel, reunionEventLabel, dateLabel);
	win.add(tableview);
	activity_indicator.view.show();
	win.add(activity_indicator.view);

});
