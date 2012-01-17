Titanium.UI.setBackgroundColor('#000');
Ti.include(Titanium.Filesystem.resourcesDirectory + 'Model/db.js');

var firstTime = db.isFirstTime();

var tabData = [
    {title:'Info',icon:'images/KS_nav_info.png',url:'views/info.js'},
	{title:'Schedule',icon:'images/KS_nav_schedule.png',url:'views/schedule.js'},
    {title:'Attendees',icon:'images/KS_nav_attendees.png',url:'views/attendees.js'},
    {title:'Social',icon:'images/KS_nav_social.png',url:'views/facebook_photo.js'},
    {title:'News',icon:'images/KS_nav_news.png',url:'views/news.js'}
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
var picker_view = Titanium.UI.createView({
	height:251,
	bottom:-251
});
	
var first_time_window = Titanium.UI.createWindow({  
    backgroundImage: 'images/background.png'
});

var logo = Titanium.UI.createImageView({
	image:'images/cu-crown-for-first-screen.png',
	width: 102,
	height:88,
	top:50, 
	right: 0,
	left: 0
});

var alumni_label = Titanium.UI.createLabel({
	text:'Columbia Alumni Reunion Weekend',
	height: 'auto',
	width:'auto',
	shadowColor:'#FFF',
	shadowOffset:{x:0,y:1},
	color:'#49596A',
	font:{fontSize:24, fontFamily:'Helvetica Neue', fontWeight: 'bold'},
	top:150,
	textAlign:'center'
});

first_time_window.add(logo, alumni_label);

var tr = Titanium.UI.create2DMatrix();
tr = tr.rotate(90);

var drop_button =  Titanium.UI.createButton({
	style:Titanium.UI.iPhone.SystemButton.DISCLOSURE,
	transform:tr
});

var combo_box = Titanium.UI.createTextField({
	hintText:"select your school and year!",
	height:40,
	width:300,
	top:260,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
	rightButton:drop_button,
	rightButtonMode:Titanium.UI.INPUT_BUTTONMODE_ALWAYS
});

var confirm_button = Titanium.UI.createButton({
	title: 'Confirm',
	height:40,
	width:300,
	top:365
});

var cancel =  Titanium.UI.createButton({
	title:'Cancel',
	style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
});
		
var done =  Titanium.UI.createButton({
	title:'Done',
	style:Titanium.UI.iPhone.SystemButtonStyle.DONE
});

var spacer =  Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});

var toolbar =  Titanium.UI.createToolbar({
	top:0,
	items:[cancel,spacer,done]
});

var picker = Titanium.UI.createPicker({
	top:43
});

picker.selectionIndicator=true;

var years = ['1942', '1947', '1952', '1957', '1962', '1967', '1972', '1977', '1982', '1987', '1992', '1997', '2002', '2007'];

var column1 = Ti.UI.createPickerColumn({opacity:0, width:200});

var schools = [
		{title:'Columbia College',fontSize:14, custom_item:'b', selected:true},
		{title:'Columbia Engineering', fontSize:14, custom_item:'s'},
		{title:'Engineering MS/PhD', fontSize:14, custom_item:'f'},
		{title:'Columbia General Studies', fontSize:14, custom_item:'m'}
	];
	
for (var i in schools){
	column1.addRow(Ti.UI.createPickerRow({title: schools[i].title, fontSize: schools[i].fontSize, selected: schools[i].selected?true:false}));
} 

var column2 = Ti.UI.createPickerColumn({width:75});

for (var i in years){
	column2.addRow(Ti.UI.createPickerRow({title: years[i]}));
}  

picker.add([column1,column2]);

/**
 * Add the objects we've built up to the view.
 */
picker_view.add(picker);
picker_view.add(toolbar);

/**
 * Set up animations.
 */

var slide_in =  Titanium.UI.createAnimation({bottom:0});
var tabs_slide_in =  Titanium.UI.createAnimation({bottom:100, duration: 700});
var slide_out =  Titanium.UI.createAnimation({bottom:-251});

/**
 * Set up events.
 */

picker.addEventListener('change',function(e)
{	
	var vals = picker.getVals();
	Ti.API.info(vals);
});

combo_box.addEventListener('focus', function() 
{
	picker_view.animate(slide_out);
});

drop_button.addEventListener('click',function() 
{
	picker_view.animate(slide_in);
	combo_box.blur();
	combo_box.hide();
});

cancel.addEventListener('click',function() 
{
	picker_view.animate(slide_out);
});

done.addEventListener('click',function() 
{
	combo_box.value =  picker.getSelectedRow(0).title + " " + picker.getSelectedRow(1).title;
	picker_view.animate(slide_out);
	first_time_window.add(confirm_button);
	combo_box.show();
});

picker.addEventListener('change',function(e)
{	combo_box.value =  picker.getSelectedRow(0).title + " " + picker.getSelectedRow(1).title;
	
});

confirm_button.addEventListener('click', function(){
	db.storeSchoolYear(picker.getSelectedRow(1).title, picker.getSelectedRow(0).title);
  	first_time_window.close({transition:Titanium.UI.iPhone.AnimationStyle.CURL_UP});
  	win.open();
  	tabGroup.open();	
});

if(firstTime == true){
	//first_time_window.open();
	//first_time_window.add(myPicker);
  	first_time_window.add(picker_view);
  	first_time_window.add(combo_box);
  	first_time_window.open();
}
else{
	win.open();
  	tabGroup.open();	
}