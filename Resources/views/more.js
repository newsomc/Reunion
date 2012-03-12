var more = ( function() {
	screen = {};
	
	//screen.setUp('More');
	
	screen.build = function() {

		screen.win = Titanium.UI.currentWindow;
		
		screen.setUp('More');
		
		screen.win.addEventListener('focus', function() {
		  var data = [
			{title:'Website', hasChild:true, url:'http://www.college.columbia.edu/alumni', header:'Columbia College'},
			{title:'Facebook', hasChild:true, url:'http://www.facebook.com/ColumbiaCollege1754'},
			{title:'Twitter', hasChild:true, url:'http://twitter.com/#!/Columbia_CCAA'},			
			
			{title:'Website', hasChild:true, url:'http://www.gs.columbia.edu', header: 'General Studies'},
			{title:'Facebook', hasChild:true, url:'http://www.facebook.com/ColumbiaGSAlumni'},
			
			{title:'CEYA Facebook', hasChild:true, url:'https://www.facebook.com/myceya', header:'Columbia Engineering'},
			{title:'SEAS Facebook', hasChild:true, url:'https://www.facebook.com/pages/Columbia-Engineering-School/178274868724'},
			{title:'CEYA Twitter', hasChild:true, url:'http://twitter.com/#!/myceya'},
			{title:'SEAS Youtube', hasChild:true, url:'http://www.youtube.com/user/ColumbiaSEAS'},
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
	
		  screen.win.tab.open(link_win);	
  	  });

  	  screen.win.add(tableview);

	  });
	};
	
	screen.setUp = function(title){
		screen.win.setTitle(title);
		screen.win.barColor = '#4a85c8';
		screen.win.backgroundColor = '#4a85c8';
	};

	return screen;
}());

more.build();
