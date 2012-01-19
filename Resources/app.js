Titanium.UI.setBackgroundColor('#000');
Ti.include(Titanium.Filesystem.resourcesDirectory + 'Model/db.js');
Ti.include(Titanium.Filesystem.resourcesDirectory + 'Model/picker.js');

var firstTime = db.isFirstTime();
//var firstTime = isFirstTime();
Ti.API.info('is First time? ' + firstTime);


var tabData = [
    {title:'Info',icon:'images/KS_nav_info.png',url:'views/info.js'},
	{title:'Schedule',icon:'images/KS_nav_schedule.png',url:'views/schedule.js'},
    {title:'Attendees',icon:'images/KS_nav_attendees.png',url:'views/attendees.js'},
    //{title:'Social',icon:'images/KS_nav_social.png',url:'views/facebook_photo.js'},
    //{title:'News',icon:'images/KS_nav_news.png',url:'views/news.js'}
];
 
var tabGroup = Titanium.UI.createTabGroup();

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

//Set up first screen.	
var first_time_window = Titanium.UI.createWindow({  
    backgroundImage: 'images/Default.png'
});

var tr = Titanium.UI.create2DMatrix();
tr = tr.rotate(90);

var drop_button =  Titanium.UI.createButton({
	style:Titanium.UI.iPhone.SystemButton.DISCLOSURE,
	transform:tr,
	enabled: true
});

//var combo_box =  Titanium.UI.createButton({
var combo_box = Titanium.UI.createTextField({
	hintText:"Select your school and year!",
	height:40,
	width:300,
	top:260,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
	rightButton:drop_button,
	rightButtonMode:Titanium.UI.INPUT_BUTTONMODE_ALWAYS
});

var confirm_button = Titanium.UI.createButton({
	title: 'Confirm',
	color: 'white',
	height:40,
	width:300,
	top:365,
	borderWidth:3,
	borderRadius:5,
	backgroundImage: 'none',
	backgroundColor:'#477AAB',
	font:{'font-style':'bold'}
});

var picker_view = Titanium.UI.createView({
	height:251,
	bottom:-251
});

/**
 * Add the objects we've built up to the view.
 */

var picker = new reunion.PickerClass();

var done = new reunion.Done({click: function() 
{
	combo_box.value =  picker.view.getSelectedRow(0).title + " " + picker.view.getSelectedRow(1).title;
	combo_box.show();
	picker_view.animate(slide_out);
	first_time_window.add(confirm_button);
	confirm_button.animate(slide_in_confirm);
	
}});

var cancel = new reunion.Cancel({click: function(){
	combo_box.show();
	picker_view.animate(slide_out);
}});
var spacer = new reunion.Spacer();
var toolbar = new reunion.ToolBarClass([cancel.view, spacer.view, done.view]);

picker_view.add(picker.view);
picker_view.add(toolbar.view);


/**
 * Set up animations.
 */

var slide_in =  Titanium.UI.createAnimation({bottom:0});
var slide_in_confirm =  Titanium.UI.createAnimation({bottom:54});
var slide_out =  Titanium.UI.createAnimation({bottom:-251});

/**
 * Set up events.
 */

combo_box.addEventListener('focus', function() 
{
	
});

/*
combo_box.addEventListener('focus', function() 
{
	alert('SHHHHHHHHH!');
});*/

drop_button.addEventListener('click',function() 
{
	picker_view.animate(slide_in);
	combo_box.blur();
	combo_box.hide();
	confirm_button.animate(slide_out);
});

/*

picker.addEventListener('change',function(e)
{	combo_box.value =  picker.getSelectedRow(0).title + " " + picker.getSelectedRow(1).title;
	
});
*/

confirm_button.addEventListener('click', function(){
	confirm_button.backgroundColor = '#7EA0C3';
	confirm_button.color = 'black';
	db.storeSchoolYear(picker.view.getSelectedRow(1).title, picker.view.getSelectedRow(0).title);
  	first_time_window.close({transition:Titanium.UI.iPhone.AnimationStyle.CURL_UP});
  	win.open();
  	tabGroup.open();	
});

if(firstTime == true){
  	first_time_window.add(picker_view);
  	first_time_window.add(combo_box);
  	first_time_window.open();
}
else{
	win.open();
  	tabGroup.open();	
}