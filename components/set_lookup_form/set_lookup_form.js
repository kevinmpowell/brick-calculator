'use strict';
BC.SetLookupForm = function() {
  const formId = 'bc-set-lookup-form',
        setNumberFieldId = "bc-set-lookup-form__set-number-input",
        purchasePriceFieldId = "bc-set-lookup-form__purchase-price-input",
        taxRateSelector = ".bc-set-lookup-form__tax-message",
        taxRateAmountSelector = ".bc-set-lookup-form__tax-amount",
        taxRateVisibleClass = "bc-set-lookup-form__tax-message--visible";

  let form,
      setNumber,
      purchasePrice,
      taxRateAmount,
      taxRate,
      currencySymbol;

  function handleFormSubmit(e) {
    e.preventDefault();
    const formattedPurchasePrice = BC.Utils.currencyToFloat(purchasePrice.value);
    if (isNaN(formattedPurchasePrice)) {
      alert("Invalid purchase price. Please use only numbers and periods for decimal points.");
    } else {
      BC.Values.calculate(setNumber.value, formattedPurchasePrice);
      document.activeElement.blur();
    }
  }

  function setTaxRateDisplay(userSettings) {
    if (userSettings !== null && userSettings.plus_member && userSettings.taxRate) {
      taxRateAmount.innerHTML = userSettings.taxRate;
      taxRate.classList.add(taxRateVisibleClass);
    } else {
      taxRateAmount.innerHTML = '';
      taxRate.classList.remove(taxRateVisibleClass);
    }
  }

  function updateFormDisplayForSignedInUser() {
    const userSettings = BC.App.getUserSettings();
    setTaxRateDisplay(userSettings);
  }

  function changePurchasePriceInputType(country) {
    if (BC.Utils.decimalPointCountryCodes.indexOf(country) === -1) {
      // The selected country doesn't use decimal points for decimal separators, switch the input type from 'number' to 'text' so the numbers can validate
      purchasePrice.setAttribute('type', 'text');
    } else {
      purchasePrice.setAttribute('type', 'number');
    }
  }

  function handleCurrencyUpdate() {
    const currency = BC.Utils.getFromLocalStorage(localStorageKeys.currency) || "USD",
          country = BC.Utils.getFromLocalStorage(localStorageKeys.country) || "US",
          symbolAndPosition = BC.Utils.getCurrencySymbolAndPositionForCurrencyAndCountry(currency, country);

    changePurchasePriceInputType(country);
    updatePurchasePriceCurrencySymbol(symbolAndPosition.symbol);
  }

  function updatePurchasePriceCurrencySymbol(symbol) {
    currencySymbol.textContent = symbol;
  }

  function setEventListeners() {
    form.addEventListener("submit", handleFormSubmit);
    document.addEventListener(customEvents.userSignedIn, updateFormDisplayForSignedInUser);
    document.addEventListener(customEvents.userSignedOut, updateFormDisplayForSignedInUser);
    document.addEventListener(customEvents.currencyUpdated, handleCurrencyUpdate);
  }

  const initialize = function initialize() {
    form = document.getElementById(formId);
    setNumber = document.getElementById(setNumberFieldId);
    purchasePrice = document.getElementById(purchasePriceFieldId);
    currencySymbol = purchasePrice.parentNode.querySelector(".bc-form-input-prefix");
    taxRate = form.querySelector(taxRateSelector);
    taxRateAmount = form.querySelector(taxRateAmountSelector);
    handleCurrencyUpdate();
    setEventListeners();
  }

  return {
    initialize: initialize
  }
}();
