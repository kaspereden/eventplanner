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
    var properties = PropertiesService.getDocumentProperties();
    var authInfo = ScriptApp.getAuthorizationInfo(ScriptApp.AuthMode.FULL);
    var status = authInfo.getAuthorizationStatus();


    if (status === ScriptApp.AuthorizationStatus.REQUIRED) {
        showAuthorisationPopup(authInfo);
    } else if (properties.getProperty('guestAddTriggerId')) {
        var Eui = HtmlService.createTemplateFromFile('SidebarError').evaluate().setTitle(SIDEBAR_TITLE);
        FormApp.getUi().showSidebar(Eui);
    } else {
        var ui = HtmlService.createTemplateFromFile('Sidebar').evaluate().setTitle(SIDEBAR_TITLE);
        FormApp.getUi().showSidebar(ui);
    }
}


function showAuthorisationPopup(authInfo) {
    var template = HtmlService.createTemplateFromFile('AuthorisationPopup');
    template.authUrl = authInfo.getAuthorizationUrl();
    template.evaluate();
    template.setWidth(350);
    template.setHeight(170);
    FormApp.getUi().showModalDialog(ui, AUTH_POPUP_TITLE);
}

/**
 * Convert the date from yyyy-mm-dd to dd/mm/yyyy
 *
 * @param {string} the original date formatted as yyyy-mm-dd.
 * @return {string} the converted date formatted as dd/mm/yyyy
 */
function convertDate(date) {
    var arr = [];

    arr = date.split('-');

    return arr[2] + '/' + arr[1] + '/' + arr[0];
}

/**
 * Get autocomplete suggestions for the location field from the Places API
 *
 * @param  {string} The query to search for
 * @return {Object} Object containing the results
 */
function getPlaces( query ) {
  var completeUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyD8dAv-lAB0PeLifnE_K0_aCKylvlvZgck&language=' + Session.getActiveUserLocale() + '&input=' + query;
  var response = UrlFetchApp.fetch( completeUrl );
  var data = response.getContentText();
  var json = JSON.parse( data );

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
       startTime = eventData.start.time.replace(/:/g,''),
       endDate = eventData.end.date.replace(/-/g, ''),
       endTime = eventData.end.time.replace(/:/g,'');

  if (parseInt(startDate, 10) > parseInt(endDate, 10)) {
    return 'The end date should be on or after the start date.';
  } else if(eventData.eventType !== 'day' && parseInt(startDate+startTime, 10) >= parseInt(endDate+endTime, 10)) {
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
  if(!eventData.start || !eventData.start.date) {
    hasStartDate = false;
    errorArray.push('Please enter a start date.');
  }

  // Check if the start time is set
  if(!eventData.start || !eventData.start.time) {
    errorArray.push('Please enter a start time.');
  }

  // Check if the end date is set
  if(!eventData.end || !eventData.end.date) {
    hasEndDate = false;
    errorArray.push('Please enter an end date.');
  }

  // Check if the end time is set
  if(!eventData.end || !eventData.end.time) {
    errorArray.push('Please enter an end time.');
  }



  // Check if the start date is on or before the end date
  if(hasStartDate && hasEndDate && checkEventDate(eventData)) {
    errorArray.push(checkEventDate(eventData));
  }

  if(errorArray.length) {
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
        properties = PropertiesService.getDocumentProperties();

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

    item.setTitle('Will you be there?')
        .setHelpText(eventData.eventString)
        .setRequired(true)
        .setChoices([
            item.createChoice('Yes'),
            item.createChoice('No')
        ])
        .showOtherOption(false);

    properties.setProperty('itemId', item.getId());
    form.setCollectEmail(true);
}

function checkEventDeletion(){
  var isDeleted = true;

  var properties = PropertiesService.getDocumentProperties();
  var itemId = parseFloat( properties.getProperty('itemId') );

  var form = FormApp.getActiveForm();
  var items = form.getItems();

  for (var i = 0; i < items.length; i++) {
    if( items[i].getId() === itemId ){
      isDeleted = false;
    }
  }

  if(isDeleted){
    // 1. Remove calendar event
    removeCalendarEvent();

    // 2. Remove triggers
    removeAllTriggers();
  }

  return isDeleted;
}

function removeAllTriggers(){
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
}

function addGuestOnSubmit(e) {
    var form = FormApp.getActiveForm();
    var responses = form.getResponses();
    var last = responses.length-1;
    var response = responses[last];
    var email = response.getRespondentEmail()
    var items = response.getItemResponses();
    var isAttending = false;
    var properties = PropertiesService.getDocumentProperties();

    for (var i = 0; i < items.length; i++) {
      if (items[i].getItem().getId() === parseFloat(properties.getProperty('itemId'))) {
        isAttending = items[i].getResponse() === 'Yes';
        break;
      }
    }

    if (email && isAttending) {
        addGuestToEvent(email);
    }

}

function showCompletedScreen() {
    var succesUI = HtmlService.createTemplateFromFile('SidebarSuccess').evaluate().setTitle(SIDEBAR_TITLE);

    FormApp.getUi().showSidebar(succesUI);
}
