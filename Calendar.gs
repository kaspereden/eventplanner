
function createCalendarEvent(eventData, properties) {
  // Convert dateTime string to start & end dates
  var startDate = new Date(eventData.start.datetime);
  var endDate = new Date(eventData.end.datetime);

  // Convert description and location to options object
  var options = {};
  options.description = eventData.description;
  options.location = eventData.location;
  var title = eventData.title;

  // Create calendar event
  var calendar = CalendarApp.getDefaultCalendar();
  var ev;
  var calendarId;

  if(eventData.eventType === 'day'){
    options.summary = title;
    options.start = {
      date: eventData.start.date
    }
    options.end = {
      date: addOneDay( endDate )
    }
    ev = Calendar.Events.insert(options, 'primary');
    calendarId = ev.id + '@google.com';
  } else {
    ev = calendar.createEvent(title, startDate, endDate, options);
    calendarId = ev.getId();
  }

  properties.setProperty('eventDate', eventData.start.datetime);

  properties.setProperty('eventTitle', title);
  properties.setProperty('eventId', calendarId);
  properties.setProperty('calendarId', calendar.getId());
}

function addOneDay( date ){
  date.setDate(date.getDate() + 1);

  var month = '' + (date.getMonth() + 1),
      day = '' + date.getDate(),
      year = date.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

function getCalendarEvent(){
  var properties = PropertiesService.getDocumentProperties();
  var cal = CalendarApp.getCalendarById(properties.getProperty('calendarId'));
  var options = {search: properties.getProperty('eventTitle')};
  var events = cal.getEventsForDay(new Date(properties.getProperty('eventDate')), options);
  var lenevents = events.length;

  var eventId = properties.getProperty('eventId');

  for (var i = 0; i < lenevents; i++) {
    if (events[i].getId() === eventId) {
      return events[i];
    }
  }
}

function removeCalendarEvent(){
  var calendarEvent = getCalendarEvent();

  calendarEvent.deleteEvent();
}

function addGuestToEvent(email) {
  var calendarEvent = getCalendarEvent();

  calendarEvent.addGuest(email);
}

