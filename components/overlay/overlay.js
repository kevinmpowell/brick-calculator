'use strict';
BC.Overlay = function() {
  const overlaySelector = '.bc-overlay',
        overlayTitleSelector = '.bc-overlay__title',
        overlayMessageSelector = '.bc-overlay__message',
        overlayVisibleClass = 'bc-overlay--visible';

  let overlay,
      title,
      message;

  function dismissOverlay() {
    hide();
    overlay.removeEventListener("click", dismissOverlay);
  }

  const initialize = function initialize() {
    overlay = document.querySelector(overlaySelector);
    title = document.querySelector(overlayTitleSelector);
    message = document.querySelector(overlayMessageSelector);
  }

  const show = function show(titleText, messageText, dismissible) {
    dismissible = typeof dismissible === 'undefined' ? false : true;
    title.innerHTML = titleText;
    message.innerHTML = messageText;
    overlay.classList.add(overlayVisibleClass);

    if (dismissible) {
      overlay.addEventListener("click", dismissOverlay);
    }
  }

  const hide = function hide() {
    overlay.classList.remove(overlayVisibleClass);
  }

  return {
    initialize: initialize,
    show: show,
    hide: hide
  }
}();
