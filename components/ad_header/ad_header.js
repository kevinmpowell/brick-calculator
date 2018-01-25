'use strict';
BC.AdHeader = function() {
  const adHeaderSelector = '.bc-ad-header';

  let adHeader;

  function showAds() {
    adHeader.setAttribute("style", "display: block;");
  }

  function hideAds() {
    adHeader.removeAttribute("style");
  }

  function setAdDisplay() {
    const userSettings = BC.Utils.getFromLocalStorage(localStorageKeys.userSettings);
    if (!userSettings || !userSettings.plus_member) {
      showAds();
    } else {
      hideAds();
    }
  }

  function setEventListeners() {
    document.addEventListener(customEvents.userSignedIn, setAdDisplay);
    document.addEventListener(customEvents.userSignedOut, setAdDisplay);
  }

  const initialize = function initialize() {
    adHeader = document.querySelector(adHeaderSelector);
    setAdDisplay();
    setEventListeners();
  }

  return {
    initialize: initialize
  }
}();
