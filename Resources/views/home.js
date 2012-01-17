// this sets the background color of the master UIView (when there are no windows/tab groups on it)
/*Titanium.UI.setBackgroundColor('#000');

// create tab group
var tabGroup = Titanium.UI.createTabGroup();

//
// create controls tab and root window
//
var win1 = Titanium.UI.createWindow({  
    url:'views/info.js',
	titleid:'Information'
});

var tab1 = Titanium.UI.createTab({  
    icon:'images/KS_nav_info.png',
    title:'Info',
    window:win1
});

var label1 = Titanium.UI.createLabel({
	color:'#999',
	text:'Info',
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});

win1.add(label1);

//
// create controls tab and root window
//
var win2 = Titanium.UI.createWindow({  
    url:'views/schedule.js',
	titleid:'schedule'
});
var tab2 = Titanium.UI.createTab({  
    icon:'images/KS_nav_schedule.png',
    title:'Schedule',
    window:win2
});

var label2 = Titanium.UI.createLabel({
	color:'#999',
	text:'Schedule',
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});

win2.add(label2);



var win3 = Titanium.UI.createWindow({  
    url:'views/attendees.js',
	titleid:'schedule'
});
var tab3 = Titanium.UI.createTab({  
    icon:'images/KS_nav_attendees.png',
    title:'Schedule',
    window:win3
});

var label3 = Titanium.UI.createLabel({
	color:'#999',
	text:'Schedule',
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});

win3.add(label3);


//
// create controls tab and root window
//
var win4 = Titanium.UI.createWindow({  
    title:'News',
    backgroundColor:'#fff'
});
var tab4 = Titanium.UI.createTab({  
    icon:'images/KS_nav_news.png',
    title:'News',
    window:win4
});

var label4 = Titanium.UI.createLabel({
	color:'#999',
	text:'News',
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});

win4.add(label4);

//
//  add tabs
//
tabGroup.addTab(tab1);  
tabGroup.addTab(tab2);  
tabGroup.addTab(tab3);  
tabGroup.addTab(tab4);
//tabGroup.addTab(tab5);
// open tab group
tabGroup.open();
*/
