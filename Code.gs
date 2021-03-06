/**
 * @OnlyCurrentDoc  Limits the script to only accessing the current form.
 */


var SIDEBAR_TITLE = 'Event Planner';
var AUTH_POPUP_TITLE = 'Authorisation Request';

/**
 * Adds a custom menu with items to show the sidebar and dialog.
 *
 * @param {Object} e The event parameter for a simple onOpen trigger.
 */
function onOpen(e) {
    FormApp.getUi()
        .createAddonMenu()
        .addItem('Show event planner', 'showSidebar')
        .addToUi();
}

/**
 * Runs when the add-on is installed; calls onOpen() to ensure menu creation and
 * any other initializion work is done immediately.
 *
 * @param {Object} e The event parameter for a simple onInstall trigger.
 */
function onInstall(e) {
    onOpen(e);
}

/**
 * Opens a sidebar. The sidebar structure is described in the Sidebar.html
 * project file.
 */
function showSidebar() {
    var properties = PropertiesService.getDocumentProperties(),
        authInfo = ScriptApp.getAuthorizationInfo(ScriptApp.AuthMode.FULL),
        status = authInfo.getAuthorizationStatus();

    // The app requires triggers that can only run in FULL auth mode
    if (status === ScriptApp.AuthorizationStatus.REQUIRED) {
        showAuthorisationPopup(authInfo);
    } else {
        var template,
            html;

        // There can be only one event so when it is already set show the error sidebar
        if (properties.getProperty('guestAddTriggerId')) {
            template = HtmlService.createTemplateFromFile('SidebarError');
        } else {
            template = HtmlService.createTemplateFromFile('Sidebar');
        }

        template.lang = getLang();
        html = template.evaluate().setTitle(SIDEBAR_TITLE);
        FormApp.getUi().showSidebar(html);
    }
}

/**
 * Get the user language. Currently the app only supports NL, ES, EN and TR
 * @returns {*}
 */
function getLang() {
    var lang = Session.getActiveUserLocale(),
        supportedLanguages = ['nl', 'en', 'es', 'tr'];

    // If the language is not supported use english as fallback
    if (supportedLanguages.indexOf(lang) === -1) {
        lang = 'en';
    }

    return lang;
}

/**
 * Show an authorisation popup when the user is not in FULL mode.
 * @param authInfo
 */
function showAuthorisationPopup(authInfo) {
    var template = HtmlService.createTemplateFromFile('AuthorisationPopup');
    template.authUrl = authInfo.getAuthorizationUrl();
    template.lang = getLang();
    template.evaluate();
    template.setWidth(350);
    template.setHeight(170);
    FormApp.getUi().showModalDialog(template, AUTH_POPUP_TITLE);
}

/**
 * Convert the date from yyyy-mm-dd to dd/mm/yyyy
 *
 * @param {string} the original date formatted as yyyy-mm-dd.
 * @return {string} the converted date formatted as dd/mm/yyyy
 */
function convertDate(date) {
    var arr = date.split('-');

    return arr[2] + '/' + arr[1] + '/' + arr[0];
}

/**
 * Get autocomplete suggestions for the location field from the Places API
 *
 * @param  {string} The query to search for
 * @return {Object} Object containing the results
 */
function getPlaces(query) {
    var completeUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyD8dAv-lAB0PeLifnE_K0_aCKylvlvZgck&language=' + Session.getActiveUserLocale() + '&input=' + query,
        response = UrlFetchApp.fetch(completeUrl),
        data = response.getContentText(),
        json = JSON.parse(data);

    return json;
}

/**
 * Fetch the title of the form
 *
 * @return {String} The title of the current form
 */
function getTitle() {
    return FormApp.getActiveForm().getTitle();
}

/**
 * Check if the users start date is before the end date
 *
 * @param  {Object} Object containing the user input
 * @return {String} String containing the error messages
 */
function checkEventDate(eventData) {
    var startDate = eventData.start.date.replace(/-/g, ''),
        startTime = eventData.start.time.replace(/:/g, ''),
        endDate = eventData.end.date.replace(/-/g, ''),
        endTime = eventData.end.time.replace(/:/g, '');

    if (parseInt(startDate, 10) > parseInt(endDate, 10)) {
        return 'The end date should be on or after the start date.';
    } else if (eventData.eventType !== 'day' && parseInt(startDate + startTime, 10) >= parseInt(endDate + endTime, 10)) {
        return 'The end date and time should be after the start date and time.';
    }
}

/**
 * Check if the user filled in all the required fields.
 *
 * @param  {Object} Object containing the user input
 * @return {Object} Object containing the error messages
 */
