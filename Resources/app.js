Ti.include('db/db.js','ui/ui.js','ui/picker.js', 'network/network.js','db/persistData.js');
init.isFirstTimeToLoad();
persist.saveAttendeesByClass();
persist.saveAttendeesByClassYear();
persist.saveScheduleByClass();
persist.saveScheduleByRegistrant();

