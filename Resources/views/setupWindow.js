Ti.include(Titanium.Filesystem.resourcesDirectory + 'Model/db.js');

function setUpWindow(title){
	
	var info = db.getUserPrefs();
	
	if(info.school_abbr == "CC") {
		win.setTitle(title);
		win.barColor = '#4a85c8';
		win.backgroundImage = '../images/background-notile.png';
		//button_bar.backgroundColor = '#4a85c8';
	}
	
	if(info.school_abbr == "SEAS") {
		win.setTitle(title);
		win.barColor = '#557aa0';
		win.backgroundImage = '../images/background-notile.png';
		//button_bar.backgroundColor = '#557aa0';
	}

	if(info.school_abbr == "GS") {
		win.setTitle(title);
		win.barColor = '#5d82dd';
		win.backgroundImage = '../images/background-notile.png';
		//button_bar.backgroundColor = '#5d82dd';
	}
}
