
function createCalendarEvent(eventData, properties) {
  Logger.log(eventData.start.datetime);
  /**
   * Convert dateTime string to start & end dates
   */
  var startDate = new Date(eventData.start.datetime);
  var endDate = new Date(eventData.end.datetime);

  /**
   * Convert description and location to options object
   */
  var options = {};
  options.description = eventData.description;
  options.location = eventData.location;
  var title = eventData.title;
  /**
   * Create calendar event
   */
  var calendar = CalendarApp.getDefaultCalendar();
  var ev = calendar.createEvent(title, startDate, endDate, options);
  properties.setProperty('eventId', ev.getId());
  properties.setProperty('event', ev);
}


function addGuest(email, event) {
  event.addGuest(email);
}



//createCalendarEvent('Demo kijken', 'July 27, 2015 20:00:00', 'July 27, 2015 21:00:00', 'Lekker kijken', 'Incentro Rotterdam');