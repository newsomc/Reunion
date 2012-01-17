var ui = (function(){
	
	var api = {};
	
	var win = Titanium.UI.currentWindow;
	
	api.buildReloadButton = function(){
		var reload_button =  Titanium.UI.createButton({
			systemButton:Titanium.UI.iPhone.SystemButton.REFRESH
		});
 
		win.setLeftNavButton(reload_button);

		reload_button.addEventListener('click', function(e)
		{
			alert('cool');
		});
	
	}

	api.buildSettingsButton = function(){
		
		var settings_button = Ti.UI.createButton({
			style : Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
			title: "settings",
 			image: "../images/settings-icon.png"
		});
 
		win.setRightNavButton(settings_button);
	
		settings_button.addEventListener('click', function(e)
		{
			alert('cool 2');
		});		
	}

	api.buildButtonBar = function(buttons){	
		var button_bar = Titanium.UI.createTabbedBar({
			labels:buttons,
			top:10,
			style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
			height:20,
			index:0
		});
		win.add(button_bar);
		
		button_bar.addEventListener('click',function(e)
		{	
			if(index=1){
				alert('hi blow');
			}
			if(index=0){
				alert('hi joe');
			}
		});
		
		
	}
	
	api.buildPicker = function(){

		var picker = Titanium.UI.createPicker({
			top:43
		});

		picker.selectionIndicator=true;

		//could be grabbed from database. 
		var years = ['1929','1942', '1947', '1952', '1957', '1962', '1967', '1972', '1977', '1982', '1987', '1992', '1997', '2002', '2007'];

		var column1 = Ti.UI.createPickerColumn({opacity:0, width:200});

		column1.addRow(Ti.UI.createPickerRow({title:'Columbia College',fontSize:14, custom_item:'b', selected:true}));
		column1.addRow(Ti.UI.createPickerRow({title:'Columbia Engineering', fontSize:14, custom_item:'s'}));
		column1.addRow(Ti.UI.createPickerRow({title:'Engineering MA/PhD', fontSize:14, custom_item:'f'}));
		column1.addRow(Ti.UI.createPickerRow({title:'Columbia General Studies', fontSize:14, custom_item:'m'}));
		column1.addRow(Ti.UI.createPickerRow({title:'Barnard', fontSize:14, custom_item:'g'}));

		var column2 = Ti.UI.createPickerColumn({width:75});

		for (var i in years){
			column2.addRow(Ti.UI.createPickerRow({title: years[i]}));
		}  

		picker.add([column1,column2]);
		
		
		picker.addEventListener('change',function(e)
		{	my_combo.value =  picker.getSelectedRow(0).title + " " + picker.getSelectedRow(1).title;
	
		});
		
		return picker;
		
	}
	
	api.buildToolBar = function(){
		
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
		
		var slide_out =  Titanium.UI.createAnimation({bottom:-251});

		cancel.addEventListener('click',function(){
		    var s = true;
		    Ti.App.fireEvent('cancel_picker.received', s);
		});
		
		done.addEventListener('click',function(){
			var info = {};
			info.school = 'Columbia College';
			info.year = '1947';
			Ti.App.fireEvent('done_picker.received', info);
		});
		
		return toolbar;
		
	}
	return api;
}());