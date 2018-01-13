'use strict';
var BC = BC || {};
let setDB;

const ebaySellingFeePercentage = .13, // TODO: Get this from a lookup
      oneMinute = 60000, // in milliseconds
      threeMinutes = oneMinute * 3, // in milliseconds
      oneHour = oneMinute * 60,
      currentDomain = window.location.hostname,
      authTokenKeyName = 'bcUserAuthToken',
      userSettingsKeyName = 'bcUserSettings',
      apiMapping = {
        'localhost': 'http://localhost:5000',
        'kevinmpowell.github.io': 'https://brickulator-api.herokuapp.com'
      },
      apiDomain = apiMapping[currentDomain],
      customEvents = {
        userSignedIn: 'bc-user-signed-in'
      }; // in milliseconds


      // Headers and params are optional
      // makeRequest({
      //   method: 'GET',
      //   url: 'http://example.com'
      // })
      // .then(function (datums) {
      //   return makeRequest({
      //     method: 'POST',
      //     url: datums.url,
      //     params: {
      //       score: 9001
      //     },
      //     headers: {
      //       'X-Subliminal-Message': 'Upvote-this-answer'
      //     }
      //   });
      // })
      // .catch(function (err) {
      //   console.error('Augh, there was an error!', err.statusText);
      // });

BC.App = function() {
  function setSignedInState() {
    BC.Utils.validateAuthToken().then(function(){
      BC.Utils.broadcastEvent(customEvents.userSignedIn);
    }, function() {
      BC.Overlay.show("Not currently signed in", "This is an annoying message and should not be shown on page load.", true);
    });
  }

  const initialize = function initialize() {
    setSignedInState();
  }

  return {
    initialize: initialize
  };
}();

BC.API = function() {
  const makeRequest = function makeRequest (opts) {
    const apiUrl = apiDomain + opts.url;
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open(opts.method, apiUrl);
      xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          resolve(xhr.response);
        } else {
          reject({
            status: this.status,
            statusText: xhr.statusText
          });
        }
      };
      xhr.onerror = function () {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      };
      if (opts.headers) {
        Object.keys(opts.headers).forEach(function (key) {
          xhr.setRequestHeader(key, opts.headers[key]);
        });
      }
      var params = opts.params;
      // We'll need to stringify if we've been given an object
      // If we have a string, this is skipped.
      if (params && typeof params === 'object') {
        params = Object.keys(params).map(function (key) {
          return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
        }).join('&');
      }
      xhr.send(params);
    });
  }

  return {
    makeRequest: makeRequest
  }
}();

