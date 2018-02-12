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
      currencySelect;

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
    const countryCode = BC.App.getCountry(),
          currencyCode = BC.Utils.countryToCurrencyMap[countryCode];
    countrySelect.value = countryCode;
    currencySelect.value = currencyCode;
  }

  function setEventListeners() {
    document.addEventListener(customEvents.userSignedIn, update);
    document.addEventListener(customEvents.userSignedOut, update);
    document.addEventListener(customEvents.locationUpdated, setSelectedCountryAndCurrency);
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
  }

  return {
    initialize: initialize,
    update: update,
    showPane: showPane,
    hidePane: hidePane
  }
}();
