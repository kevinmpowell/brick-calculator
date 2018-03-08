'use strict';
BC.ResultsInterstitial = function() {
  const brickulatorPlusInterstitialUrl = 'brickulator-plus-interstitial.html',
        interstitialVisibleClass = 'bc-interstitial--visible',
        interstitialDuration = 15;
  let interstitialInterval,
      interstitialContent;

  function getInterstitialContent() {
    return interstitialContent;
  }

  function getInterstitialContentOptions() {
    return new Promise(function(resolve, reject){
      const xhr = new XMLHttpRequest();
      xhr.open("GET", brickulatorPlusInterstitialUrl);
      xhr.onload = () => resolve(xhr.responseText);
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send();
    });
  }

  function handleBrickulatorPlusSignUpClick(e){
    e.preventDefault();
    clearInterval(interstitialInterval);
    hideInterstitial();
    BC.SiteMenu.showMenu();
    BC.SignUpForm.showFormPane();
  }

  function addInterstitialEventHandlers() {
    const brickulatorPlusSignUpLink = document.querySelector('.bc-results-interstitial-brickulator-plus-link');
    brickulatorPlusSignUpLink.addEventListener("click", handleBrickulatorPlusSignUpClick, {once: true});
  }

  function hideInterstitial() {
    BC.Overlay.hide();
    document.body.classList.remove(interstitialVisibleClass);
  }

  const timeToShowInterstitial = function timeToShowInterstitial() {
    // Check localStorage and number of lookups to see if it's time to show the interstitial
    const showEveryXTimes = BC.App.userIsSignedIn() ? 10 : 3;
    let lookupCount = BC.Utils.getFromLocalStorage(localStorageKeys.lookupCount) || 0,
        showInterstitial = false;
    lookupCount++;

    if (lookupCount % showEveryXTimes === 0) {
      showInterstitial = true;
    }

    BC.Utils.saveToLocalStorage(localStorageKeys.lookupCount, lookupCount);

    return showInterstitial;
  }

  const show = function show() {
    const content = getInterstitialContent();
    let secondsLeft = interstitialDuration;
    document.body.classList.add(interstitialVisibleClass);
    BC.Overlay.show("Results Shown In <span class='bc-interstitial-countdown'>" + interstitialDuration + "</span> seconds", content, false);

    addInterstitialEventHandlers();
    const secondsLeftSpan = document.querySelector(".bc-interstitial-countdown");
    interstitialInterval = setInterval(function(){
      if (secondsLeft > 0) {
        // update seconds
        secondsLeft--;
        secondsLeftSpan.textContent = secondsLeft;
      } else {
        clearInterval(interstitialInterval);
        BC.Overlay.hide();
        BC.Utils.broadcastEvent(customEvents.interstitialComplete);
        return;
      }
    }, 1000);
  }

  const initialize = function initialize() {
    getInterstitialContentOptions().then(function(results){
      interstitialContent = results;
    });
  }

  return {
    show: show,
    initialize: initialize,
    timeToShowInterstitial: timeToShowInterstitial
  }
}();
