'use strict';
BC.UserSettingsPane = function() {
  const settingsPaneSelector = '.bc-user-settings-pane',
        userTaxRateFieldId = 'bc-user-settings-taxRate',
        paneVisibleClass = 'bc-user-settings-pane--visible',
        hidePaneSelector = '.bc-user-settings-pane-hide-trigger',
        showPaneSelector = '.bc-user-settings-pane-show-trigger',
        settingsFormName = 'bcUserSettings',
        countrySelectName = 'country',
        currencySelectName = 'currency',
        topWorldCurrencies = ["USD","EUR","JPY","GBP","CHF","CAD","AUD"];

  let taxRate,
      settingsForm,
      settingsPane,
      showPaneTriggers,
      hidePaneTriggers,
      countrySelect,
      currencySelect,
      currencyToastMessage;

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

  function handleSettingsFormSubmit(e) {
    e.preventDefault();
    const country = countrySelect.value,
          currency = currencySelect.value;

    saveAndUpdateCurrencyAndCountry(country, currency);
    BC.ToastMessage.create('Your Settings have been saved.', 'success');

    hidePane();
    BC.SiteMenu.hideMenu();
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
    countryCodes.sort().  forEach(function(c){
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
    settingsForm = document[settingsFormName];
    countrySelect = settingsForm[countrySelectName];
    currencySelect = settingsForm[currencySelectName];
    buildCountrySelector();
    buildCurrencySelector();
    update();
    setEventListeners();
    setSelectedCountryAndCurrency();
  }

  return {
    initialize: initialize,
    update: update,
    showPane: showPane,
    hidePane: hidePane,
    changeCurrencyFromToastMessage: changeCurrencyFromToastMessage
  }
}();
