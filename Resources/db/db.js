/**
 *
 * @author Clint Newsom
 * 02-08-2012
 * cn2284@columbia.edu
 *
 * DB Class.
 */

var db = ( function() {

	var api = {};

	var conn = Titanium.Database.open('reunion');
	//prefs tables.
	conn.execute('CREATE TABLE IF NOT EXISTS YEAR_SCHOOL (YEAR INTEGER, SCHOOL TEXT, SCHOOL_ABBR TEXT, COHORT_PREFIX TEXT)');
	conn.execute('CREATE TABLE IF NOT EXISTS REG_CODE (CODE TEXT)');
	conn.close();

	api.storeSchoolCohortYear = function(year, school, school_abbr, cohort_prefix) {
		var conn = Titanium.Database.open('reunion');
		//conn.execute('INSERT INTO YEAR_SCHOOL (YEAR, SCHOOL ) VALUES(?,?)',picker.getSelectedRow(1).title, picker.getSelectedRow(0).title);
		conn.execute('INSERT INTO YEAR_SCHOOL (YEAR, SCHOOL, SCHOOL_ABBR, COHORT_PREFIX) VALUES(?,?,?,?)', year, school, school_abbr, cohort_prefix);
		//Ti.API.info('STORING DATA: ' + year + school + ", " + school_abbr + cohort_prefix);
		conn.close();
	};

	api.isFirstTime = function() {
		var conn = Titanium.Database.open('reunion');
		var rows = conn.execute('SELECT * FROM YEAR_SCHOOL');
		//Titanium.API.info('ROW COUNT = ' + rows.getRowCount());

		if(rows.getRowCount() == null || rows.getRowCount() == 0) {

			return true;
		} else {
			return false;
		}
		conn.close();
	};

	api.getCurrentYear = function() {
		var conn = Titanium.Database.open('reunion');
		var set = conn.execute('SELECT YEAR FROM YEAR_SCHOOL');
		if(set.isValidRow()) {
			result = {
				year : set.fieldByName("YEAR")
			};
		}
		set.close();
		return result;
	};

	api.getYearSchoolAsText = function() {
		var conn = Titanium.Database.open('reunion');
		var rows = conn.execute('SELECT * FROM YEAR_SCHOOL');
		while(rows.isValidRow()) {
			var schoolYear = rows.field(1) + " " + rows.field(0);
			rows.next();
		}
		conn.close();
		return schoolYear;
	}

	api.getUserPrefs = function() {
		var conn = Titanium.Database.open('reunion');
		var rows = conn.execute('SELECT * FROM YEAR_SCHOOL');
		var results = {};
		if(rows != null) {
			while(rows.isValidRow()) {
				//Ti.API.info(JSON.stringify(rows.field(3)));
				results.school = rows.field(1);
				results.year = rows.field(0);
				results.school_abbr = rows.field(2);
				results.cohort_prefix = rows.field(3);
				rows.next();
			}
		}
		conn.close();
		return results;

	}

	api.updateYearSchool = function(year, school, school_abbr, cohort_prefix) {
		Ti.API.info('updating...');
		var conn = Titanium.Database.open('reunion');
		conn.execute('UPDATE YEAR_SCHOOL SET YEAR=(?), SCHOOL=(?), SCHOOL_ABBR=(?), COHORT_PREFIX=(?)', year, school, school_abbr, cohort_prefix);
		conn.close();
	}

	api.deleteAll = function() {
		var conn = Titanium.Database.open('reunion');
		conn.execute('DELETE FROM YEAR_SCHOOL');
		conn.execute('DELETE FROM REG_CODE');
		conn.close();
	}

	api.getRegCode = function() {
		var conn = Titanium.Database.open('reunion');
		var rows = conn.execute('SELECT CODE FROM REG_CODE');
		var results = {};

		//Titanium.API.info('ROW COUNT = ' + rows.getRowCount());
		if(rows.getRowCount() == null || rows.getRowCount() == 0) {

			return 'No registration code is set';
		} else {

			if(rows != null) {
				while(rows.isValidRow()) {
					results.code = rows.field(0);
					rows.next();
				}
			}
			conn.close();
			//Titanium.API.debug("Results: " + JSON.stringify(results));
			return results;
		}
		conn.close();
	};

	api.validateRegCode = function(string) {
		if(/^[a-zA-Z0-9]+$/.test(string)) {
			return true;
		} else {
			return false;
		}
	};

	api.updateInsertRegCode = function(code) {
		var conn = Titanium.Database.open('reunion');
		var rows = conn.execute('SELECT CODE FROM REG_CODE');
		//Titanium.API.info('ROW COUNT = ' + rows.getRowCount());
		var isValid = this.validateRegCode(code);

		if(conn == '' || conn == null) {
			return;
		} else {
			if(isValid === false) {
				alert('Registration codes may only be alphanumeric characters.');
				return;
			}
			if(code == '') {
				conn.execute('DELETE FROM REG_CODE');
				return;
			}
			if(rows.getRowCount() == null || rows.getRowCount() == 0) {
				conn.execute('INSERT INTO REG_CODE (CODE) VALUES (?)', code);
				//conn.close();

			} else {
				conn.execute("UPDATE REG_CODE SET CODE = (?)", code);
				//conn.close();
			}
			conn.close();
		}
	}

/*	api.setData = function(table, json) {
		//Ti.API.info(table + json);
		Ti.API.info('Setting data.');
		var conn = Titanium.Database.open('reunion');
		conn.execute('INSERT INTO ' + table + ' (MY_JSON) VALUES (?)', json);
		//conn.execute('INSERT INTO ATTENDEES_CLASS (MY_JSON) VALUES (?)', json);
		conn.close();
	}

	api.deleteData = function(table) {
		Ti.API.info('Deleting data.');
		var conn = Titanium.Database.open('reunion');
		conn.execute('DELETE FROM ' + table);
		conn.close();
	}

	api.getData = function(table) {
		var conn = Titanium.Database.open('reunion');
		var rows = conn.execute('SELECT MY_JSON FROM ' + table);
		var results = {};
		var i = 0;
		if(rows != null) {
			while(rows.isValidRow()) {
				i++;
				results.my_json = rows.field(0);
				rows.next();
			}
		}
		conn.close();
		Titanium.API.debug('row count ' + i);
		//Titanium.API.debug("Results: >>>>>>>" + JSON.stringify(results));
		return results;

	}*/
	//return the public API
	return api;
}());