BC.Utils = function() {
  const checkAuthTokenEndpoint = '/auth/validate-token';

  const formatCurrency = function formatCurrency(number) {
    return number.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  const getPayPalTransactionFee = function getPayPalTransactionFee(finalValue) {
    const payPalTransactionPercent = 2.9,
          payPalPerTransactionCharge = 0.3;
    return ((payPalTransactionPercent / 100) * finalValue) + payPalPerTransactionCharge;
  }

  const getBrickOwlSellerFees = function getBrickOwlSellerFees(finalValue) {
    const brickOwlCommissionPercent = 2.5,
          payPalTransactionFee = getPayPalTransactionFee(finalValue),
          fee = ((brickOwlCommissionPercent / 100) * finalValue) + payPalTransactionFee;
    return fee;
  }

  const saveToLocalStorage = function saveToLocalStorage(key, value) {
    if (typeof value !== "string") {
      value = JSON.stringify(value);
    }
    localStorage.setItem(key, value);
  }

  const getFromLocalStorage = function getFromLocalStorage(key) {
    let value = localStorage.getItem(key);
    try {
      value = JSON.parse(value);
    } catch(e) {
      // Eat the JSON.parse failure, just return the value
      // console.log("Value wasn't JSON, just returning as is.");
    }
    return value;
  }

  const validateAuthToken = function validateAuthToken() {
    const storedToken = getFromLocalStorage(authTokenKeyName);
    let haveValidToken = false;

    if (storedToken !== null) {
      return BC.API.makeRequest({
          method: 'GET', 
          url: '/auth/validate-token', 
          headers:{
            'Authorization': storedToken
          }});
      // TODO, maybe wire up default promise.then failure?
    } else {
      broadcastEvent('bc-auth-token-invalid');
      return Promise.reject(new Error('Stored Token does not exist'));
    }
  }

  const broadcastEvent = function broadcastEvent(eventName, data, element) {
    data = typeof data !== 'undefined' ? data : {};
    element = typeof element !== 'undefined' ? element : document;

    const event = new CustomEvent(eventName, {detail: data});
    element.dispatchEvent(event);
  }

  return {
    formatCurrency: formatCurrency,
    getBrickOwlSellerFees: getBrickOwlSellerFees,
    saveToLocalStorage: saveToLocalStorage,
    getFromLocalStorage: getFromLocalStorage,
    validateAuthToken: validateAuthToken,
    broadcastEvent: broadcastEvent
  }
}();

BC.SetDatabase = function() {
  const loadingSpinner = document.querySelector(".bc-spinner--loading-set-data"),
        loadingSpinnerVisibleClass = "bc-spinner--visible",
        setDataCachedMessage = document.querySelector(".bc-lookup-set-data-status-message"),
        setDataCachedMessageHiddenClass = "bc-lookup-set-data-status-message--hidden";
  function saveSetDBToLocalStorage(rawJSON) {
    localStorage.clear();
    localStorage.setItem("BCSetDB", rawJSON);
  }

  function showLoadingSpinner() {
    loadingSpinner.classList.add(loadingSpinnerVisibleClass);
    setDataCachedMessage.classList.add(setDataCachedMessageHiddenClass);
  }

  function hideLoadingSpinner() {
    loadingSpinner.classList.remove(loadingSpinnerVisibleClass);
    setDataCachedMessage.classList.remove(setDataCachedMessageHiddenClass);
  }

  const retrieveFreshSetData = function retrieveFreshSetData() {
    var request = new XMLHttpRequest();

    showLoadingSpinner();
    try {
      request.open('GET', apiDomain + '/lego_sets', true);
      request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          // Success!
          var data = JSON.parse(request.responseText);
          data.dataRetrieved = Date.now();
          saveSetDBToLocalStorage(JSON.stringify(data));
          setDB = data;
          BC.Autocomplete.updateDataset(setDB);
          hideLoadingSpinner();
          updateSetDataTimestamp(setDB.dataRetrieved);
          BC.Overlay.hide();
        } else {
          // We reached our target server, but it returned an error
          // alert("Could not retrieve set data - connection successful, but data failed");
          if (setDB !== null) {
            // If we've got localStorage data we're in good shape, move along
            updateSetDataTimestamp(setDB.dataRetrieved);
          } else {
            // No local storage data and data retrieval failed.
            BC.Overlay.show("Oh Noes!", "Something went wrong on our end. It's us, not you. We'll get on that right away.");
            // TODO: Notify someone!
          }
          hideLoadingSpinner();
        }
      };

      request.onerror = function() {
        // There was a connection error of some sort
        // alert("Could not retrieve set data - connection error");
        if (setDB !== null) {
          // If we've got localStorage data we're in good shape, move along
          updateSetDataTimestamp(setDB.dataRetrieved);
        } else {
          // No local storage data and data retrieval failed.
          BC.Overlay.show("Oh Noes!", "Something went wrong on our end. It's us, not you. We'll get on that right away.");
          // TODO: Notify someone!
        }
        hideLoadingSpinner();
      };

      request.send();
    } catch (e) {
      // console.log(e);
      if (setDB !== null) {
        // Something went wrong with the data request, but we've got localStorage data, so move along
        updateSetDataTimestamp(setDB.dataRetrieved);
        BC.Overlay.hide();
      }
      hideLoadingSpinner();
    }
  }

  function updateSetDataTimestamp(timestamp) {
    document.querySelector(".bc-lookup-set-data-timestamp").setAttribute("datetime", timestamp);
    timeago().render(document.querySelectorAll('.bc-lookup-set-data-timestamp'));
  }

  const initialize = function initialize() {
    setDB = localStorage.getItem("BCSetDB");
    setDB = JSON.parse(setDB);
    if (setDB === null) {
      // If there's no data to work with, put up the overlay so the form can't be used
      BC.Overlay.show("Sit Tight.", "We're getting the freshest set values just for you!")
    }
    // if (1 === 1) {
    if (setDB === null || typeof setDB.dataRetrieved === 'undefined' || (Date.now() - setDB.dataRetrieved) > oneHour ) { // If it's been more than an hour get fresh data
      retrieveFreshSetData();
    } else {
      updateSetDataTimestamp(setDB.dataRetrieved);
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

    if (setData) {
      BC.SetSummary.update(setData);
      BC.PortletLayout.updateAllPortletValues(setData, purchasePrice);

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

function ready(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(function(){
  BC.Overlay.initialize();
  BC.SetDatabase.initialize();
  BC.Values.initialize();
  BC.SetSummary.initialize();
  BC.PortletLayout.initialize();
  BC.PortletLayout.buildLayout();
  BC.SignUpForm.initialize();
  BC.SiteMenu.initialize();
  BC.UserSettingsPane.initialize();
  BC.SignInForm.initialize();
  BC.SetLookupForm.initialize();
  BC.App.initialize(); // Check auth token, broadcast user state events
});
