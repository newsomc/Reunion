var persist = ( function() {

	var api = {};

	var prefs = db.getUserPrefs();
	var cohortAbbr = prefs.cohort_prefix + prefs.year;
	var registration = db.getRegCode();

	api.saveAttendeesByClass = function() {
		getReunionData('/attendees/' + prefs.school_abbr, function(_respData) {
			var data = JSON.parse(_respData);
			var json = JSON.stringify(data);
			Titanium.App.Properties.setString("attendees_class", json);
		});
	};
	
	api.updateAttendeesByClass = function(params) {
		Titanium.App.Properties.removeProperty("attendees_class");
		getReunionData('/attendees/' + params, function(_respData) {
			var data = JSON.parse(_respData);
			var json = JSON.stringify(data);
			Titanium.App.Properties.setString("attendees_class", json);
		});
	};
	

	api.saveAttendeesByClassYear = function() {
		getReunionData('/attendees/' + prefs.school_abbr + '/' + prefs.year, function(_respData) {
			var data = JSON.parse(_respData);
			var json = JSON.stringify(data);
			Titanium.App.Properties.setString("attendees_class_year", json);
		});
	};
	
	api.updateAttendeesByClassYear = function(params) {
		Titanium.App.Properties.removeProperty("attendees_class_year");
		getReunionData('/attendees/' + params, function(_respData) {
			var data = JSON.parse(_respData);
			var json = JSON.stringify(data);
			Titanium.App.Properties.setString("attendees_class_year", json);
		});
	};

	api.saveScheduleByClass = function() {
		getReunionData('/schedule/' + prefs.school_abbr + '/' + cohortAbbr, function(_respData) {
			var data = JSON.parse(_respData);
			var json = JSON.stringify(data);
			Titanium.App.Properties.setString("schedule_class", json);
		});
	};
	
	api.updateScheduleByClass = function(params) {
		Titanium.App.Properties.removeProperty("schedule_class");
		getReunionData('/schedule/' + params, function(_respData) {
			var data = JSON.parse(_respData);
			var json = JSON.stringify(data);
			Titanium.App.Properties.setString("schedule_class", json);
		});
	};
	
	api.saveScheduleByRegistrant = function() {
		if(registration.code){
			getReunionData('/party_schedule/' + registration.code, function(_respData) {
				var data = JSON.parse(_respData);
				var json = JSON.stringify(data);
				Titanium.App.Properties.setString("schedule_registrant", json);
			});
		}else{
			return;
		}
	};
	
	api.updateScheduleByRegistrant = function(params) {
		Ti.API.info('Updating registrant string... ' + params);
		Titanium.App.Properties.removeProperty("schedule_registrant");
		getReunionData('/party_schedule/' + params, function(_respData) {
			var data = JSON.parse(_respData);
			var json = JSON.stringify(data);
			Titanium.App.Properties.setString("schedule_registrant", json);
		});
	};
	
	api.updateString = function(my_property, json) {
		if(my_property){
			Titanium.App.Properties.removeProperty(my_property);
			Titanium.App.Properties.setString(my_property, json);
		}else{
			return;
		}
	};
	
	return api;

}());