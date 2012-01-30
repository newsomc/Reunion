var win = Titanium.UI.currentWindow;
win.setTitle('Attendees');
win.barColor = '#477AAB';
win.backgroundColor = '#477AAB';
Ti.include(Titanium.Filesystem.resourcesDirectory + 'Model/db.js');

var base_url = 'https://chameleon.college.columbia.edu/reunion_base/service/attendees/';
var info = db.getUserPrefs();

Ti.API.info(base_url + info.school_abbr)

var attendees = [];
var xhr = Ti.Network.createHTTPClient();
xhr.timeout = 1000000;
xhr.open("GET", base_url + info.school_abbr);

xhr.onload = function() {
	var s = JSON.parse(this.responseText);
	//Titanium.API.debug(JSON.stringify(s));
	for(keys in s) {
		if(keys == '') {
			keys = 'Guests';
		}
		var head = Ti.UI.createTableViewSection({
			headerTitle : keys
		});
		for(var i = 0; i < s[keys].length; i++) {
			rows = Ti.UI.createTableViewRow({
				title : s[keys][i].firstname + " " + s[keys][i].lastname,
			});
			attendees.push(rows);
		}
		attendees.push(head);
	}
	Titanium.API.info(this.responseText);
	tableview.setData(attendees);
	activity_indicator.hide();
};

xhr.send();

xhr.onerror = function(e) {
	Ti.API.info(e);
};
//set up search bar
var search = Titanium.UI.createSearchBar({
	showCancel : false,
	hintText : 'search'
});

search.addEventListener('change', function(e) {
	e.value
});
search.addEventListener('return', function(e) {
	search.blur();
});
search.addEventListener('cancel', function(e) {
	search.blur();
});
// create table view
var tableview = Titanium.UI.createTableView({
	data : attendees,
	search : search,
	style : Titanium.UI.iPhone.TableViewStyle.GROUPED,
	backgroundImage : '../images/background.png',
	top : 39
});

var buttons = [{
	title : 'All',
	width : 150,
	enabled : true
}, {
	title : 'My Class',
	width : 150,
	enabled : false
}];

var button_bar = Titanium.UI.createTabbedBar({
	labels : buttons,
	top : 5,
	style : Titanium.UI.iPhone.SystemButtonStyle.BAR,
	height : 30,
	index : 0,
	backgroundColor : '#477AAB'
});

win.add(button_bar);

//acitivity indicator
var activity_indicator = Titanium.UI.createActivityIndicator({
	height : 50,
	width : 150,
	style : Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN,
	font : {
		fontFamily : 'Helvetica Neue',
		fontSize : 15,
		fontWeight : 'bold'
	},
	backgroundColor : '#000',
	opacity : 0.5,
	borderRadius : 5,
	color : 'white',
	message : 'Loading...',
});
activity_indicator.show();
tableview.add(activity_indicator);

// create table view event listener
/*tableview.addEventListener('click', function(e)
 {
 var index = e.index;
 var section = e.section;
 var row = e.row;
 var rowdata = e.rowData;
 Titanium.UI.createAlertDialog({title:'Table View',message:'row ' + row + ' index ' + index + ' section ' + section  + ' row data ' + rowdata}).show();
 });*/

win.add(tableview);
/*
 button_bar.addEventListener('click', function() {
 index = e.index;
 var slide_out = Titanium.UI.createAnimation({
 bottom : -251
 });

 if(index == 0) {
 //tableview.show();
 }
 if(index == 1) {
 //tableview.animate(slide_out);
 alert('2');
 }
 });*/

button_bar.addEventListener('click', function(e) {
	var index = e.index;
	var slide_out = Titanium.UI.createAnimation({
		bottom : -251
	});

	if(index == 0) {
		tableview.show();
		//alert('first');
	}
	if(index == 1) {
		tableview.hide();
	}
});
