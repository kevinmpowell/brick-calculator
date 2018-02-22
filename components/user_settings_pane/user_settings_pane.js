/*
  global BC, localStorageKeys, customEvents
*/

'use strict';
BC.UserSettingsPane = function() {
  const settingsPaneSelector = '.bc-user-settings-pane',
        userTaxRateFieldId = 'bc-user-settings-taxRate',
        userEnableTaxRateFieldId = 'bc-user-settings-enableTaxes',
        enablePurchaseQuantityFieldId = 'bc-user-settings-enablePurchaseQuantity',
        paneVisibleClass = 'bc-user-settings-pane--visible',
        plusMemberSettingsSectionSelector = '.bc-user-settings__plus-member-settings',
        plusMemberSettingsDisabledClass = 'bc-user-settings__plus-member-settings--disabled',
        portletConfigCheckboxSelector = '[data-portlet-config-checkbox-value]',
        hidePaneSelector = '.bc-user-settings-pane-hide-trigger',
        showPaneSelector = '.bc-user-settings-pane-show-trigger',
        settingsFormName = 'bcUserSettings',
        countrySelectName = 'country',
        currencySelectName = 'currency',
        topWorldCurrencies = ["USD", "EUR", "JPY", "GBP", "CHF", "CAD", "AUD"];

  let taxRate,
      enableTaxes,
      enablePurchaseQuantity,
      settingsForm,
      settingsPane,
      showPaneTriggers,
      hidePaneTriggers,
      countrySelect,
      currencySelect,
      currencyToastMessage,
      plusMemberSettingsSection,
      portletConfigCheckboxes;

  function disableTaxSettings() {
    taxRate.value = '';
    taxRate.setAttribute('disabled', true);
    enableTaxes.checked = false;
    enableTaxes.setAttribute('disabled', true);
  }

  function disablePurchaseQuantity() {
    enablePurchaseQuantity.checked = false;
    enablePurchaseQuantity.setAttribute('disabled', true);
  }

  function enableTaxSettings(userSettings) {
    taxRate.removeAttribute('disabled');
    enableTaxes.removeAttribute('disabled');
    if (userSettings.taxRate) {
      taxRate.value = userSettings.taxRate; // If they've previously saved a tax rate, restore that value here
    }

    if (userSettings.enableTaxes) { // If they've previously enabled taxes, check the box
      enableTaxes.checked = userSettings.enableTaxes;
    }
  }

  function disablePortletConfigSettings() {
    portletConfigCheckboxes.forEach(function(c){
      c.checked = false;
      c.setAttribute('disabled', true);
    });
  }

  function enablePurchaseQuantitySettings(userSettings) {
    enablePurchaseQuantity.removeAttribute('disabled');

    if (userSettings.enablePurchaseQuantity) {
      enablePurchaseQuantity.checked = userSettings.enablePurchaseQuantity;
    }
  }

  function enablePortletConfigSettings(userSettings) {
    const portletConfig = userSettings.portletConfig;

    portletConfigCheckboxes.forEach(function(c){
      c.removeAttribute('disabled');
      if (portletConfig && portletConfig[c.dataset['portlet-config-checkbox-value']] === false) {
        c.checked = false;
      } else if (portletConfig && portletConfig[c.dataset['portlet-config-checkbox-value']] === true) {
        c.checked = true;
      }
    });
  }

  function togglePlusMemberSettings(userSettings) {
    disablePurchaseQuantity();
    disableTaxSettings();
    disablePortletConfigSettings();

    if (userSettings !== null && userSettings.plus_member) {
      // Enable plus member settings section
      plusMemberSettingsSection.classList.remove(plusMemberSettingsDisabledClass);
      enableTaxSettings(userSettings); // If they're a plus member, give them access to the tax rate settings
      enablePortletConfigSettings(userSettings);
      enablePurchaseQuantitySettings(userSettings);
    } else {
      plusMemberSettingsSection.classList.add(plusMemberSettingsDisabledClass);
    }
  }

  function setSelectedCountryAndCurrency() {
    const countryCode = BC.Utils.getFromLocalStorage(localStorageKeys.country) || BC.App.getCountry() || "US",
          currencyCode = BC.Utils.getFromLocalStorage(localStorageKeys.currency) || BC.Utils.countryToCurrencyMap[countryCode] || "USD";
    countrySelect.value = countryCode;
    currencySelect.value = currencyCode;
  }

  function saveAndUpdateCurrencyAndCountry(country, currency) {
    BC.Utils.saveToLocalStorage(localStorageKeys.country, country);
    BC.Utils.saveToLocalStorage(localStorageKeys.currency, currency);
    BC.Utils.broadcastEvent(customEvents.currencyUpdated);
    BC.Utils.broadcastEvent(customEvents.locationUpdated);
  }

  function saveAndUpdateUserSettings(enablePurchaseQuantityValue, enableTaxesValue, taxRateValue, country, currency, portletConfig) {
    const storedToken = BC.Utils.getFromLocalStorage(localStorageKeys.authToken);
    return BC.API.makeRequest({
      method: 'POST',
      url: '/users/update',
      headers: {
        Authorization: storedToken
      },
      params: {
        preferences: JSON.stringify({enablePurchaseQuantity: enablePurchaseQuantityValue, enableTaxes: enableTaxesValue, taxRate: taxRateValue, country: country, currency: currency, portletConfig: portletConfig})
      }
    });
  }

  function getPlusMemberPortletConfig() {
    const portletConfig = {};
    portletConfigCheckboxes.forEach(function(c){
      portletConfig[c.dataset['portlet-config-checkbox-value']] = c.checked;
    });
    return portletConfig;
  }

  function handleSettingsFormSubmit(e) {
    e.preventDefault();
    const country = countrySelect.value,
          currency = currencySelect.value,
          taxRateValue = taxRate.value,
          enableTaxesValue = enableTaxes.checked,
          enablePurchaseQuantityValue = enablePurchaseQuantity.checked,
          portletConfig = getPlusMemberPortletConfig();

    saveAndUpdateCurrencyAndCountry(country, currency);
    saveAndUpdateUserSettings(enablePurchaseQuantityValue, enableTaxesValue, taxRateValue, country, currency, portletConfig).then(function(data){
      BC.ToastMessage.create('Your Settings have been saved.', 'success');
      BC.Utils.saveToLocalStorage(localStorageKeys.userSettings, data);
      hidePane(); // Hide user settings
      BC.SiteMenu.hideMenu(); // Close the Menu
      BC.Values.hideValues(); // Return to the setLookup Form, since any calculated values will be off until settings are updated
      BC.Utils.broadcastEvent(customEvents.preferencesUpdated);
    }, function(error){
      console.log("ERROR");
      console.log(error);
    });
  }

  function promptCurrencySwitch() {
    const countryCode = BC.App.getCountry();

    if (countryCode !== 'US' && BC.Utils.getFromLocalStorage(localStorageKeys.country) === null) {
      currencyToastMessage = BC.ToastMessage.create('Set values currently shown in USD. <a href="#" class="bc-user-settings-pane-show-trigger">Change currency?</a>', false, false, true, false, 'bc-change-currency-toast-message');
      const showSettingsTrigger = currencyToastMessage.querySelector(".bc-user-settings-pane-show-trigger");
      showSettingsTrigger.addEventListener("click", changeCurrencyFromToastMessage);
    }
  }

  function handleLocationUpdate() {
    setSelectedCountryAndCurrency();
    promptCurrencySwitch();
  }

  function setEventListeners() {
    document.addEventListener(customEvents.userSignedIn, update);
    document.addEventListener(customEvents.userSignedOut, update);
    document.addEventListener(customEvents.locationUpdated, handleLocationUpdate);
    settingsForm.addEventListener("submit", handleSettingsFormSubmit);
    hidePaneTriggers.forEach(function(t){
      t.addEventListener("click", hidePane);
    });

    showPaneTriggers.forEach(function(t){
      t.addEventListener("click", showPane);
    });
  }

  function buildCountrySelector() {
    const countryCodes = Object.keys(BC.Utils.countryToCurrencyMap);
    let options = '';
    countryCodes.sort().forEach(function(c){
      options += '<option value="' + c + '">' + c + "</option>";
    });
    countrySelect.innerHTML = options;
  }

  function buildCurrencySelector() {
    const currencyCodes = Object.values(BC.Utils.countryToCurrencyMap);
    let options = '',
        usedCurrencies = [];

    topWorldCurrencies.forEach(function(c){
      options += '<option value="' + c + '">' + c + "</option>";
    });

    options += '<option disabled>&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;</option>';

    currencyCodes.sort().forEach(function(c){
      if (usedCurrencies.indexOf(c) === -1) {
        options += '<option value="' + c + '">' + c + "</option>";
        usedCurrencies.push(c);
      }
    });
    currencySelect.innerHTML = options;
  }

  const changeCurrencyFromToastMessage = function changeCurrencyFromToastMessage() {
    BC.ToastMessage.removeMessage(currencyToastMessage);
    showPane();
  };

  const showPane = function showPane() {
    BC.SiteMenu.showMenu();
    settingsPane.addEventListener('webkitTransitionEnd', BC.Utils.fixSafariScrolling, {once: true});
    settingsPane.addEventListener('transitionEnd', BC.Utils.fixSafariScrolling, {once: true});
    settingsPane.classList.add(paneVisibleClass);
  };

  const hidePane = function hidePane() {
    settingsPane.classList.remove(paneVisibleClass);
  };

  const update = function update() {
    const userSettings = BC.App.getUserSettings();
    togglePlusMemberSettings(userSettings);
  };

  const initialize = function initialize() {
    taxRate = document.getElementById(userTaxRateFieldId);
    enableTaxes = document.getElementById(userEnableTaxRateFieldId);
    enablePurchaseQuantity = document.getElementById(enablePurchaseQuantityFieldId);
    settingsPane = document.querySelector(settingsPaneSelector);
    plusMemberSettingsSection = document.querySelector(plusMemberSettingsSectionSelector);
    portletConfigCheckboxes = Array.from(document.querySelectorAll(portletConfigCheckboxSelector));
    hidePaneTriggers = Array.from(document.querySelectorAll(hidePaneSelector));
    showPaneTriggers = Array.from(document.querySelectorAll(showPaneSelector));
    settingsForm = document[settingsFormName];
    countrySelect = settingsForm[countrySelectName];
    currencySelect = settingsForm[currencySelectName];
    buildCountrySelector();
    buildCurrencySelector();
    update();
    setEventListeners();
    setSelectedCountryAndCurrency();
  };

  return {
    initialize: initialize,
    update: update,
    showPane: showPane,
    hidePane: hidePane,
    changeCurrencyFromToastMessage: changeCurrencyFromToastMessage
  };
}();
