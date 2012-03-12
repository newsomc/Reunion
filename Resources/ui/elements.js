var uiElements = ( function() {

	var screen = {};

	screen.ActivityIndicator = function() {
			
		this.view = Titanium.UI.createActivityIndicator({
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

	};

	screen.SettingsButton = function(options) {

		this.view = Ti.UI.createButton({
			title : "settings",
			image : "../images/settings-icon.png"
		});

		if(options && options.click) {
			this.view.addEventListener('click', options);
		}
	};

	screen.EmptyLabel = function(message) {
		
		this.message = message;
		
		this.view = Ti.UI.createLabel({
			top : 5,
			left : 20,
			right : 20,
			font : {
				fontSize : 15,
				fontWeight : 'bold'
			},
			color : '#4D576D',
			textAlign : 'center',
			shadowColor : '#FAFAFA',
			shadowOffset : {
				x : 0,
				y : 1
			}
		});
	};
		
	return screen;
}());
