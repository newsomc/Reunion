function ToggleBox(onChange) {
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
exports.ToggleBox = ToggleBox;