'use strict';
BC.SetSummary = function() {
  const numberSelector = '.bc-set-summary__number',
        yearSelector = '.bc-set-summary__year',
        titleSelector = '.bc-set-summary__title',
        pcsSelector = '.bc-set-summary__pcs-count',
        msrpSelector = '.bc-set-summary__msrp-value';

  let number,
      year,
      title,
      pcs,
      msrp,
      currencyCode = "USD";

  function handleCurrencyUpdate() {
    currencyCode = BC.Utils.getFromLocalStorage(localStorageKeys.currency) || "USD";
  }

  function setEventListeners() {
    document.addEventListener(customEvents.currencyUpdated, handleCurrencyUpdate);
  }

  const initialize = function initialize() {
    number = document.querySelector(numberSelector);
    year = document.querySelector(yearSelector);
    title = document.querySelector(titleSelector);
    pcs = document.querySelector(pcsSelector);
    msrp = document.querySelector(msrpSelector);
    handleCurrencyUpdate();
    setEventListeners();
  }

  const update = function update(setData) {
    const setNumber = typeof setData.nv === 'undefined' ? setData.n : setData.n + '-' + setData.nv;
    let msrpString;
    if (currencyCode !== 'USD') {
      msrpString = parseFloat(setData.msrp, 10) > 0 ? "$" + setData.msrp + " USD" : "Unknown";
    } else {
      msrpString = parseFloat(setData.msrp, 10) > 0 ? "$" + setData.msrp : "Unknown";
    }
    number.innerHTML = setNumber;
    year.innerHTML = setData.y;
    title.innerHTML = setData.t;
    pcs.innerHTML = setData.pcs;
    msrp.innerHTML = msrpString;
  }

  return {
    initialize: initialize,
    update: update
  }
}();
