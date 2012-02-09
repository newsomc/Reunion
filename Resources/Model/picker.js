var reunion = {};

reunion.PickerClass = function(options){	
	
	this.view = Titanium.UI.createPicker({
		top:43
	});

	this.view.selectionIndicator=true;
	
	this.column_one = Ti.UI.createPickerColumn({
		opacity:0, 
		width:200
	});

	this.schools = [
		{title:'Columbia College',fontSize:14, school_abbr:'CC', cohort_prefix:'cc'},
		{title:'Columbia Engineering', fontSize:14, school_abbr:'SEAS',cohort_prefix:'seas'},
		{title:'Engineering MS/PhD', fontSize:14, school_abbr:'SEAS', cohort_prefix: 'gradEn'},
		{title:'Columbia General Studies', fontSize:14, school_abbr:'GS', cohort_prefix: 'gs'}
	];
	
	for (var i in this.schools){
		this.column_one.addRow(Ti.UI.createPickerRow({title: this.schools[i].title, 
													  fontSize: this.schools[i].fontSize,
													  school_abbr: this.schools[i].school_abbr,
													  cohort_prefix: this.schools[i].cohort_prefix, 
													  selected: this.schools[i].selected?true:false}));
	} 

	//These years should be pulled from web service in the future. 
	this.years = ['1942', '1947', '1952', '1957', '1962', '1967', '1972', '1977', '1982', '1987', '1992', '1997', '2002', '2007'];
	
	this.column_two = Ti.UI.createPickerColumn({width:75});
	
	for (var i in this.years){
			this.column_two.addRow(Ti.UI.createPickerRow({title: this.years[i]}));
	}  
	
	this.view.add([this.column_one,this.column_two]);

	this.view.add(this.getVals);
		
	if(options && options.change){
		this.view.addEventListener('change', options.change);	
	}
	
};

reunion.Cancel = function(options){
	
	this.view =  Titanium.UI.createButton({
		title:'Cancel',
		style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
	});
	
	if(options && options.click){
		this.view.addEventListener('click', options.click);		
	}	
}

reunion.Spacer = function(){
	this.view =  Titanium.UI.createButton({
		systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});
}

reunion.Done = function(options){
	
	this.view =  Titanium.UI.createButton({
		title:'Done',
		style:Titanium.UI.iPhone.SystemButtonStyle.DONE
	});	
	
	if(options && options.click){
		this.view.addEventListener('click', options.click);
	}
}

reunion.ToolBarClass = function(items){
	
	this.items = items;
	
	this.view =  Titanium.UI.iOS.createToolbar({
		top:0,
		items:this.items
	});
	
	
}