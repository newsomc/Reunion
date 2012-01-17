var reunion = {};

reunion.PickerClass = function(toolbar){	
	
	this.toolbar = toolbar;
		
	this.picker = Titanium.UI.createPicker({
		top:43
	});

	this.picker.selectionIndicator=true;
	
	this.column_one = Ti.UI.createPickerColumn({
		opacity:0, 
		width:200
	});

	this.schools = [
		{title:'Columbia College',fontSize:14, custom_item:'b', selected:true},
		{title:'Columbia Engineering', fontSize:14, custom_item:'s'},
		{title:'Engineering MA/PhD', fontSize:14, custom_item:'f'},
		{title:'Columbia General Studies', fontSize:14, custom_item:'m'}
	];
	
	for (var i in this.schools){
		this.column_one.addRow(Ti.UI.createPickerRow({title: this.schools[i].title, fontSize: this.schools[i].fontSize, selected: this.schools[i].selected?true:false}));
	} 

	this.years = ['1929','1942', '1947', '1952', '1957', '1962', '1967', '1972', '1977', '1982', '1987', '1992', '1997', '2002', '2007'];
	this.column_two = Ti.UI.createPickerColumn({width:75});
	for (var i in this.years){
			this.column_two.addRow(Ti.UI.createPickerRow({title: this.years[i]}));
	}  
	
	this.picker.add([this.column_one,this.column_two]);

	
	this.getVals = function(){
		//this.test = {school: 'Columbia College', year: '1979'};
		this.message = 'hello';
		//Ti.API.info('hello');
		return this.message;
	}

	this.picker.add(this.getVals);
	return this.picker;

};




reunion.CancelButton = function(){
	
	this.cancel =  Titanium.UI.createButton({
		title:'Cancel',
		style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
	});
	
	return this.cancel;
}

reunion.Spacer = function(){
	this.spacer =  Titanium.UI.createButton({
		systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});
	
	return this.spacer;
}

reunion.DoneButton = function(){
	this.done =  Titanium.UI.createButton({
		title:'Done',
		style:Titanium.UI.iPhone.SystemButtonStyle.DONE
	});
	
	return this.done;
	
}

reunion.ToolBarClass = function(items){
	
	this.items = items;
	
	this.toolbar =  Titanium.UI.createToolbar({
		top:0,
		items:this.items
	});
}


/*
reunion.ToolBar = function (onClick) {
  this.view = Ti.UI.createView({backgroundColor:'red',height:50,width:50});
 
  //private instance variable
  var active = false;
 
  //public instance functions to update internal state, execute events
  this.setActive = function(_active) {
    active = _active;
    this.view.backgroundColor = (active) ? 'green' : 'red';
    onChange.call(instance);
  };
 
  this.isActive = function() {
    return active;
  };
 
  //set up behavior for component
  this.view.addEventListener('click', function() {
    this.setActive(!active);
  });
}
exports.ToolBar = ToolBar;
*/