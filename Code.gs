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

 var authInfo = ScriptApp.getAuthorizationInfo(ScriptApp.AuthMode.FULL);
 var status = authInfo.getAuthorizationStatus();
  Logger.log(status);

  if (status === ScriptApp.AuthorizationStatus.REQUIRED) {
    showAuthorisationPopup(authInfo);
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

  return arr[2]+'/'+arr[1]+'/'+arr[0];
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
  
  if(eventData.start && eventData.start.date && eventData.end && eventData.end.date && parseInt(startDate, 10) > parseInt(endDate, 10)) {
    return 'The start date should be on or before the end date.';
  }
  
  if(eventData.start && eventData.start.date && eventData.start.time && eventData.end && eventData.end.date && eventData.end.time && parseInt(startDate+startTime, 10) >= parseInt(endDate+endTime, 10)) {
    return 'The start date and time should be before the end date and time.';
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
  
  /* Check if the start date is set */
  if(!eventData.start || !eventData.start.date) {
    hasStartDate = false;
    errorArray.push('The start date should not be empty.');
  }

  /* Check if the start time is set */  
  if(!eventData.start || !eventData.start.time) {
    errorArray.push('The start time should not be empty.');
  }
  
  /* Check if the end date is set */
  if(!eventData.end || !eventData.end.date) {
    hasEndDate = false;
    errorArray.push('The end date should not be empty.');
  }
  
  /* Check if the end time is set */
  if(!eventData.end || !eventData.end.time) {
    errorArray.push('The end time should not be empty.');
  }
  
  /* Check if the start date is on or before the end date */
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

  try{
    checkValues(eventData);
  }
  catch(e){
    throw new Error(e.message);
  }

  var form = FormApp.getActiveForm(),
      properties = PropertiesService.getDocumentProperties(),
      item = form.addMultipleChoiceItem();

  eventData.description = form.getDescription();
  eventData.title = form.getTitle();

  var helptext = eventData.title + eventData.eventString;

  item.setTitle('Are you attending?')
    .setHelpText(helptext)
      .setChoices([
         item.createChoice('Yes'),
         item.createChoice('No')
      ])
     .showOtherOption(false);

  // Create calendar event
  createCalendarEvent(eventData, properties);

//  if (ScriptApp.AuthMode === 'FULL') {
    // only allowed in authmode full.
    var trigger = ScriptApp.newTrigger('mailTheEvent')
       .forForm(form)
       .onFormSubmit()
       .create();
    properties.setProperty('triggerId', trigger.getUniqueId());
 // } else {
   // Logger.log('No trigger has been set because of: ' + ScriptApp.AuthMode);
  //}

}


function mailTheEvent(e) {
//  Logger.log(JSON.stringify(e.namedValues));
  // TODO: read submitted data and decide whether or not this should occur and who the sender is.
  var email='pieter.bogaerts@incentro.com';

  addGuestToEvent(email);
  Logger.log(Session.getEffectiveUser().getEmail());

}
