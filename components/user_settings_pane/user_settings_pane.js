'use strict';
BC.UserSettingsPane = function() {
  const settingsPaneSelector = '.bc-user-settings-pane',
        userTaxRateFieldId = 'bc-user-settings-taxRate',
        paneVisibleClass = 'bc-user-settings-pane--visible',
        hidePaneSelector = '.bc-user-settings-pane-hide-trigger',
        showPaneSelector = '.bc-user-settings-pane-show-trigger';

  let taxRate,
      settingsPane,
      showPaneTriggers,
      hidePaneTriggers;

  function disableTaxesSetting() {
    taxRate.value = '';
    taxRate.setAttribute('disabled', true);
  }

  function enableTaxesSetting(userSettings) {
    taxRate.removeAttribute('disabled');
    if (userSettings.taxRate) {
      taxRate.value = userSettings.taxRate; // If they've previously saved a tax rate, restore that value here
    }
  }

  function updateTaxesSetting(userSettings) {
    disableTaxesSetting();
    if (userSettings !== null && userSettings.plus_member) {
      enableTaxesSetting(userSettings); // If they're a plus member, give them access to the tax rate settings
    }
  }

  function setEventListeners() {
    document.addEventListener(customEvents.userSignedIn, update);
    document.addEventListener(customEvents.userSignedOut, update);
    hidePaneTriggers.forEach(function(t){
      t.addEventListener("click", hidePane);
    });

    showPaneTriggers.forEach(function(t){
      t.addEventListener("click", showPane);
    });
  }

  const showPane = function showPane() {
    BC.SiteMenu.showMenu();
    settingsPane.classList.add(paneVisibleClass);
  }

  const hidePane = function hidePane() {
    settingsPane.classList.remove(paneVisibleClass);
  }

  const update = function update() {
    const userSettings = BC.App.getUserSettings();
    updateTaxesSetting(userSettings);
  }

  const initialize = function initialize() {
    taxRate = document.getElementById(userTaxRateFieldId);
    settingsPane = document.querySelector(settingsPaneSelector);
    hidePaneTriggers = Array.from(document.querySelectorAll(hidePaneSelector));
    showPaneTriggers = Array.from(document.querySelectorAll(showPaneSelector));
    update();
    setEventListeners();
  }

  return {
    initialize: initialize,
    update: update,
    showPane: showPane,
    hidePane: hidePane
  }
}();
