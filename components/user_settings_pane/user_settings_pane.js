'use strict';
BC.UserSettingsPane = function() {
  const userTaxRateFieldId = 'bc-user-settings-taxRate'

  let taxRate;
  // TODO, need a way to fetch fresh user settings - probably another endpoint, that way user doesn't have to log out and log back in to get fresh settings


  const update = function update() {
    const userSettings = BC.Utils.getFromLocalStorage(userSettingsKeyName);
    console.log(userSettings);
    taxRate.value = userSettings.taxRate;
  }

  function setEventListeners() {
    document.addEventListener(customEvents.userSignedIn, update);
  }

  const initialize = function initialize() {
    taxRate = document.getElementById(userTaxRateFieldId);
    setEventListeners();
  }

  return {
    initialize: initialize,
    update: update
  }
}();
