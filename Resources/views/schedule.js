var win = Titanium.UI.currentWindow;
Ti.include(Titanium.Filesystem.resourcesDirectory + 'Model/db.js');
win.barColor = '#60A0D4';
win.backgroundColor = '#60A0D4';
win.addEventListener('focus', function() 
{ 
  buildWindow();
});


function buildWindow(){
	//var info = db.getYearSchool();
  	win.setTitle('Schedule');
  	
  	buildReloadButton();
  	buildSettingsButton();
    buildButtonBar();
	//requestReunionBaseData('CC', 'cc2007');
	requestReunionBaseData('CC', 'cc2007');
	Ti.App.addEventListener('data.received', function(data) {
		createTableView(data.schedule);
	});	
}

function buildReloadButton(){
	var reload_button =  Titanium.UI.createButton({
		systemButton:Titanium.UI.iPhone.SystemButton.REFRESH
	});
 
	win.setLeftNavButton(reload_button);

	reload_button.addEventListener('click', function(e)
	{
		alert('cool');
	});
	
}

function buildSettingsButton(){
	var settings_button = Ti.UI.createButton({
		title: "settings",
 		image: "../images/settings-icon.png"
	});
 
	win.setRightNavButton(settings_button);
	
	settings_button.addEventListener('click', function(e)
	{
		alert('cool 2');
	});
		
}

function buildButtonBar(){	
	var buttons = [
      {title:'Class Schedule', width:155, enabled:true},
      {title:'My Schedule', width:155, enabled:false}
    ];
	
	var button_bar = Titanium.UI.createTabbedBar({
		labels:buttons,
		top:10,
		style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
		height:20,
		index:0,
		backgroundColor:'#60A0D4'
		
	});
	
	win.add(button_bar);	
	
	button_bar.addEventListener('click',function(e){
		
		var index = e.index;
		
		if(index == 0){
			alert('first');
		}
		if(index == 1){
			alert('second');
		}
	});
}


function requestReunionBaseData(reunion_class, reunion_cohort){
	//we need to add an acess key.
	//var access_key = null;
	
	var base_url =  'https://chameleon.college.columbia.edu/reunion_base/service/schedule/';
	var request_url = base_url + reunion_class + '/' + reunion_cohort;
	//Ti.API.info(request_url);
	var xhr = Ti.Network.createHTTPClient();
	xhr.timeout = 1000000;
	xhr.open("GET", request_url);
	xhr.onload = function(){
		var s = JSON.parse(this.responseText);
		Ti.App.fireEvent('data.received', s);
		//Titanium.API.info(this.responseText);
		//return this.responseText;
	
	};

    xhr.send();

	xhr.onerror = function(e){
		Ti.API.info(e);
	};	
	
}

// create table view data object
function createTableView(schedule){
	Titanium.API.debug("++++ " + JSON.stringify(schedule));
	
	var last_date = null;
	
	var rows = [];

	for(var i = 0; i<schedule.length; i++){
		var event = schedule[i];
				
		var row = Ti.UI.createTableViewRow({hasChild:true, height:55, hasDetail: true});
   
		var lbl = Ti.UI.createLabel({
			text : event.title,
			textAlign : 'left',
			font : {
				fontWeight : 'bold',
				fontSize : 14
			},
			left : 5
		});
		var lbl2 = Ti.UI.createLabel({
			text : event.start_time + '-' + event.end_time,
			textAlign : 'left',
			color : '#C7C7C7',
			font : {
				fontWeight : 'bold',
				fontSize : 13
			},
			left : 5,
			top : 35
		});
		var lbl3 = Ti.UI.createLabel({
			text : event.location_name,
			textAlign : 'left',
			color : '#6B90B5',
			font : {
				fontWeight : 'bold',
				fontSize : 13
			},
			left : 5,
			top : 35,
			left : 130
		});

	var date = new Date(event.date*1000); // convert to milliseconds	
	row.add(lbl,lbl2,lbl3);

	if(!last_date || last_date.getDay() != date.getDay()) {
		row.header = event.display_date;
	}
	
	last_date = date;
	
	rows.push(row);
	}


	// create table view
	var tableview = Titanium.UI.createTableView({
		data: rows, 
		top:39
	});

	// create table view event listener
	tableview.addEventListener('click', function(e)
	{
		Ti.API.info(e);
			
		var win = Titanium.UI.createWindow({
			barColor:'#60A0D4',
			translucent:true,
		});
		
		var event = schedule[e.index];
		
		var inputData = [
			{title: event.title, header:''},
			{title:'Map',  hasChild: true},
			{title:'Website', hasChild: true},
			{title: event.description, header: ''},
		];

		var tableView = Titanium.UI.createTableView({
			top:30,
			data:inputData,
			style:Titanium.UI.iPhone.TableViewStyle.GROUPED,
			//headerView: tableHeader,
			backgroundImage: '../images/background.png'
		});

		win.add(tableView);

		Titanium.UI.currentTab.open(win,{animated:true});	
	});

	
	tableview.addEventListener('longclick', function(e)
	{
		showClickEventInfo(e, true);
	});

	// add table view to the window
	Titanium.UI.currentWindow.add(tableview);

}