function checkValues(eventData) {
    var errorArray = [],
        hasStartDate = true,
        hasEndDate = true;

    // Check if the start date is set
    if (!eventData.start || !eventData.start.date) {
        hasStartDate = false;
        errorArray.push('Please enter a start date.');
    }

    // Check if the start time is set
    if (!eventData.start || !eventData.start.time) {
        errorArray.push('Please enter a start time.');
    }

    // Check if the end date is set
    if (!eventData.end || !eventData.end.date) {
        hasEndDate = false;
        errorArray.push('Please enter an end date.');
    }

    // Check if the end time is set
    if (!eventData.end || !eventData.end.time) {
        errorArray.push('Please enter an end time.');
    }


    // Check if the start date is on or before the end date
    if (hasStartDate && hasEndDate && checkEventDate(eventData)) {
        errorArray.push(checkEventDate(eventData));
    }

    if (errorArray.length) {
        throw {
            message: errorArray.join('<br>')
        }
    }
}

/**
 * Appends a new form item to the current form.
 *
 * @param {Object} itemData a collection of String data used to
 *     determine the exact form item created.
 */
function addFormItem(eventData) {
    // Use data collected from sidebar to manipulate the form.

    try {
        checkValues(eventData);
    }
    catch (e) {
        throw new Error(e.message);
    }

    var form = FormApp.getActiveForm(),
        properties = PropertiesService.getDocumentProperties(),
        lang = getLang();

    // 1. Create calendar event
    eventData.description = form.getDescription();
    createCalendarEvent(eventData, properties);

    // 2. set trigger
    var trigger = ScriptApp.newTrigger('addGuestOnSubmit')
        .forForm(form)
        .onFormSubmit()
        .create();
    properties.setProperty('guestAddTriggerId', trigger.getUniqueId());

    // 3. add item to form
    var item = form.addMultipleChoiceItem();

    item.setTitle(translations[lang].formItem.title)
        .setHelpText(eventData.eventString)
        .setRequired(true)
        .setChoices([
            item.createChoice(translations[lang].formItem.yes),
            item.createChoice(translations[lang].formItem.no)
        ])
        .showOtherOption(false);

    properties.setProperty('attendingTrue', translations[lang].formItem.yes);

    properties.setProperty('itemId', item.getId());
    form.setCollectEmail(true);
}

/**
 * Check whether the author of the form changed the options.
 * @returns {boolean}
 */
function checkFormItemValue() {
    var hasChanged = false,
        properties = PropertiesService.getDocumentProperties(),
        itemId = parseFloat(properties.getProperty('itemId')),
        attendingTrue = properties.getProperty('attendingTrue'),
        form = FormApp.getActiveForm(),
        items = form.getItems();

    for (var i = 0; i < items.length; i++) {
        if (items[i].getId() === itemId) {
            var firstChoice = items[i].asMultipleChoiceItem().getChoices()[0].getValue();
            if (firstChoice !== attendingTrue) {
                hasChanged = true;
                properties.setProperty('attendingTrue', firstChoice);
            }
            break;
        }
    }

    return hasChanged;
}

/**
 * Check whether or not the form item still exists, if not remove everything
 * @returns {boolean}
 */
function checkEventDeletion() {
    var isDeleted = true,
        properties = PropertiesService.getDocumentProperties(),
        itemId = parseFloat(properties.getProperty('itemId')),
        form = FormApp.getActiveForm(),
        items = form.getItems();

    for (var i = 0; i < items.length; i++) {
        if (items[i].getId() === itemId) {
            isDeleted = false;
            break;
        }
    }

    if (isDeleted) {
        // 1. Remove calendar event
        removeCalendarEvent();

        // 2. Remove triggers
        removeAllTriggers();
    }

    return isDeleted;
}

/**
 * remove all triggers set by the event planner
 */
function removeAllTriggers() {
    var triggers = ScriptApp.getProjectTriggers();
    for (var i = 0; i < triggers.length; i++) {
        ScriptApp.deleteTrigger(triggers[i]);
    }
}

/**
 * Add a guest when one has pressed submit.
 * @param e
 */
function addGuestOnSubmit(e) {
    var form = FormApp.getActiveForm(),
        responses = form.getResponses(),
        last = responses.length - 1,
        response = responses[last],
        email = response.getRespondentEmail(),
        items = response.getItemResponses(),
        isAttending = false,
        properties = PropertiesService.getDocumentProperties();

    /*
    We're reading a spreadsheet row so that means
    we need to loop though all colums in order to
    find what we're looking for.
     */
    for (var i = 0; i < items.length; i++) {
        if (items[i].getItem().getId() === parseFloat(properties.getProperty('itemId'))) {
            isAttending = items[i].getResponse() === properties.getProperty('attendingTrue');
            break;
        }
    }

    // Only invite when the user is attending and we have the mailaddress.
    if (email && isAttending) {
        addGuestToEvent(email);
    }

}

/**
 * When the user is invited we show the "whoohoo" screen to prevent multiple events being added.
 */
function showCompletedScreen() {
    var template = HtmlService.createTemplateFromFile('SidebarSuccess');
    template.lang = getLang();

    var html = template.evaluate().setTitle(SIDEBAR_TITLE);
    FormApp.getUi().showSidebar(html);
}
