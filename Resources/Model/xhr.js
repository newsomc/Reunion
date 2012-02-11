/**
 * @author Clint Newsom
 * 02-08-2012
 * cn2284@columbia.edu
 */

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
          alert('There was an error with this request. Please try again later.');
       } 
   };
 
   xhr.setTimeout(15000); 
 
   xhr.open('GET','https://ccit.college.columbia.edu/reunion-base/service' + url_params, true);
   //xhr.open('GET','https://chameleon.college.columbia.edu/reunion_base/service' + url_params, true);
   Ti.API.info('https://ccit.college.columbia.edu/reunion-base/service' + url_params);
   xhr.send(); 
}
