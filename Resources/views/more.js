var win = Titanium.UI.currentWindow;
win.barColor = '#477AAB';
win.setTitle('Social');
// create table view data object
var data = [
	{title:'YouTube', hasChild:true, url:'http://www.youtube.com/user/columbiauniversity'},
	{title:'Facebook', hasChild:true, url:'http://www.facebook.com/ColumbiaAlumniAssoc'},
	{title:'Twitter', hasChild:true, url:'http://twitter.com/#!/Columbia'},

];

// add iphone specific tests
if (Titanium.Platform.name == 'iPhone OS')
{
	// can't test youtube in simulator
	if (Titanium.Platform.model != 'Simulator')
	{
		//data.push({title:'Youtube Video', auto:true, hasChild:true, url:'youtube.html'});
	}
}

// create table view
var tableview = Titanium.UI.createTableView({
	data:data
});

// create table view event listener
tableview.addEventListener('click', function(e)
{
	var rowdata = e.rowData;
	var w = Ti.UI.createWindow();
	w.orientationModes = [
		Titanium.UI.PORTRAIT,
		Titanium.UI.LANDSCAPE_LEFT,
		Titanium.UI.LANDSCAPE_RIGHT
	];

	var webview = null;
	if (rowdata.auto === true)
	{
		webview = Ti.UI.createWebView({height:'auto',width:'auto'});
	}
	else
	{
		webview = Ti.UI.createWebView();
	}

	if (e.index == 8)
	{
		w.add(webview);
		win.tab.open(w);
		var xhr = Titanium.Network.createHTTPClient();

		xhr.onload = function()
		{
			var f = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,'test.html');
			f.write(this.responseText);
			webview.url = f.nativePath;
		};

		// open the client
		xhr.open('GET','http://www.google.com');
		
		// google will send back WAP if you make XHR request to it and he doesn't think it's really an HTML browser
		// we're going to spoof him to think we're Safari on iPhone
		xhr.setRequestHeader('User-Agent','Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A537a Safari/419.3');

		// send the data
		xhr.send();   
	}
	else
	{
		//
		// handle other cases
		//
		if (rowdata.url)
		{
			webview.url = rowdata.url;
		}
		else
		{
			webview.html = rowdata.innerHTML;
		}
		if (rowdata.scale)
		{
			// override the default pinch/zoom behavior of local (or remote) webpages
			// and either allow pinch/zoom (set to true) or not (set to false)
			webview.scalesPageToFit = true;
		}
		
		if (rowdata.username)
		{
			webview.setBasicAuthentication(rowdata.username, rowdata.password);
		}
		
		// test out applicationDataDir file usage in web view
		var f1 = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'images', 'apple_logo.jpg');
		var f2 = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,'apple_logo.jpg');
		f2.write(f1);
		
		webview.addEventListener('load',function(e)
		{
			Ti.API.debug("webview loaded: "+e.url);
			if (rowdata.evaljs)
			{
				alert("JS result was: "+webview.evalJS("window.my_global_variable")+". should be 10");
			}
			if (rowdata.evalhtml)
			{
				alert("HTML is: "+webview.html);
			}
			Ti.App.fireEvent('image', {path:f2.nativePath});
		});
		if (rowdata.bgcolor)
		{
			webview.backgroundColor = rowdata.bgcolor;
		}
		if (rowdata.border)
		{
			webview.borderRadius=15;
			webview.borderWidth=5;
			webview.borderColor = 'red';
		}
		
		var toolbar = null;
		// create toolbar for local webiew
	/*	if (e.index==9)
		{
			if (Titanium.Platform.name == 'iPhone OS') {
				// test hiding/showing toolbar with web view
				var button = Titanium.UI.createButton({
					title:'Click above to hide me'
				});
				w.setToolbar([button]);
			} else {
				toolbar = Titanium.UI.createView({backgroundColor: '#000',opacity:0.8,bottom:10,width:300,height:50,zIndex:1000});
				toolbar.add(Ti.UI.createLabel({text: 'Click above to hide me'}));
				w.add(toolbar);
			}
		}*/
		
		if (rowdata.controls)
		{
			// test web controls
			var bb2 = Titanium.UI.createButtonBar({
				labels:['Back', 'Reload', 'Forward'],
				backgroundColor:'#003'
			});
			var flexSpace = Titanium.UI.createButton({
				systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
			});
			w.setToolbar([flexSpace,bb2,flexSpace]);
			webview.addEventListener('load',function(e)
			{
				Ti.API.debug("url = "+webview.url);
				Ti.API.debug("event url = "+e.url);
			});
			bb2.addEventListener('click',function(ce)
			{
				if (ce.index == 0)
				{
					webview.goBack();
				}
				else if (ce.index == 1)
				{
					webview.reload();
				}
				else
				{
					webview.goForward();
				}
			});
		}
		
		if (rowdata.partial)
		{
			webview.top = 100;
			webview.bottom = 0;
		}
		
		w.add(webview);
		

		function hideToolbar(e)
		{
			Ti.API.info('received hidetoolbar event, foo = ' + e.foo);
			if (Titanium.Platform.name == 'iPhone OS') {
				w.setToolbar(null,{animated:true});
			} else {
				if (toolbar != null) {
					w.remove(toolbar);
				}
			}
		}
		// hide toolbar for local web view
		Ti.App.addEventListener('webview_hidetoolbar', hideToolbar);
		
		w.addEventListener('close',function(e)
		{
			Ti.API.info("window was closed");
			
			// remove our global app event listener from this specific
			// window instance when the window is closed
			Ti.App.removeEventListener('webview_hidetoolbar',hideToolbar);
		});
		win.tab.open(w);		
	}

});

// add table view to the window
Titanium.UI.currentWindow.add(tableview);
