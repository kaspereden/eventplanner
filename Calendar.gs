/**
 * Create a calendar event on the eventData
 * @param eventData
 * @param properties
 */
function createCalendarEvent(eventData, properties) {
    var calendarId = 'primary',
        startDate = new Date(eventData.start.datetime),
        endDate = new Date(eventData.end.datetime),
        event = {
            summary: eventData.title,
            description: eventData.description,
            location: eventData.location
        };

    if (eventData.eventType === 'day') {
        event.start = {
            date: eventData.start.date
        };
        event.end = {
            date: addOneDay(endDate)
        };
    } else {
        event.start = {
            dateTime: startDate.toISOString()
        };
        event.end = {
            dateTime: endDate.toISOString()
        };
    }

    // Create the event
    var calendarEvent = Calendar.Events.insert(event, 'primary');

    // Set properties for later use
    properties.setProperty('eventId', calendarEvent.id);
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

    if(month.length < 2) {
        month = '0' + month;
    }
    if(day.length < 2) {
        day = '0' + day;
    }

    return [year, month, day].join('-');
}

/**
 * Remove calendar event that is linked to the form
 */
function removeCalendarEvent() {
    var calendarId = 'primary',
        properties = PropertiesService.getDocumentProperties(),
        eventId = properties.getProperty('eventId');

    Calendar.Events.remove( calendarId, eventId );
}

/**
 * Add a guest to the event.
 * @param email
 */
function addGuestToEvent(email) {
    var calendarId = 'primary',
        properties = PropertiesService.getDocumentProperties(),
        eventId = properties.getProperty('eventId'),
        event = Calendar.Events.get( calendarId, eventId );

    if(event.attendees) {
        event.attendees.push({
            email: email
        });
    } else {
        event.attendees = new Array({email: email});
    }

    event = Calendar.Events.patch(event, calendarId, eventId, {
        sendNotifications: true
    });
}

