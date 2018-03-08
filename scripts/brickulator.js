'use strict';
var BC = BC || {};
const brickulatorAPIVersionNumber = '1.0.0';

const ebaySellingFeePercentage = .13, // TODO: Get this from a lookup
      oneMinute = 60000, // in milliseconds
      threeMinutes = oneMinute * 3, // in milliseconds
      oneHour = oneMinute * 60,
      currentYear = (new Date()).getFullYear(),
      numberOfYearsToRetrieve = 5,
      currentDomain = window.location.hostname,
      localStorageKeys = {
        authToken: 'bcUserAuthToken',
        userSettings: 'bcUserSettings',
        setDB: 'BCSetDB',
        setDBTimestamp: 'BCSetDataRetrieved',
        apiVersionNumber: 'BCSetDBVersionNumber',
        cookieConsent: 'BCCookieConsent',
        currency: 'BCCurrency',
        country: 'BCCountry',
        lookupCount: 'BCadfsdfjek'
      },
      apiMapping = {
        'localhost': 'https://localhost:5000',
        '10.0.1.15': 'http://10.0.1.15:5000',
        'kevinmpowell.github.io': 'https://brickulator-api.herokuapp.com'
      },
      apiDomain = apiMapping[currentDomain],
      customEvents = {
        userSignedIn: 'bc-user-signed-in',
        userSignedOut: 'bc-user-signed-out',
        locationUpdated: 'bc-location-updated',
        currencyUpdated: 'bc-currency-updated',
        preferencesUpdated: 'bc-preferences-updated',
        interstitialComplete: 'bc-interstitial-complete'
      },
      EUCountryCodes = ['BE', 'BG', 'CZ', 'DK', 'DE', 'EE', 'IE', 'EL', 'ES', 'FR', 'IT', 'CY', 'LV', 'UK', 'LT', 'LU', 'HU', 'MT', 'NL', 'AT', 'PL', 'PT', 'RO', 'SI', 'SK', 'FI', 'SE', 'GB'];

