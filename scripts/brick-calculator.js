'use strict';
var BC = BC || {};
let setDB;

const ebaySellingFeePercentage = .13, // TODO: Get this from a lookup
      oneMinute = 60000; // in milliseconds

BC.SetDatabase = function() {
  function saveSetDBToLocalStorage() {
    localStorage.setItem("BCSetDB", JSON.stringify(setDB));
  }

  function retrieveFreshSetData() {
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:3000/lego_sets', true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        alert("SUCCESS!");
        // Success!
        var data = JSON.parse(request.responseText);
        setDB = data;
        setDB.dataUpdated = Date.now();
        saveSetDBToLocalStorage();
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
    if (1 === 1) {
    // if (setDB === null || (Date.now() - JSON.parse(setDB).dataUpdated) > oneMinute ) { // If it's been more than a minute get fresh data
      // retrieve the setDB from the API
      retrieveFreshSetData();
      // setDB = {
      //   dataUpdated: Date.now(),
      //   41591: {
      //     number: 41591,
      //     title: "Black Widow BrickHeadz",
      //     MSRP: 9.99,
      //     ebAN: 7,
      //     ebLN: 2,
      //     ebHN: 16,
      //     blAN: 7,
      //     blLN: 3,
      //     blHN: 20 
      //   },
      //   75192: {
      //     number: 75192,
      //     title: "UCS Millenium Falcon (2nd Edition)",
      //     MSRP: 799.99,
      //     ebAN: 1249,
      //     ebLN: 905.3,
      //     ebHN: 2349.99,
      //     blAN: 1050,
      //     blLN: 855,
      //     blHN: 1600 
      //   }
      // };

      saveSetDBToLocalStorage();
    } else {
      setDB = JSON.parse(setDB);
    }
  }

  return {
    initialize: initialize
  };
}();

BC.Values = function() {
  const setTitleFieldId = "bc-results__set-title",
        ebayAvgFieldId = "ebay-avg",
        ebaySellingFeesFieldId = "ebay-selling-fees",
        ebayPurchasePriceFieldId = "ebay-purchase-price",
        ebayProfitFieldId = "ebay-profit",
        showLookupFormClass = "bc-show-lookup-form";

  function formatCurrency(number) {
    return number.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  function calculate(setNumber, purchasePrice) {
    const setData = setDB[setNumber];

    if (setData) {
      const setTitleField = document.getElementById(setTitleFieldId),
            ebayAvgField = document.getElementById(ebayAvgFieldId),
            ebaySellingFeesField = document.getElementById(ebaySellingFeesFieldId),
            ebayPurchasePriceField = document.getElementById(ebayPurchasePriceFieldId),
            ebayProfitField = document.getElementById(ebayProfitFieldId);
      
      setTitleField.value = setData.title;
      ebayPurchasePriceField.value = formatCurrency(parseFloat(purchasePrice));
  
      if (setData.ebAN) {
        ebayAvgField.value = formatCurrency(setData.ebAN);
        ebaySellingFeesField.value = formatCurrency(setData.ebAN * ebaySellingFeePercentage);
        ebayProfitField.value = formatCurrency(setData.ebAN - (setData.ebAN * ebaySellingFeePercentage) - parseFloat(purchasePrice));
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
