/**
 * @OnlyCurrentDoc  Limits the script to only accessing the current form.
 */


var SIDEBAR_TITLE = 'Event Planner';


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

  var ui = HtmlService.createTemplateFromFile('Sidebar')
      .evaluate()
      .setTitle(SIDEBAR_TITLE);
  FormApp.getUi().showSidebar(ui);
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
  var completeUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyD8dAv-lAB0PeLifnE_K0_aCKylvlvZgck&input=' + query;
  var response = UrlFetchApp.fetch( completeUrl );
  var data = response.getContentText();
  var json = JSON.parse( data );
    
  return json;
}

/**
 * Check if the user filled in all the required fields.
 * 
 * @param  {Object} Object containing the user input
 * @return {Object} Object containing the error messages
 */
function checkValues(eventData) {  
  if(!eventData.start || !eventData.start.date) {
    throw { message: 'The start date should not be empty.' }
  }
  
  if(!eventData.start || !eventData.start.time) {
    throw { message: 'The start time should not be empty.' }
  }
  
  if(!eventData.end || !eventData.end.date) {
    throw { message: 'The end date should not be empty.' }
  }
  
  if(!eventData.end || !eventData.end.time) {
    throw { message: 'The end time should not be empty.' }
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

  var helptext = '';
  var startDate = convertDate(eventData.start.date);
  var startTime = eventData.start.time;
  var endDate = convertDate(eventData.end.date);
  var endTime = eventData.end.time;
  var location = eventData.location;

  /* Events with a location */
  if(location) {
    helptext = 'The event will begin at: ' + startDate + ' ' + startTime + ' and will end at : ' + endDate + ' ' + endTime + '. The location of the event is: ' + location;
  } else {
    helptext = 'The event will begin at: ' + startDate + ' ' + startTime + ' and will end at : ' + endDate + ' ' + endTime + '.';
  }

  item.setTitle('Are you attending?')
    .setHelpText(helptext)
      .setChoices([
         item.createChoice('Yes'),
         item.createChoice('No')
      ])
     .showOtherOption(false);

  eventData.description = form.getDescription();
  eventData.title = form.getTitle();

  // Create calendar event
  createCalendarEvent(eventData, properties);

  if (ScriptApp.AuthMode === 'FULL') {
    // only allowed in authmode full.
    var trigger = ScriptApp.newTrigger('mailTheEvent')
       .forForm(form)
       .onFormSubmit()
       .create();
    properties.setProperty('triggerId', trigger.getUniqueId());
  } else {
    Logger.log('No trigger has been set because of: ' + ScriptApp.AuthMode);
  }

}


function mailTheEvent() {
  var properties = PropertiesService.getDocumentProperties();
  var email = 'pieter.bogaerts@incentro.com';//Session.getEffectiveUser().getEmail();

  var event = properties.getProperty('event');
  addGuest(email, event);


}
