var win = Titanium.UI.currentWindow;
Ti.include(Titanium.Filesystem.resourcesDirectory + 'views/setupWindow.js');
setUpWindow('More');

// create table view data object
var data = [
	{title:'Columbia College Alumni', hasChild:true, url:'http://www.college.columbia.edu/alumni'},
	{title:'Facebook', hasChild:true, url:'http://www.facebook.com/ColumbiaCollege1754'},
	{title:'CCAA Twitter', hasChild:true, url:'http://twitter.com/#!/Columbia_CCAA'},

];

// create table view
var tableview = Titanium.UI.createTableView({
	
	data:data

});

tableview.addEventListener('click', function(e) {
	
	var rowdata = e.rowData;
	
	var link_win = Ti.UI.createWindow({
		title: rowdata.title,
		barColor: '#4a85c8'
	});
	
	var webview = Ti.UI.createWebView();
	
	if(rowdata.url) {
		webview.url = rowdata.url;
	}
	
	link_win.add(webview);
	
	win.tab.open(link_win);	
});

win.add(tableview);
