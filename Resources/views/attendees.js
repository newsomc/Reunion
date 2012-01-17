xvar win = Titanium.UI.currentWindow;

//win.setTitle('Attendees');
/*
if(Titanium.Network.networkType == Titanium.Network.NETWORK_NONE){ 
	var alertDialog = Titanium.UI.createAlertDialog({
              title: 'Warning!',
              message: 'Your device is not online.',
              buttonNames: ['OK']
            });
            alertDialog.show();	
}
*/
//add checks for network connectivity

/***
 * URI request examples: 
 *  -- without year: https://chameleon.college.columbia.edu/reunion_base/service/attendees/CC
 *  -- with year: https://chameleon.college.columbia.edu/reunion_base/service/attendees/CC
 */

var base_url =  'https://chameleon.college.columbia.edu/reunion_base/service/attendees/';

//get this from database.
var reunion_class = 'CC';
var reunion_year = null;


Ti.API.info(base_url + reunion_class)
//we need to add an acess key.
var access_key = null;

var data = [];
var xhr = Ti.Network.createHTTPClient();
xhr.timeout = 1000000;
xhr.open("GET", base_url + reunion_class);

xhr.onload = function(){
	var s = JSON.parse(this.responseText);
  	//Titanium.API.debug(JSON.stringify(s));
  	for(keys in s){
  		if(keys == ''){keys ='Guests';}
		head = Ti.UI.createTableViewSection({headerTitle: keys});
		for(var i = 0; i < s[keys].length; i++){
		  rows = Ti.UI.createTableViewRow({
			  title: s[keys][i].firstname + " " + s[keys][i].lastname,
		  });
		  data.push(rows);
		}
		data.push(head);
	}
	Titanium.API.info(this.responseText);
	tableview.setData(data);
	actInd.hide();
};

xhr.send();

xhr.onerror = function(e){
	Ti.API.info(e);
};

//set up search bar
var search = Titanium.UI.createSearchBar({
	showCancel:false,
	hintText:'search'
});

search.addEventListener('change', function(e)
{
	e.value; // search string as user types
});
search.addEventListener('return', function(e)
{
	search.blur();
});
search.addEventListener('cancel', function(e)
{
	search.blur();
});

// create table view
var tableview = Titanium.UI.createTableView({
	data:data,
	search:search,
	style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
	backgroundImage: '../images/background.png'
});

var buttons = [
    {title:'My Class', width:150, enabled:true},
    {title:'All', width:150, enabled:false}
];

var button_bar = Titanium.UI.createTabbedBar({
	labels:buttons,
	top:53,
	style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
	height:30,
	index:0
});

tableview.add(button_bar);

//acitivity indicator
var actInd = Titanium.UI.createActivityIndicator({
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
actInd.show();
tableview.add(actInd);

// create table view event listener
tableview.addEventListener('click', function(e)
{
	// event data
	var index = e.index;
	var section = e.section;
	var row = e.row;
	var rowdata = e.rowData;
	Titanium.UI.createAlertDialog({title:'Table View',message:'row ' + row + ' index ' + index + ' section ' + section  + ' row data ' + rowdata}).show();
});

button_bar.addEventListener('click', function(e)
{
	alert(index);
	    
});

/*
all_classes.addEventListener('click', function(e)
{
	
	alert('you clicked all classes');
    
});
*/

Titanium.UI.currentWindow.add(tableview);
