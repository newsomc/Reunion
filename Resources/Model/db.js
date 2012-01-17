/**
 * DB FUNCTIONS
 */

var db = (function(){

	var api = {};
	
	var conn = Titanium.Database.open('reunion');
	
	conn.execute('CREATE TABLE IF NOT EXISTS YEAR_SCHOOL  (YEAR INTEGER, SCHOOL TEXT)');

	conn.close();
	
	api.storeSchoolYear = function(year, school){
		var conn = Titanium.Database.open('reunion');
  		//conn.execute('INSERT INTO YEAR_SCHOOL (YEAR, SCHOOL ) VALUES(?,?)',picker.getSelectedRow(1).title, picker.getSelectedRow(0).title);
  		conn.execute('INSERT INTO YEAR_SCHOOL (YEAR, SCHOOL ) VALUES(?,?)', year, school);
  		conn.close();
	};

	api.isFirstTime = function(){
		var conn = Titanium.Database.open('reunion');
		conn.execute('SELECT * FROM YEAR_SCHOOL');
		Titanium.API.info('ROW COUNT = ' + conn.getRowCount());
	
		if(conn.getRowCount() == null){
			return true;
		}
		else{
			return false;
		}	
		conn.close();
	};

	api.getCurrentYear = function(){
		var conn = Titanium.Database.open('reunion');
	  	var set = conn.execute('SELECT YEAR FROM YEAR_SCHOOL');
	  if (set.isValidRow()) {
        result = {
        	  year: set.fieldByName("YEAR")
      	};
      }
      set.close();
      return result;
	};

	api.getYearSchoolAsText = function(){
		var conn = Titanium.Database.open('reunion');
		var rows = conn.execute('SELECT * FROM YEAR_SCHOOL');

		while (rows.isValidRow())
		{
			var schoolYear = rows.field(1) + " " + rows.field(0);
			//Titanium.API.info(rows.field(1) + '\n' + rows.field(0));
			rows.next();
		}
		conn.close();
		Titanium.API.debug("SCHOOLYEAR: "+ schoolYear); 
		return schoolYear;
	
	}

	api.getYearSchool = function (){
		var conn = Titanium.Database.open('reunion');
	  	var rows = conn.execute('SELECT * FROM YEAR_SCHOOL');
	  	var results = {};
	  	if(rows != null){	
	  	  while (rows.isValidRow()){	
			results.school = rows.field(1);
			results.year = rows.field(0);
			rows.next();		 
		  }
		}
		conn.close();
		Titanium.API.debug("Results: " + JSON.stringify(results)); 
		return results;
	  	
	}

	api.updateYearSchool = function(school, year){
		var conn = Titanium.Database.open('reunion');
		conn.execute('UPDATE YEAR_SCHOOL SET SCHOOL="' + school + '", YEAR="' + year + '"');
		conn.close();
	}

	api.deleteAll = function(){
		var conn = Titanium.Database.open('reunion');
	    conn.execute('DELETE FROM YEAR_SCHOOL');
		conn.close();		
	}
	
	
	api.createTest = function(){
		var conn = Titanium.Database.open('reunion');
		conn.execute('INSERT INTO YEAR_SCHOOL (YEAR, SCHOOL ) VALUES(?,?)', '2007', 'Columbia College');
		conn.close();	
	}
	

  //return the public API
  return api;
}());
