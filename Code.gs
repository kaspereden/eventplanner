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
 * Appends a new form item to the current form.
 *
 * @param {Object} itemData a collection of String data used to
 *     determine the exact form item created.
 */
function addFormItem(eventData) {
  // Use data collected from sidebar to manipulate the form.

  var form = FormApp.getActiveForm();
  var item = form.addMultipleChoiceItem();
  item.setTitle('Are you joining our event?')
      .setChoices([
         item.createChoice('Yes'),
         item.createChoice('No')
      ])
     .showOtherOption(false);
}
