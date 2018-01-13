'use strict';
BC.UserSettingsPane = function() {
  const userTaxRateFieldId = 'bc-user-settings-taxRate',
        userSettings = BC.Utils.getFromLocalStorage(userSettingsKeyName);

  let taxRate;
  // TODO, need a way to fetch fresh user settings - probably another endpoint, that way user doesn't have to log out and log back in to get fresh settings

  function updateTaxesSetting(userSettings) {
    if (userSettings.plus_member) {
      if (userSettings.taxRate) {
        taxRate.removeAttribute('disabled');
        taxRate.value = userSettings.taxRate;
      } else {
        taxRate.setAttribute('disabled', true);
      }
    }
  }

  function setEventListeners() {
    document.addEventListener(customEvents.userSignedIn, update);
  }

  const update = function update() {
    if (userSettings !== null) {
      updateTaxesSetting(userSettings);
    }
  }

  const initialize = function initialize() {
    taxRate = document.getElementById(userTaxRateFieldId);
    update();
    setEventListeners();
  }

  return {
    initialize: initialize,
    update: update
  }
}();
