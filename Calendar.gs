
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
  var ev;

  if(eventData.eventType === 'day'){
    if(startDate.getDate() === endDate.getDate()){
      ev = calendar.createAllDayEvent(title, startDate, options);
    } else {
      startDate.setHours( 0, 0, 0 );
      endDate.setHours( 23, 59, 59 );
      ev = calendar.createEvent(title, startDate, endDate, options);
    }
  } else {
    ev = calendar.createEvent(title, startDate, endDate, options);
  }

  properties.setProperty('eventDate', eventData.start.datetime);

  properties.setProperty('eventTitle', title);
  properties.setProperty('eventId', ev.getId());
  properties.setProperty('calendarId', calendar.getId());
}


function addGuestToEvent(email) {
  var properties = PropertiesService.getDocumentProperties();
  var cal = CalendarApp.getCalendarById(properties.getProperty('calendarId'));
  var options = {search: properties.getProperty('eventTitle')};
  var events = cal.getEventsForDay(new Date(properties.getProperty('eventDate')), options);
  var lenevents = events.length;

  var eventId = properties.getProperty('eventId');
  for (var i = 0; i < lenevents; i++) {
    if (events[i].getId() === eventId) {
      events[i].addGuest(email);
    }
  }
}

