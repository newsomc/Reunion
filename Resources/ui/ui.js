var init = ( function() {
	
	var elements = {};
	
	elements.buildTabs = function() {
		var tabData = [{
			title : 'Info',
			icon : 'images/KS_nav_info.png',
			url : 'views/info.js'
		}, {
			title : 'Schedule',
			icon : 'images/KS_nav_schedule.png',
			url : 'views/schedule.js'
		}, {
			title : 'Attendees',
			icon : 'images/KS_nav_attendees.png',
			url : 'views/attendees.js'
		}, {
			title : 'More',
			icon : Titanium.UI.iPhone.SystemIcon.MORE,
			url : 'views/more.js'
		}];

		var tabGroup = Titanium.UI.createTabGroup();

		for(var i in tabData) {
			//Ti.API.info(tabData[i].url);
			var win = Titanium.UI.createWindow({
				url : tabData[i].url,
			});

			tabGroup.addTab(Titanium.UI.createTab({
				title : tabData[i].title,
				icon : tabData[i].icon,
				window : win
			}));

			win.add(Titanium.UI.createLabel({
				text : tabData[i].title
			}));
		}
		tabGroup.open();
		//tabGroup.setActiveTab(0);
		win.open();
		
	}
	
	elements.isFirstTimeToLoad = function(){
		var firstTime = db.isFirstTime();
		
		var first_time_window = Titanium.UI.createWindow({
			//backgroundImage : 'images/Default.png'
		});

		var tr = Titanium.UI.create2DMatrix();
		tr = tr.rotate(90);

		var drop_button = Titanium.UI.createButton({
			style : Titanium.UI.iPhone.SystemButton.DISCLOSURE,
			transform : tr,
			enabled : true
		});

		var combo_box = Titanium.UI.createTextField({
			hintText : "Select your school and year!",
			height : 40,
			width : 300,
			top : 260,
			borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
			rightButton : drop_button,
			rightButtonMode : Titanium.UI.INPUT_BUTTONMODE_ALWAYS
		});

		var confirm_button = Titanium.UI.createButton({
			title : 'Confirm',
			color : 'white',
			height : 40,
			width : 300,
			top : 365,
			borderWidth : 3,
			borderRadius : 5,
			backgroundImage : 'none',
			backgroundColor : '#477AAB',
			font : {
				'font-style' : 'bold'
			}
		});

		var picker_view = Titanium.UI.createView({
			height : 251,
			bottom : -251
		});

		// Wrap Appcelerator objects + set up optional events.
		var picker = new reunionPicker.PickerClass();

		var done = new reunionPicker.Done({
			click : function() {
				combo_box.value = picker.view.getSelectedRow(0).title + " " + picker.view.getSelectedRow(1).title;
				combo_box.show();
				picker_view.animate(slide_out);
				first_time_window.add(confirm_button);
				confirm_button.animate(slide_in_confirm);
			}
		});

		var cancel = new reunionPicker.Cancel({
			click : function() {
				combo_box.show();
				picker_view.animate(slide_out);
			}
		});

		var spacer = new reunionPicker.Spacer();
		var toolbar = new reunionPicker.ToolBarClass([cancel.view, spacer.view, done.view]);

		//Add wrapped objects to current view.
		picker_view.add(picker.view);
		picker_view.add(toolbar.view);

		//Set up animations.
		var slide_in = Titanium.UI.createAnimation({
			bottom : 0
		});
		var slide_in_confirm = Titanium.UI.createAnimation({
			bottom : 54
		});
		var slide_out = Titanium.UI.createAnimation({
			bottom : -251
		});

		//Set up events.
		combo_box.addEventListener('focus', function() {
			combo_box.blur();
		});

		drop_button.addEventListener('click', function() {
			picker_view.animate(slide_in);
			combo_box.blur();
			combo_box.hide();
			confirm_button.animate(slide_out);
		});

		confirm_button.addEventListener('click', function() {

			confirm_button.backgroundColor = '#7EA0C3';
			confirm_button.color = 'black';
			db.storeSchoolCohortYear(picker.view.getSelectedRow(1).title, 
									 picker.view.getSelectedRow(0).title, 
									 picker.view.getSelectedRow(0).school_abbr, 
									 picker.view.getSelectedRow(0).cohort_prefix);

			first_time_window.close({
				transition : Titanium.UI.iPhone.AnimationStyle.CURL_UP
			});
			elements.buildTabs();
		});

		if(firstTime == true) {
			first_time_window.add(picker_view);
			first_time_window.add(combo_box);
			first_time_window.open();
		} else {
			this.buildTabs();
		}		
	}

	return elements;
}());
