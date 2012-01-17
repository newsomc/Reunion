// licensed MIT.
// copyright Daniel Tamas
// http://rborn.info

Titanium.UI.setBackgroundColor('#000');
Titanium.API.debug("STARTING!");

var win1 = Titanium.UI.createWindow({  
    backgroundColor:'#000'
});

var tr = Titanium.UI.create2DMatrix();
tr = tr.rotate(90);

var drop_button =  Titanium.UI.createButton({
		style:Titanium.UI.iPhone.SystemButton.DISCLOSURE,
		transform:tr
});



var my_combo = Titanium.UI.createTextField({
	hintText:"write your name or select one",
	height:40,
	width:300,
	top:20,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
	rightButton:drop_button,
	rightButtonMode:Titanium.UI.INPUT_BUTTONMODE_ALWAYS
});



var picker_view = Titanium.UI.createView({
	height:251,
	bottom:-251
});

var cancel =  Titanium.UI.createButton({
	title:'Cancel',
	style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
});

var done =  Titanium.UI.createButton({
	title:'Done',
	style:Titanium.UI.iPhone.SystemButtonStyle.DONE
});

var spacer =  Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});


var toolbar =  Titanium.UI.createToolbar({
	top:0,
	items:[cancel,spacer,done]
});

var picker = Titanium.UI.createPicker({
		top:43
});
picker.selectionIndicator=true;

var picker_data = [
	Titanium.UI.createPickerRow({title:'John'}),
	Titanium.UI.createPickerRow({title:'Alex'}),
	Titanium.UI.createPickerRow({title:'Marie'}),
	Titanium.UI.createPickerRow({title:'Eva'}),
	Titanium.UI.createPickerRow({title:'James'})
];

picker.add(picker_data);

picker_view.add(toolbar);
picker_view.add(picker);


var slide_in =  Titanium.UI.createAnimation({bottom:0});
var slide_out =  Titanium.UI.createAnimation({bottom:-251});

my_combo.addEventListener('focus', function() {
	picker_view.animate(slide_out);
});

drop_button.addEventListener('click',function() {
	Titanium.API.debug("caught event!");
	picker_view.animate(slide_in);
	my_combo.blur();
});

cancel.addEventListener('click',function() {
	picker_view.animate(slide_out);
});

done.addEventListener('click',function() {
	my_combo.value =  picker.getSelectedRow(0).title;
	picker_view.animate(slide_out);
});




win1.add(picker_view);
win1.add(my_combo);

win1.open();
