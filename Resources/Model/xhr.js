function getReunionData(url_params, _success, _error) {
 
   var xhr = Ti.Network.createHTTPClient(); // returns an instance of HTTPClient
 
   xhr.onload = function(e) {
       if(typeof _success == "function"){
          return _success(this.responseText);
       } 
   };
 
   xhr.onerror = function(e) {
       //Titanium.API.log('INFO', e.message);
       if (_error) {
          _error(e);
       } 
   };
 
   xhr.open('GET','https://chameleon.college.columbia.edu/reunion_base/service' + url_params, true);
   xhr.send(); 
}

/**
 * getReunionData('/schedule/CC/cc2007', function(_respData){
    var data = JSON.parse(_respData);  
    var test = JSON.stringify(data);
	Ti.API.info(test);
});
 */