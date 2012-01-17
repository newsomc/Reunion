var win = Titanium.UI.currentWindow;
Ti.include(Titanium.Filesystem.resourcesDirectory + 'Model/db.js');

// build custom tableView data/layout
var array = [];
var valueRow = Titanium.UI.createTableViewRow({height:46, className:'valueRow'}); 
var valueLabel = Ti.UI.createLabel({color:'#000000', text:"School and Year", font:{fontSize:12, fontWeight:'bold'}, top:8, left:12, height:24, width:170});
var valueData = Ti.UI.createLabel({color:'#3D4460', text:"", font:{fontSize:12, fontWeight:'normal'}, top:11, left:102, height:20, width:180, textAlign:'right'});	

valueRow.add(valueLabel);
valueRow.add(valueData);
array.push(valueRow);

// view initialisation
var tableView = Titanium.UI.createTableView({data:array, style:Titanium.UI.iPhone.TableViewStyle.GROUPED});
var pickerView = Titanium.UI.createView({height:291,bottom:-291});
var datePickerView = Titanium.UI.createView({height:248,bottom:-248});

// value picker initialisation
var picker = Titanium.UI.createPicker({top:43});
picker.selectionIndicator=true;
var column1 = Ti.UI.createPickerColumn({opacity:0, width:200});
column1.addRow(Ti.UI.createPickerRow({title:'Columbia College',fontSize:14, custom_item:'b', selected:true}));
column1.addRow(Ti.UI.createPickerRow({title:'Columbia Engineering', fontSize:14, custom_item:'s'}));
column1.addRow(Ti.UI.createPickerRow({title:'Engineering MS/PhD', fontSize:14, custom_item:'s'}));
column1.addRow(Ti.UI.createPickerRow({title:'Columbia General Studies', fontSize:14, custom_item:'m'}));
column1.addRow(Ti.UI.createPickerRow({title:'Barnard', fontSize:14, custom_item:'g'}));

var column2 = Ti.UI.createPickerColumn({width:75});

var years = ['1942', '1947', '1952', '1957', '1962', '1967', '1972', '1977', '1982', '1987', '1992', '1997', '2002', '2007'];

for (var i in years){
	column2.addRow(Ti.UI.createPickerRow({title: years[i]}));
}  

var settings_done = Ti.UI.createButton({
    systemButton:Titanium.UI.iPhone.SystemButton.DONE
});

win.setRightNavButton(settings_done);

settings_done.addEventListener('click', function(){
	win.close();
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

picker.add([column1,column2]);
pickerView.add(toolbar);
pickerView.add(picker);

// date picker initialisation
var datePicker = Titanium.UI.createPicker({top:0, type:Titanium.UI.PICKER_TYPE_DATE});
datePicker.selectionIndicator=true;
datePickerView.add(datePicker);

// animations
var slideIn =  Titanium.UI.createAnimation({bottom:-43});
var slideOut =  Titanium.UI.createAnimation({bottom:-251});

// event functions
tableView.addEventListener('click', function(eventObject){
	if (eventObject.rowData.className == "valueRow")
	{
		//titleText.blur();
		//datePickerView.animate(slideOut);	
		pickerView.animate(slideIn);		
	}
});


valueData.text = db.getYearSchoolAsText();

picker.addEventListener('change',function(e)
{
	valueData.text = picker.getSelectedRow(0).title + " " + picker.getSelectedRow(1).title;
	tableView.setData(array);
});

done.addEventListener('click',function() {
	db.updateYearSchool(picker.getSelectedRow(0).title, picker.getSelectedRow(1).title);
	pickerView.animate(slideOut);
	toolbar.animate(slideOut);
});


// build display
win.add(tableView);
win.add(pickerView);
win.add(datePickerView);