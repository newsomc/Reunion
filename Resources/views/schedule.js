var win = Titanium.UI.currentWindow;
Ti.include(Titanium.Filesystem.resourcesDirectory + 'Model/db.js');
win.barColor = '#477AAB';
win.backgroundImage= '../images/background.png';
win.addEventListener('focus', function() 
{ 
  
  win.setTitle('Schedule');
  
  //acitivity indicator
  var activity_indicator = Titanium.UI.createActivityIndicator({
    height:50,
    width:150,
    style:Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN,
    font: {fontFamily:'Helvetica Neue', fontSize:15, fontWeight:'bold'},
    backgroundColor:'#000',
    opacity:0.5,
    borderRadius:5,
    color: 'white',
    message: 'Loading...',
  });
  activity_indicator.show();
  win.add(activity_incdicator);

  //xhr request
  //TODO: setup School and Cohort in Database.
  requestReunionBaseScheduleData('CC', 'cc2007');
  
  Ti.App.addEventListener('data.received', function(data) {
  	createTableView(data.schedule, actInd);
  	actInd.hide();
  });	
 
  buildReloadButton();
  buildSettingsButton(); 
  buildButtonBar();
 
});


function buildReloadButton(options){
	var reload_button =  Titanium.UI.createButton({
		//systemButton:Titanium.UI.iPhone.SystemButton.REFRESH
		systemButton:Titanium.UI.iPhone.SystemButton.ACTIVITY
	});
 
	win.setLeftNavButton(reload_button);
	
	reload_button.addEventListener('click', function(){
		alert('hi');
		//reload_button.systemButton = Titanium.UI.iPhone.SystemButton.ACTIVITY;
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
		backgroundColor:'#477AAB'
		
	});
	
	win.add(button_bar);	
	
	button_bar.addEventListener('click',function(e){
		
		var index = e.index;
		
		if(index == 0){
			alert('first');
		}
		if(index == 1){

		}
	});
}


function requestReunionBaseScheduleData(reunion_class, reunion_cohort, actInd){	
	
	
	
	
	
	var base_url =  'https://chameleon.college.columbia.edu/reunion_base/service/schedule/';
	var request_url = base_url + reunion_class + '/' + reunion_cohort;
	//Ti.API.info(request_url);
	var xhr = Ti.Network.createHTTPClient();
	xhr.timeout = 1000000;
	xhr.open("GET", request_url);
	xhr.onload = function(){
		var s = JSON.parse(this.responseText);
		Ti.App.fireEvent('data.received', s);
		actInd.hide();
		Titanium.API.info(this.responseText);
		//return this.responseText;
	};

    xhr.send();

	xhr.onerror = function(e){
		Ti.API.info(e);
	};	
	
}

// create table view data object
function createTableView(schedule, actInd){
	//Titanium.API.debug("++++ " + JSON.stringify(schedule));
	
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
		top:39,
		style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
		backgroundImage: '../images/background.png'
	});
	
	tableview.add(actInd);
	
	// create table view event listener
	tableview.addEventListener('click', function(e)
	{
		Ti.API.info(e);
			
		var win = Titanium.UI.createWindow({
			barColor:'#60A0D4',
			translucent:true,
		});
		
		var event = schedule[e.index];
		
		var description_label = Titanium.UI.createLabel({
  			color:'#000',
  			text: event.description,	
  			font:{fontStyle:'italics'}
			});

		var inputData = [
			{title: event.title, header:''},
			{title:'Map',  hasChild: true},
			{title:'Website', hasChild: true},
			{title: event.description, header: ''},
		];

		var event_detail_view = Titanium.UI.createTableView({
			top:30,
			data:inputData,
			style:Titanium.UI.iPhone.TableViewStyle.GROUPED,
			backgroundImage: '../images/background.png'
		});

		win.add(event_detail_view);
		
		event_detail_view.addEventListener('click', function(e){
			//Ti.API.info(e);	
			var event = schedule[e.index];
			//Ti.API.info("____________HI " + event.latitude);	
			if(e.index == 1){
				//Ti.Platform.openURL("http://maps.google.com/maps?saddr=" + event.latitude + "," + event.longitude);
				var map_win = Titanium.UI.createWindow({
					barColor:'#60A0D4',
					translucent:true,
				});
				
				var annotation = Titanium.Map.createAnnotation({
					latitude:event.latitude,
					longitude:event.longitude,
					title: event.location_name,
					subtitle:'Test',
					animate:true,
					leftButton:'../images/atlanta.jpg',
					image:"../images/boston_college.png"
				});

				var new_york = {
					latitude : event.latitude,
					longitude : event.longitude,
					latitudeDelta : 0.010,
					longitudeDelta : 0.018
				};

				var mapview = Titanium.Map.createView({
					mapType : Titanium.Map.STANDARD_TYPE,
					region : new_york,
					animate : true,
					regionFit : true,
					userLocation : true,
					annotations : [annotation]
				});
				
				map_win.add(mapview);
				map_win.open();
			}	
		});
		
		Titanium.UI.currentTab.open(win,{animated:true});	
	});

	
	tableview.addEventListener('longclick', function(e)
	{
		showClickEventInfo(e, true);
	});

	// add table view to the window
	Titanium.UI.currentWindow.add(tableview);

}
