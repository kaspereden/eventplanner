/**
 * Create a calendar event on the eventData
 * @param eventData
 * @param properties
 */
function createCalendarEvent(eventData, properties) {
    // Convert dateTime string to start & end dates
    var startDate = new Date(eventData.start.datetime),
        endDate = new Date(eventData.end.datetime);

    // Convert description and location to options object
    var options = {};
    options.description = eventData.description;
    options.location = eventData.location;
    options.sendInvites = true;
    var title = eventData.title;

    // Create calendar event
    var calendar = CalendarApp.getDefaultCalendar(),
        event,
        eventId;

    if (eventData.eventType === 'day') {
        options.summary = title;
        options.start = {
            date: eventData.start.date
        };
        options.end = {
            date: addOneDay(endDate)
        };
        options.sendNotifications = true;
        event = Calendar.Events.insert(options, 'primary');
        eventId = event.id + '@google.com';
    } else {
        event = calendar.createEvent(title, startDate, endDate, options);
        eventId = event.getId();
    }

    // Set properties for later use
    properties.setProperty('eventDate', eventData.start.datetime);
    properties.setProperty('eventTitle', title);
    properties.setProperty('eventId', eventId);
    properties.setProperty('calendarId', calendar.getId());
}

/**
 * Add an all day event
 * @param date
 * @returns {string} yyyy-mm-dd
 */
function addOneDay(date) {
    date.setDate(date.getDate() + 1);

    var month = '' + (date.getMonth() + 1),
        day = '' + date.getDate(),
        year = date.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

/**
 * Get calendar event that is linked with the form
 *
 * @returns {CalendarEvent}
 */
function getCalendarEvent() {
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


/**
 * Remove calendar event that is linked to the form
 */
function removeCalendarEvent() {
    var calendarEvent = getCalendarEvent();

    calendarEvent.deleteEvent();
}

/**
 * Add a guest to the event.
 * @param email
 */
function addGuestToEvent(email) {
    var calendarEvent = getCalendarEvent();

    calendarEvent.addGuest(email);
}

