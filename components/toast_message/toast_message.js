'use strict';
BC.ToastMessage = function() {
  const wrapperSelector = '.bc-toast-message-wrapper',
        templateId = 'bc-toast-message-js-template';

  let template,
      wrapper;

  const initialize = function initialize() {
    wrapper = document.querySelector(numberSelector);
    template = document.getElementById(templateId);
  }

  const create = function create(message, type, dismissible) {

  }

  return {
    initialize: initialize,
    create: create
  }
}();
