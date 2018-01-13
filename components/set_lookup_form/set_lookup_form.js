'use strict';
BC.SetLookupForm = function() {
  const formId = 'bc-value-lookup-form',
        setNumberFieldId = "bc-value-lookup-form__set-number-input",
        purchasePriceFieldId = "bc-value-lookup-form__purchase-price-input",
        taxRateSelector = ".bc-set-lookup-form__tax-message",
        taxRateAmountSelector = ".bc-set-lookup-form__tax-amount",
        taxRateVisibleClass = "bc-set-lookup-form__tax-message--visible";

  let form,
      setNumber,
      purchasePrice,
      taxRateAmount,
      taxRate;

  function handleFormSubmit(e) {
    e.preventDefault();
    BC.Values.calculate(setNumber.value, purchasePrice.value);
  }

  function setTaxRateDisplay(userSettings) {
    if (userSettings.plus_member && userSettings.taxRate) {
      taxRateAmount.innerHTML = userSettings.taxRate;
      taxRate.classList.add(taxRateVisibleClass);
    } else {
      taxRateAmount.innerHTML = '';
      taxRate.classList.remove(taxRateVisibleClass);
    }
  }

  function updateFormDisplayForSignedInUser() {
    const userSettings = BC.Utils.getFromLocalStorage(localStorageKeys.userSettings);
    if (userSettings !== null) {
      setTaxRateDisplay(userSettings);
    }
  }

  function setEventListeners() {
    form.addEventListener("submit", handleFormSubmit);
    document.addEventListener(customEvents.userSignedIn, updateFormDisplayForSignedInUser);
  }

  const initialize = function initialize() {
    form = document.getElementById(formId);
    setNumber = document.getElementById(setNumberFieldId);
    purchasePrice = document.getElementById(purchasePriceFieldId);
    taxRate = form.querySelector(taxRateSelector);
    taxRateAmount = form.querySelector(taxRateAmountSelector);
    setEventListeners();
  }

  return {
    initialize: initialize
  }
}();
