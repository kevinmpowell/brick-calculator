'use strict';
BC.AdHeader = function() {
  const adHeaderSelector = '.bc-ad-header';

  let adHeader;

  function showAds() {
    if (adHeader !== null) {
      adHeader.setAttribute("style", "display: block;");
    }
  }

  function hideAds() {
    if (adHeader !== null) {
      adHeader.removeAttribute("style");
    }
  }

  function setAdDisplay() {
    const userSettings = BC.App.getUserSettings();
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
