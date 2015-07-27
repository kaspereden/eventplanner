function createCalendarEvent(title, startDate, endDate, description, location) {
  /**
   * Convert dateTime string to start & end dates
   */
  var startDate = new Date(startDate);
  var endDate = new Date(endDate);

  /**
   * Convert description and location to options object
   */
  var options = {};
  options.description = description;
  options.location = location;

  /**
   * Create calendar event
   */
  CalendarApp.getDefaultCalendar().createEvent(title, startDate, endDate, options);
}

//createCalendarEvent('Demo kijken', 'July 27, 2015 20:00:00', 'July 27, 2015 21:00:00', 'Lekker kijken', 'Incentro Rotterdam');