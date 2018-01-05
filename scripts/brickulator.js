'use strict';
var BC = BC || {};
let setDB;

const ebaySellingFeePercentage = .13, // TODO: Get this from a lookup
      oneMinute = 60000, // in milliseconds
      oneHour = 3600000; // in milliseconds

BC.Utils = function() {
  const formatCurrency = function formatCurrency(number) {
    return number.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  return {
    formatCurrency: formatCurrency
  }
}();

BC.SetDatabase = function() {
  const currentDomain = window.location.hostname,
        apiMapping = {
          'localhost': 'http://localhost:5000',
          'kevinmpowell.github.io': 'https://brickulator-api.herokuapp.com'
        };
  console.log(currentDomain);
  function saveSetDBToLocalStorage(rawJSON) {
    localStorage.clear();
    localStorage.setItem("BCSetDB", rawJSON);
  }

  const retrieveFreshSetData = function retrieveFreshSetData() {
    var request = new XMLHttpRequest();
    const apiDomain = apiMapping[currentDomain];

    request.open('GET', apiDomain + '/lego_sets', true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        alert("SUCCESS!");
        // Success!
        var data = JSON.parse(request.responseText);
        data.dataUpdate = Date.now();
        saveSetDBToLocalStorage(JSON.stringify(data));
        setDB = data;
        BC.Autocomplete.updateDataset(setDB);
      } else {
        // We reached our target server, but it returned an error
        alert("Could not retrieve new sets - connection successful, but data failed");
      }
    };

    request.onerror = function() {
      // There was a connection error of some sort
      alert("Could not retrieve new sets - connection error");
    };

    request.send();
  }

  const initialize = function initialize() {
    setDB = localStorage.getItem("BCSetDB");
    setDB = JSON.parse(setDB);
    // if (1 === 1) {
    if (setDB === null || (Date.now() - setDB.dataUpdated) > oneHour ) { // If it's been more than a minute get fresh data
      retrieveFreshSetData();
    }
  }

  return {
    initialize: initialize,
    retrieveFreshSetData: retrieveFreshSetData
  };
}();

BC.Values = function() {
  const setTitleFieldId = "bc-results__set-title",
        ebayAvgFieldId = "ebay-avg",
        ebaySellingFeesFieldId = "ebay-selling-fees",
        ebayPurchasePriceFieldId = "ebay-purchase-price",
        ebayProfitFieldId = "ebay-profit",
        showLookupFormClass = "bc-show-lookup-form";

  function calculate(setNumber, purchasePrice) {
    const setData = setDB[setNumber];
    BC.PortletPricePerPiece.update(setData, purchasePrice);
    BC.PortletPartOutBrickOwl.update(setData, purchasePrice);

    if (setData) {
      const setTitleField = document.getElementById(setTitleFieldId),
            ebayAvgField = document.getElementById(ebayAvgFieldId),
            ebaySellingFeesField = document.getElementById(ebaySellingFeesFieldId),
            ebayPurchasePriceField = document.getElementById(ebayPurchasePriceFieldId),
            ebayProfitField = document.getElementById(ebayProfitFieldId);
      
      setTitleField.value = setData.t;
      ebayPurchasePriceField.value = BC.Utils.formatCurrency(parseFloat(purchasePrice));
  
      if (setData.ebAN) {
        ebayAvgField.value = BC.Utils.formatCurrency(setData.ebAN);
        ebaySellingFeesField.value = BC.Utils.formatCurrency(setData.ebAN * ebaySellingFeePercentage);
        ebayProfitField.value = BC.Utils.formatCurrency(setData.ebAN - (setData.ebAN * ebaySellingFeePercentage) - parseFloat(purchasePrice));
      }

      showValues();
    } else {
      alert("Set Number Not Found")
    }
  }

  function showValues() {
    document.body.classList.add("bc--show-values");
  }

  function hideValues() {
    document.body.classList.remove("bc--show-values");
  }

  function handleShowLookupFormClick(e) {
    e.preventDefault();
    hideValues();
  }

  function addEventListeners() {
    const showLookupFormTriggers = Array.from(document.querySelectorAll(`.${showLookupFormClass}`));

    showLookupFormTriggers.forEach(function(t){
      t.addEventListener("click", handleShowLookupFormClick);
    });
  }

  function initialize() {
    addEventListeners();
  }

  return {
    calculate: calculate,
    initialize: initialize
  }
}();

BC.Form = function() {
  const formId = "bc-value-lookup-form",
        setNumberFieldId = "bc-value-lookup-form__set-number-input",
        purchasePriceFieldId = "bc-value-lookup-form__purchase-price-input";

  function handleFormSubmit(e) {
    e.preventDefault();
    const setNumber = document.getElementById(setNumberFieldId).value,
          purchasePrice = document.getElementById(purchasePriceFieldId).value;
    BC.Values.calculate(setNumber, purchasePrice);
  }

  function setEventListeners() {
    const form = document.getElementById(formId);
    form.addEventListener("submit", handleFormSubmit);
  }


  let initialize = function initialize() {
    setEventListeners();
  };

  return {
    initialize: initialize
  }
}();



function ready(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(function(){
  BC.SetDatabase.initialize();
  BC.Form.initialize();
  BC.Values.initialize();
});
