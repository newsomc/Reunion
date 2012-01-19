var reunion = {};

reunion.TabsClass = function(){
	this.tabData = [
    	{title:'Info',icon:'images/KS_nav_info.png',url:'views/info.js'},
		{title:'Schedule',icon:'images/KS_nav_schedule.png',url:'views/schedule.js'},
    	{title:'Attendees',icon:'images/KS_nav_attendees.png',url:'views/attendees.js'},
    	{title:'Social',icon:'images/KS_nav_social.png',url:'views/facebook_photo.js'},
    	{title:'News',icon:'images/KS_nav_news.png',url:'views/news.js'}
	];
 
 	this.tabGroup = Titanium.UI.createTabGroup();

	for(var i in tabData){
    	var win = Titanium.UI.createWindow({
        	url: tabData[i].url,
        	navBarHidden:(tabData[i].navBarHidden?true:false),
        	tabBarHidden:(tabData[i].tabBarHidden?true:false)
    	});
 
    tabGroup.addTab(Titanium.UI.createTab({
        title:tabData[i].title,
        icon:tabData[i].icon,
        window:win
    }));
    
    win.add(Titanium.UI.createLabel({text: tabData[i].title}));
}