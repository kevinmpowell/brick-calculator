'use strict';
var BC = BC || {};
let setDB;

const ebaySellingFeePercentage = .13, // TODO: Get this from a lookup
      oneMinute = 60000, // in milliseconds
      threeMinutes = oneMinute * 3, // in milliseconds
      oneHour = oneMinute * 60,
      currentYear = (new Date()).getFullYear(),
      numberOfYearsToRetrieve = 5,
      currentDomain = window.location.hostname,
      localStorageKeys = {
        authToken: 'bcUserAuthToken',
        userSettings: 'bcUserSettings'
      },
      apiMapping = {
        'localhost': 'http://localhost:5000',
        'kevinmpowell.github.io': 'https://brickulator-api.herokuapp.com'
      },
      apiDomain = apiMapping[currentDomain],
      customEvents = {
        userSignedIn: 'bc-user-signed-in',
        userSignedOut: 'bc-user-signed-out'
      };

BC.App = function() {
  const userSignedInClass = 'bc--user-signed-in',
        userSignedOutClass = 'bc--user-signed-out',
        plusMemberSignedInClass = 'bc--plus-member-signed-in';
  let body;

  function setBodyClass(userState) {
    const userSettings = BC.App.getUserSettings();

    if (userState === 'signedIn') {
      body.classList.remove(userSignedOutClass);
      body.classList.add(userSignedInClass); 
    } else {
      body.classList.remove(userSignedInClass); 
      body.classList.add(userSignedOutClass);
    }

    if (userSettings !== null && userSettings.plus_member) {
      body.classList.add(plusMemberSignedInClass);
    } else {
      body.classList.remove(plusMemberSignedInClass);
    }
  }

  const getUserSettings = function getUserSettings() {
    const userSettingsRaw = localStorage.getItem(localStorageKeys.userSettings);
    if (userSettingsRaw === null) {
      return null;
    } else {
      return JSON.parse(BC.Utils.stringDecoder(userSettingsRaw)).preferences;
    }
  }

  const setSignedInState = function setSignedInState() {
    BC.Utils.validateAuthToken().then(function(){
      setBodyClass('signedIn');
      BC.Utils.broadcastEvent(customEvents.userSignedIn);
    }, function() {
      setBodyClass('signedOut');
      BC.Utils.broadcastEvent(customEvents.userSignedOut);
      // BC.Overlay.show("Not currently signed in", "This is an annoying message and should not be shown on page load.", true);
    });
  }

  const signOut = function signOut() {
    BC.Utils.removeFromLocalStorage(localStorageKeys.authToken);
    BC.Utils.removeFromLocalStorage(localStorageKeys.userSettings);
    setSignedInState();
  }

  const initialize = function initialize() {
    body = document.body;
    setSignedInState();
  }

  return {
    initialize: initialize,
    signOut: signOut,
    setSignedInState: setSignedInState,
    getUserSettings: getUserSettings
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

      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      if (opts.method === 'POST') {
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      }
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
  const checkAuthTokenEndpoint = '/auth/validate-token',
        encodedNumberMap = {
          4: 1,
          5: 2,
          6: 3,
          7: 4,
          8: 5,
          9: 6,
          1: 7,
          2: 8,
          3: 9
        };

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

  const getBricklinkSellerFees = function getBricklinkSellerFees(finalValue) {
    const range0_500Percent = 3,
          range500_1000Percent = 2,
          range1000AndUpPercent = 1,
          payPalTransactionFee = getPayPalTransactionFee(finalValue);

    let fee;

    if (finalValue > 1000) {
      fee = 25 + ((finalValue - 1000) * (range1000AndUpPercent / 100));
    } else if (finalValue > 500) {
      fee = 15 + ((finalValue - 500) * (range500_1000Percent / 100));
    } else {
      fee = finalValue * (range0_500Percent / 100);
    }

    return fee + payPalTransactionFee;
  }

  const getEbaySellerFees = function getEbaySellerFees(finalValue) {
    // TODO: Actually make this work
    const ebayCommissionPercent = 10,
          payPalTransactionFee = getPayPalTransactionFee(finalValue),
          fee = Math.min(((ebayCommissionPercent / 100) * finalValue), 750) + payPalTransactionFee;
    return fee;
  }

  const saveToLocalStorage = function saveToLocalStorage(key, value) {
    if (typeof value !== "string") {
      value = JSON.stringify(value);
    }
    localStorage.setItem(key, value);
  }

  const removeFromLocalStorage = function removeFromLocalStorage(key) {
    localStorage.removeItem(key);
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
    const storedToken = getFromLocalStorage(localStorageKeys.authToken);
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

  const stringDecoder = function stringDecoder(s)
   {
      return (s ? s : this).split('').map(function(_)
       {
          if (_.match(/[1-9]/)) {
            return _.replace(/[1-9]/g, function(match){
              return encodedNumberMap[match];
            });
          }
          if (!_.match(/[A-Za-z]/)) return _;
          var c = Math.floor(_.charCodeAt(0) / 97);
          var k = (_.toLowerCase().charCodeAt(0) - 83) % 26 || 26;
          return String.fromCharCode(k + ((c == 0) ? 64 : 96));
       }).join('');
   }

  return {
    formatCurrency: formatCurrency,
    getBricklinkSellerFees: getBricklinkSellerFees,
    getBrickOwlSellerFees: getBrickOwlSellerFees,
    getEbaySellerFees: getEbaySellerFees,
    saveToLocalStorage: saveToLocalStorage,
    getFromLocalStorage: getFromLocalStorage,
    removeFromLocalStorage: removeFromLocalStorage,
    validateAuthToken: validateAuthToken,
    broadcastEvent: broadcastEvent,
    stringDecoder: stringDecoder
  }
}();

BC.SetDatabase = function() {
  const loadingSpinner = document.querySelector(".bc-spinner--loading-set-data"),
        loadingSpinnerVisibleClass = "bc-spinner--visible",
        setDataCachedMessage = document.querySelector(".bc-lookup-set-data-status-message"),
        setDataCachedMessageHiddenClass = "bc-lookup-set-data-status-message--hidden";
  function saveSetDBToLocalStorage(rawJSON) {
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


  const getDecodedSetDatabase = function getDecodedSetDatabase() {
    const encDB = BC.Utils.getFromLocalStorage("BCSetDB");
    let response;
    if (encDB === null || typeof encDB === 'undefined') {
      response = null
    } else {
      response = JSON.parse(BC.Utils.stringDecoder(encDB));
    }
    return response;
  }

  const getSetDBDataRetrievedTimestamp = function getSetDBDataRetrievedTimestamp() {
    return BC.Utils.getFromLocalStorage("BCSetDataRetrieved");
  }

  const retrieveFreshSetData = function retrieveFreshSetData(year) {
    year = typeof year === 'undefined' ? currentYear : year;
    console.log("Retrieving set data for " + year);
    var request = new XMLHttpRequest();

    showLoadingSpinner();
    try {
      request.open('GET', apiDomain + '/lego_sets?start_year=' + year, true);
      request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          // Success!
          BC.Utils.saveToLocalStorage("BCSetDB", JSON.stringify(request.responseText));
          BC.Utils.saveToLocalStorage("BCSetDataRetrieved", Date.now());
          setDB = getDecodedSetDatabase();
          BC.Autocomplete.updateDataset(setDB);
          BC.Overlay.hide();

          if (!((year - 1) <= (currentYear - numberOfYearsToRetrieve))) {
            // Retrieve another set of data starting at one year back, call recursively for numberOfYearsToRetrieve, for example first get 2018 data, then 2017-2018 data, then 2016-2018 data, replacing local storage each time
            const nextYear = year - 1;
            retrieveFreshSetData(nextYear);
          } else {
            hideLoadingSpinner();
            updateSetDataTimestamp(getSetDBDataRetrievedTimestamp());
          }
        } else {
          // We reached our target server, but it returned an error
          // alert("Could not retrieve set data - connection successful, but data failed");
          if (setDB !== null) {
            // If we've got localStorage data we're in good shape, move along
            updateSetDataTimestamp(getSetDBDataRetrievedTimestamp());
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
          updateSetDataTimestamp(getSetDBDataRetrievedTimestamp());
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
        updateSetDataTimestamp(getSetDBDataRetrievedTimestamp());
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
    setDB = getDecodedSetDatabase();
    const dataRetrieved = getSetDBDataRetrievedTimestamp();
    if (setDB === null) {
      // If there's no data to work with, put up the overlay so the form can't be used
      BC.Overlay.show("Sit Tight.", "We're getting the freshest set values just for you!")
    }
    // if (1 === 1) {
    if (setDB === null || typeof dataRetrieved === 'undefined' || (Date.now() - dataRetrieved) > oneHour ) { // If it's been more than an hour get fresh data
      retrieveFreshSetData();
    } else {
      updateSetDataTimestamp(dataRetrieved);
    }
  }

  return {
    initialize: initialize,
    retrieveFreshSetData: retrieveFreshSetData,
    getDecodedSetDatabase: getDecodedSetDatabase
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
  BC.AdHeader.initialize();
  BC.ToastMessage.initialize();
  BC.NewsletterSignUpForm.initialize();
  BC.App.initialize(); // Check auth token, broadcast user state events
});