BC.App = function() {
  const userSignedInClass = 'bc--user-signed-in',
        userSignedOutClass = 'bc--user-signed-out',
        plusMemberSignedInClass = 'bc--plus-member-signed-in',
        plusMemberTaxesEnabledClass = 'bc--plus-member-taxes-enabled';
  let body,
      country = "US",
      language = "en",
      userSignedIn = false;

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

  function setBodyClassesForPreferences() {
    const userSettings = BC.App.getUserSettings();

    if (userSettings !== null && userSettings.plus_member && userSettings.enableTaxes) {
      body.classList.add(plusMemberTaxesEnabledClass);
    } else {
      body.classList.remove(plusMemberTaxesEnabledClass);
    }
  }

  function geoIpLookup() {
    return new Promise(function(resolve, reject){
      const xhr = new XMLHttpRequest();
      xhr.open("GET", 'https://get.geojs.io/v1/ip');
      xhr.onload = () => resolve(xhr.responseText);
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send();
    });
  }

  function countryCodeLookup(ip) {
    // ip = '2.31.255.255'; // Simulate GB IP Address
    return new Promise(function(resolve, reject){
      const xhr = new XMLHttpRequest();
      xhr.open("GET", 'https://get.geojs.io/v1/ip/country/' + ip);
      xhr.onload = () => resolve(xhr.responseText);
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send();
    });
  }

  function setLocation() {
    if (BC.Utils.getFromLocalStorage(localStorageKeys.country) === null) {
      return geoIpLookup().then(countryCodeLookup).then(function(countryCode){
        country = countryCode.trim();
        BC.Utils.broadcastEvent(customEvents.locationUpdated);
      });
    } else {
      return Promise.resolve();
    }
  }

  function showCookieConsentMessage() {
    const cookieConsentGiven = BC.Utils.getFromLocalStorage(localStorageKeys.cookieConsent);

    if (!cookieConsentGiven && EUCountryCodes.includes(country)) {
      BC.ToastMessage.create('This site uses cookies to improve the user experience. By using this site, you are agreeing to our use of cookies.', false, false, true, BC.App.storeCookieUsageAuthorization);
    }

    if (!EUCountryCodes.includes(country)) {
      // If the user's locale is not in the EU, always accept cookie usage and store it in localStorage to improve performance on subsequent visits
      storeCookieUsageAuthorization();
    }
  }

  function setEventListeners() {
    document.addEventListener(customEvents.preferencesUpdated, setBodyClassesForPreferences);
  }

  const storeCookieUsageAuthorization = function storeCookieUsageAuthorization() {
    BC.Utils.saveToLocalStorage(localStorageKeys.cookieConsent, true);
  };

  const getUserSettings = function getUserSettings() {
    const userSettingsRaw = localStorage.getItem(localStorageKeys.userSettings);
    if (userSettingsRaw === null) {
      return null;
    } else {
      return JSON.parse(BC.Utils.stringDecoder(userSettingsRaw)).preferences;
    }
  };

  const clearUserSettings = function clearUserSettings() {
    localStorage.removeItem(localStorageKeys.userSettings);
  };

  const clearAuthToken = function clearAuthToken() {
    localStorage.removeItem(localStorageKeys.authToken);
  };

  const setSignedInState = function setSignedInState() {
    BC.Utils.validateAuthToken()
    .then(function(){
      userSignedIn = true;
      setBodyClass('signedIn');
      BC.Utils.broadcastEvent(customEvents.userSignedIn);
    })
    .catch(function() {
      userSignedIn = false;
      setBodyClass('signedOut');
      BC.Utils.broadcastEvent(customEvents.userSignedOut);
      clearAuthToken();
      clearUserSettings();
    });
  };

  const signOut = function signOut() {
    BC.Utils.removeFromLocalStorage(localStorageKeys.authToken);
    BC.Utils.removeFromLocalStorage(localStorageKeys.userSettings);
    setSignedInState();
  };

  const getCountry = function getCountry() {
    return country;
  };

  const getLanguage = function getLanguage() {
    return language;
  };

  const userIsSignedIn = function userIsSignedIn() {
    return userSignedIn;
  };

  const initialize = function initialize() {
    body = document.body;
    setSignedInState();
    setEventListeners();
    setBodyClassesForPreferences();
    setLocation().then(function(){
      showCookieConsentMessage();
    });
  };

  return {
    initialize: initialize,
    signOut: signOut,
    setSignedInState: setSignedInState,
    getUserSettings: getUserSettings,
    getCountry: getCountry,
    storeCookieUsageAuthorization: storeCookieUsageAuthorization,
    userIsSignedIn: userIsSignedIn
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
      if (opts.method === 'POST' || opts.method === 'PUT') {
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
  };

  return {
    makeRequest: makeRequest
  };
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
        },
        countryToCurrencyMap = {
          "AF": "AFN",
          "AL": "ALL",
          "DZ": "DZD",
          "AS": "USD",
          "AD": "EUR",
          "AO": "AOA",
          "AI": "XCD",
          "AG": "XCD",
          "AR": "ARS",
          "AM": "AMD",
          "AW": "AWG",
          "AU": "AUD",
          "AT": "EUR",
          "AZ": "AZN",
          "BS": "BSD",
          "BH": "BHD",
          "BD": "BDT",
          "BB": "BBD",
          "BY": "BYN",
          "BE": "EUR",
          "BZ": "BZD",
          "BJ": "XOF",
          "BM": "BMD",
          "BT": "INR",
          "BO": "BOB",
          "BQ": "USD",
          "BA": "BAM",
          "BW": "BWP",
          "BV": "NOK",
          "BR": "BRL",
          "IO": "USD",
          "VG": "USD",
          "BN": "BND",
          "BG": "BGN",
          "BF": "XOF",
          "BI": "BIF",
          "CV": "CVE",
          "KH": "KHR",
          "CM": "XAF",
          "CA": "CAD",
          "KY": "KYD",
          "CF": "XAF",
          "TD": "XAF",
          "CL": "CLP",
          "CN": "CNY",
          "HK": "HKD",
          "MO": "MOP",
          "CX": "AUD",
          "CC": "AUD",
          "CO": "COP",
          "KM": "KMF",
          "CG": "XAF",
          "CK": "NZD",
          "CR": "CRC",
          "HR": "HRK",
          "CU": "CUP",
          "CW": "ANG",
          "CY": "EUR",
          "CZ": "CZK",
          "CI": "XOF",
          "KP": "KPW",
          "CD": "CDF",
          "DK": "DKK",
          "DJ": "DJF",
          "DM": "XCD",
          "DO": "DOP",
          "EC": "USD",
          "EG": "EGP",
          "SV": "SVC",
          "GQ": "XAF",
          "ER": "ERN",
          "EE": "EUR",
          "ET": "ETB",
          "FO": "DKK",
          "FJ": "FJD",
          "FI": "EUR",
          "FR": "EUR",
          "GF": "EUR",
          "PF": "XPF",
          "TF": "EUR",
          "GA": "XAF",
          "GM": "GMD",
          "GE": "GEL",
          "DE": "EUR",
          "GH": "GHS",
          "GI": "GIP",
          "GR": "EUR",
          "GL": "DKK",
          "GD": "XCD",
          "GP": "EUR",
          "GU": "USD",
          "GT": "GTQ",
          "GG": "GBP",
          "GN": "GNF",
          "GW": "XOF",
          "GY": "GYD",
          "HT": "HTG",
          "HM": "AUD",
          "VA": "EUR",
          "HN": "HNL",
          "HU": "HUF",
          "IS": "ISK",
          "IN": "INR",
          "ID": "IDR",
          "IR": "IRR",
          "IQ": "IQD",
          "IE": "EUR",
          "IM": "GBP",
          "IL": "ILS",
          "IT": "EUR",
          "JM": "JMD",
          "JP": "JPY",
          "JE": "GBP",
          "JO": "JOD",
          "KZ": "KZT",
          "KE": "KES",
          "KI": "AUD",
          "KW": "KWD",
          "KG": "KGS",
          "LA": "LAK",
          "LV": "EUR",
          "LB": "LBP",
          "LS": "LSL",
          "LR": "LRD",
          "LY": "LYD",
          "LI": "CHF",
          "LT": "EUR",
          "LU": "EUR",
          "MG": "MGA",
          "MW": "MWK",
          "MY": "MYR",
          "MV": "MVR",
          "ML": "XOF",
          "MT": "EUR",
          "MH": "USD",
          "MQ": "EUR",
          "MR": "MRO",
          "MU": "MUR",
          "YT": "EUR",
          "MX": "MXN",
          "FM": "USD",
          "MC": "EUR",
          "MN": "MNT",
          "ME": "EUR",
          "MS": "XCD",
          "MA": "MAD",
          "MZ": "MZN",
          "MM": "MMK",
          "NA": "NAD",
          "NR": "AUD",
          "NP": "NPR",
          "NL": "EUR",
          "NC": "XPF",
          "NZ": "NZD",
          "NI": "NIO",
          "NE": "XOF",
          "NG": "NGN",
          "NU": "NZD",
          "NF": "AUD",
          "MP": "USD",
          "NO": "NOK",
          "OM": "OMR",
          "PK": "PKR",
          "PW": "USD",
          "PA": "PAB",
          "PG": "PGK",
          "PY": "PYG",
          "PE": "PEN",
          "PH": "PHP",
          "PN": "NZD",
          "PL": "PLN",
          "PT": "EUR",
          "PR": "USD",
          "QA": "QAR",
          "KR": "KRW",
          "MD": "MDL",
          "RO": "RON",
          "RU": "RUB",
          "RW": "RWF",
          "RE": "EUR",
          "BL": "EUR",
          "SH": "SHP",
          "KN": "XCD",
          "LC": "XCD",
          "MF": "EUR",
          "PM": "EUR",
          "VC": "XCD",
          "WS": "WST",
          "SM": "EUR",
          "ST": "STD",
          "SA": "SAR",
          "SN": "XOF",
          "RS": "RSD",
          "SC": "SCR",
          "SL": "SLL",
          "SG": "SGD",
          "SX": "ANG",
          "SK": "EUR",
          "SI": "EUR",
          "SB": "SBD",
          "SO": "SOS",
          "ZA": "ZAR",
          "SS": "SSP",
          "ES": "EUR",
          "LK": "LKR",
          "SD": "SDG",
          "SR": "SRD",
          "SJ": "NOK",
          "SZ": "SZL",
          "SE": "SEK",
          "CH": "CHF",
          "SY": "SYP",
          "TJ": "TJS",
          "TH": "THB",
          "MK": "MKD",
          "TL": "USD",
          "TG": "XOF",
          "TK": "NZD",
          "TO": "TOP",
          "TT": "TTD",
          "TN": "TND",
          "TR": "TRY",
          "TM": "TMT",
          "TC": "USD",
          "TV": "AUD",
          "UG": "UGX",
          "UA": "UAH",
          "AE": "AED",
          "GB": "GBP",
          "TZ": "TZS",
          "UM": "USD",
          "VI": "USD",
          "US": "USD",
          "UY": "UYU",
          "UZ": "UZS",
          "VU": "VUV",
          "VE": "VEF",
          "VN": "VND",
          "WF": "XPF",
          "EH": "MAD",
          "YE": "YER",
          "ZM": "ZMW",
          "ZW": "ZWL",
          "AX": "EUR"
        },
        decimalPointCountryCodes = ['AU','BD','BW','BN','KH','CN','HK','MO','DO','EG','SV','GH','GT','HN','IN','IE','IL','JP','JO','KE','KP','KR','LB','LI','LU','MY','MV','MT','MX','MM','NA','NP','NZ','NI','NG','PK','PS','PA','PH','PR','SG','LK','TW','TZ','TH','UG','GB','US','ZW'],
        brickOwlListingsUrl = 'https://www.brickowl.com/catalog/!{brickOwlUrl}',
        bricklinkCurrentListingsUrl = 'https://www.bricklink.com/v2/catalog/catalogitem.page?S=!{setNumber}',
        ebayCurrentListingsUsedUrl = 'https://www.ebay.com/sch/19006/i.html?LH_ItemCondition3000&_nkw=Lego+!{setNumber}',
        ebayCurrentListingsNewUrl = 'https://www.ebay.com/sch/19006/i.html?LH_ItemCondition1000&_nkw=Lego+!{setNumber}',
        ebaySoldListingsNewUrl = 'https://www.ebay.com/sch/19006/i.html?LH_ItemCondition1000&LH_Complete=1&LH_Sold=1&_nkw=Lego+!{setNumber}',
        ebaySoldListingsUsedUrl = 'https://www.ebay.com/sch/19006/i.html?LH_ItemCondition3000&LH_Complete=1&LH_Sold=1&_nkw=Lego+!{setNumber}',
        bricklinkSoldListingsUrl = 'https://www.bricklink.com/v2/catalog/catalogitem.page?S=!{setNumber}#T=P';

  let currencyFormattingCode = "USD",
      countryFormattingCode = "US";

  function updateCurrencyAndCountryCodes() {
    countryFormattingCode = getFromLocalStorage(localStorageKeys.country) || "US";
    currencyFormattingCode = getFromLocalStorage(localStorageKeys.currency) || "USD";
  }

  const formatCurrency = function formatCurrency(number) {
    return number.toLocaleString(countryFormattingCode, { style: 'currency', currency: currencyFormattingCode });
  };

  const currencyToFloat = function currencyToFloat(numberString) {
    const containsCommas = numberString.indexOf(',') !== -1,
        containsPeriods = numberString.indexOf('.') !== -1,
        containsSpaces = numberString.indexOf(' ') !== -1;
    let parseableNumber = numberString.replace(/[^0-9-.,]/g, ''),
        radixCharacter;
    // If there are both commas and periods
    if (containsCommas || containsSpaces) {
      // Find the character in the third place from the end and determine if it's a comma or a period
      radixCharacter = numberString[numberString.length - 3];

      if (radixCharacter === '.') {
        // If a period, strip commas
        parseableNumber = numberString.replace(/[^0-9-.]/g, '');
      } else if (radixCharacter === ',') {
        // If a comma, strip periods, replace commas with periods
        parseableNumber = numberString.replace(/[^0-9-,]/g, '').replace(/,/g, '.');
      }
    }
    // parse float, round 2
    return parseFloat(parseableNumber, 10);
  };

  const getPayPalTransactionFee = function getPayPalTransactionFee(finalValue) {
    const payPalTransactionPercent = 2.9,
          payPalPerTransactionCharge = 0.3;
    return ((payPalTransactionPercent / 100) * finalValue) + payPalPerTransactionCharge;
  };

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
          url: checkAuthTokenEndpoint, 
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

  const getCurrencySymbolAndPositionForCurrencyAndCountry = function getCurrencySymbolAndPositionForCurrencyAndCountry(currency, country) {
    const number = 0,
          currencyFormattedNumber = number.toLocaleString(country, {style: 'currency', currency: currency});

      const possibleNumberFormats = ["0.00", "0,00", "0"];
      let numberIndex,
          position,
          symbol;

      possibleNumberFormats.some(function(f){
        const index = currencyFormattedNumber.indexOf(f);
        if (index === 0) {
          // The number part of the formatted currency is found at the beginning of the string, so the currency symbol is on the right, position = right
          position = 'right';
          symbol = currencyFormattedNumber.replace(f, '');
          return true;
        } else if (index >= 1) {
          // The number part of the formatted
          position = 'left';
          symbol = currencyFormattedNumber.replace(f, '');
          return true;
        }
      });
      return {position: position, symbol: symbol};
  }

  const stringDecoder = function stringDecoder(s) {
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
   };

   const getUrlParameterByName = function getUrlParameterByName(name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

   function setEventListeners() {
    document.addEventListener(customEvents.currencyUpdated, updateCurrencyAndCountryCodes);
   }

   const initialize = function initialize() {
    setEventListeners();
    updateCurrencyAndCountryCodes();
   }

   const fixSafariScrolling = function fixSafariScrolling(event) {
    // Because of the translate CSS property, Safari doesn't know that the div can be scrollable, this "refreshes" the scrollable divs so they are scrolled after animating
     event.target.style.overflowY = 'hidden';
     setTimeout(function () { event.target.style.overflowY = 'auto'; });
   }

   const emailValid = function emailValid(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  return {
    initialize: initialize,
    formatCurrency: formatCurrency,
    getBricklinkSellerFees: getBricklinkSellerFees,
    getBrickOwlSellerFees: getBrickOwlSellerFees,
    getEbaySellerFees: getEbaySellerFees,
    saveToLocalStorage: saveToLocalStorage,
    getFromLocalStorage: getFromLocalStorage,
    removeFromLocalStorage: removeFromLocalStorage,
    validateAuthToken: validateAuthToken,
    broadcastEvent: broadcastEvent,
    stringDecoder: stringDecoder,
    countryToCurrencyMap: countryToCurrencyMap,
    getCurrencySymbolAndPositionForCurrencyAndCountry: getCurrencySymbolAndPositionForCurrencyAndCountry,
    currencyToFloat: currencyToFloat,
    decimalPointCountryCodes: decimalPointCountryCodes,
    bricklinkCurrentListingsUrl: bricklinkCurrentListingsUrl,
    bricklinkSoldListingsUrl: bricklinkSoldListingsUrl,
    ebayCurrentListingsUsedUrl: ebayCurrentListingsUsedUrl,
    ebayCurrentListingsNewUrl: ebayCurrentListingsNewUrl,
    ebaySoldListingsNewUrl: ebaySoldListingsNewUrl,
    ebaySoldListingsUsedUrl: ebaySoldListingsUsedUrl,
    brickOwlListingsUrl: brickOwlListingsUrl,
    getUrlParameterByName: getUrlParameterByName,
    fixSafariScrolling: fixSafariScrolling,
    emailValid: emailValid,
  };
}();

BC.SetDatabase = function() {
  const loadingSpinner = document.querySelector(".bc-spinner--loading-set-data"),
        loadingSpinnerVisibleClass = "bc-spinner--visible",
        setDataCachedMessage = document.querySelector(".bc-lookup-set-data-status-message"),
        setDataCachedMessageHiddenClass = "bc-lookup-set-data-status-message--hidden";

  let currencyCode = BC.Utils.getFromLocalStorage(localStorageKeys.currency),
      countryCode = BC.Utils.getFromLocalStorage(localStorageKeys.country);

  function saveSetDBToLocalStorage(rawJSON) {
    localStorage.setItem(localStorageKeys.setDB, rawJSON);
  }

  function showLoadingSpinner() {
    loadingSpinner.classList.add(loadingSpinnerVisibleClass);
    setDataCachedMessage.classList.add(setDataCachedMessageHiddenClass);
  }

  function hideLoadingSpinner() {
    loadingSpinner.classList.remove(loadingSpinnerVisibleClass);
    setDataCachedMessage.classList.remove(setDataCachedMessageHiddenClass);
  }

  function clearLocalSetDatabase() {
    localStorage.removeItem(localStorageKeys.setDB);
    localStorage.removeItem(localStorageKeys.setDBTimestamp);
  }

  function getEncodedSetDatabase() {
    return BC.Utils.getFromLocalStorage(localStorageKeys.setDB);
  }

  const getDecodedSetDatabase = function getDecodedSetDatabase() {
    const encDB = localStorage.getItem(localStorageKeys.setDB);
    let response;
    if (encDB === null || typeof encDB === 'undefined') {
      response = null
    } else {
      response = JSON.parse(BC.Utils.stringDecoder(encDB));
    }
    return response;
  }

  const getSetDBDataRetrievedTimestamp = function getSetDBDataRetrievedTimestamp() {
    return BC.Utils.getFromLocalStorage(localStorageKeys.setDBTimestamp);
  }

  const retrieveFreshSetData = function retrieveFreshSetData(year) {
    year = typeof year === 'undefined' ? currentYear : year;

    let apiUrl = apiDomain + '/lego_sets?year=' + year;

    // Get results in a specific currency
    if (currencyCode && currencyCode !== 'USD') {
      apiUrl += '&currency=' + currencyCode;
    }

    var request = new XMLHttpRequest();

    showLoadingSpinner();
    try {
      request.open('GET', apiUrl, true);
      request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          // Success!
          // Merge response into existing local storage
          const newData = JSON.parse(request.responseText);
          let setData = getEncodedSetDatabase();
          if (setData === null) {
            setData = {};
          }
          Object.assign(setData, newData);

          BC.Utils.saveToLocalStorage("BCSetDB", JSON.stringify(setData));

          const decodedDB = BC.SetDatabase.getDecodedSetDatabase();

          // Push decoded set database out to all the modules that need to reference it: autocomplete, & value calculation
          BC.Autocomplete.updateDataset(decodedDB);
          BC.Values.updateCachedSetDatabase(decodedDB); // copy the decoded data into the BC.Values object so it doesn't have to be retrieved from local storage and decoded each time a value is queried

          BC.Overlay.hide();

          if (!((year - 1) <= (currentYear - numberOfYearsToRetrieve))) {
            // Retrieve another set of data starting at one year back, call recursively for numberOfYearsToRetrieve, for example first get 2018 data, then 2017-2018 data, then 2016-2018 data, replacing local storage each time
            const nextYear = year - 1;
            retrieveFreshSetData(nextYear);
          } else {
            // Done, we've got all the data we're going to pull from the server
            BC.Utils.saveToLocalStorage(localStorageKeys.setDBTimestamp, Date.now());
            hideLoadingSpinner();
            updateSetDataTimestamp(getSetDBDataRetrievedTimestamp());
          }
        } else {
          // We reached our target server, but it returned an error
          // alert("Could not retrieve set data - connection successful, but data failed");
          if (BC.SetDatabase.getDecodedSetDatabase() !== null) {
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
        if (BC.SetDatabase.getDecodedSetDatabase() !== null) {
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
      if (BC.SetDatabase.getDecodedSetDatabase() !== null) {
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

  function checkforDataApiVersionChange() {
    const versionNumber = BC.Utils.getFromLocalStorage(localStorageKeys.apiVersionNumber);
    if (versionNumber === null || versionNumber !== brickulatorAPIVersionNumber) {
      // The version number has changed, we need to clear the locally cached setDB data
      clearLocalSetDatabase();
      BC.Utils.saveToLocalStorage(localStorageKeys.apiVersionNumber, brickulatorAPIVersionNumber);
    }
  }

  function handleCurrencyUpdate() {
    // clear the locally stored database and kick up a fresh set data retrieval
    currencyCode = BC.Utils.getFromLocalStorage(localStorageKeys.currency); // set the local currencyCode variable within this object    
    clearLocalSetDatabase();
    retrieveFreshSetData(); 
  }

  function setEventListeners() {
    document.addEventListener(customEvents.currencyUpdated, handleCurrencyUpdate);
  }

  const initialize = function initialize() {
    checkforDataApiVersionChange();
    setEventListeners();
    const setDB = BC.SetDatabase.getDecodedSetDatabase();
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

  let setDB;

  function calculate(setNumber, purchasePrice, quantity) {
    const setData = setDB[setNumber];

    if (setData) {
      BC.SetSummary.update(setData);
      BC.PortletLayout.updateAllPortletValues(setData, purchasePrice, quantity);

      showValues();
    } else {
      alert("Set Number Not Found");
    }
  }

  const updateCachedSetDatabase = function updateSetDb(data) {
    setDB = data;
  }

  function showValues() {
    document.body.classList.add("bc--show-values");
    window.scrollTo(0, 0); // Scroll page to top
  }

  const hideValues = function hideValues() {
    document.body.classList.remove("bc--show-values");
    window.scrollTo(0, 0); // Scroll page to top
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
    updateCachedSetDatabase(BC.SetDatabase.getDecodedSetDatabase());
  }

  return {
    calculate: calculate,
    initialize: initialize,
    updateCachedSetDatabase: updateCachedSetDatabase,
    hideValues: hideValues
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
  BC.FormInput.initialize();
  BC.AdHeader.initialize();
  BC.Modal.initialize();
  BC.ResultsInterstitial.initialize();
  BC.ToastMessage.initialize();
  BC.NewsletterSignUpForm.initialize();
  BC.Tos.initialize();
  BC.Utils.initialize();
  BC.App.initialize(); // Check auth token, broadcast user state events
  BC.SetLookupForm.initialize();
});
