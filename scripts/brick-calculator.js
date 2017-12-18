'use strict';
var BC = BC || {};
let setDB;

const ebaySellingFeePercentage = .13, // TODO: Get this from a lookup
      oneMinute = 60000; // in milliseconds

BC.SetDatabase = function() {
  let initialize = function initialize() {
    setDB = localStorage.getItem("BCSetDB");
    console.log(Date.now() - JSON.parse(setDB).dataUpdated);
    if (setDB === null || (Date.now() - JSON.parse(setDB).dataUpdated) > oneMinute ) { // If it's been more than a minute get fresh data
      // retrieve the setDB from the API, for now manually set some values here
      setDB = {
        dataUpdated: Date.now(),
        41591: {
          title: "Black Widow",
          MSRP: 9.99,
          ebAN: 7,
          ebLN: 2,
          ebHN: 16,
          blAN: 7,
          blLN: 3,
          blHN: 20 
        },
        75192: {
          title: "UCS Millenium Falcon (2nd Edition)",
          MSRP: 799.99,
          ebAN: 1249,
          ebLN: 905.3,
          ebHN: 2349.99,
          blAN: 1050,
          blLN: 855,
          blHN: 1600 
        }
      };

      localStorage.setItem("BCSetDB", JSON.stringify(setDB));
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
        ebayProfitFieldId = "ebay-profit";

  function calculate(setNumber, purchasePrice) {
    const setData = setDB[setNumber];

    if (setData) {
      console.log(setDB[setNumber]);
      
      const setTitleField = document.getElementById(setTitleFieldId),
            ebayAvgField = document.getElementById(ebayAvgFieldId),
            ebaySellingFeesField = document.getElementById(ebaySellingFeesFieldId),
            ebayPurchasePriceField = document.getElementById(ebayPurchasePriceFieldId),
            ebayProfitField = document.getElementById(ebayProfitFieldId);
      

      setTitleField.value = setData.title;
      ebayAvgField.value = setData.ebAN;
      ebaySellingFeesField.value = setData.ebAN * ebaySellingFeePercentage;
      ebayPurchasePriceField.value = purchasePrice;
      ebayProfitField.value = ebayAvgField.value - ebaySellingFeesField.value - ebayPurchasePriceField.value;
    } else {
      alert("Set Number Not Found")
    }
  }

  return {
    calculate: calculate
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
});
