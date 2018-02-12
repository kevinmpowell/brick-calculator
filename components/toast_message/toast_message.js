'use strict';
BC.ToastMessage = function() {
  const wrapperSelector = '.bc-toast-message-wrapper',
        messageSelector = '.bc-toast-message',
        templateId = 'bc-toast-message-js-template',
        contentSelector = '.bc-toast-message__content-text',
        typeSelector = '.bc-toast-message__type',
        dismissibleSelector = '.bc-toast-message__dismiss',
        typeMapping = {  "warning": "!",
                          "error": "&otimes;",
                          "success": "&#10003;"
                        };

  let template,
      wrapper;

  const handleToastMessageClick = function handleToastMessageClick(e) {
    if (e.target.classList.contains('bc-toast-message__dismiss')) {
      const toastMessage = this;
      if (toastMessage.timeout) {
        clearTimeout(toastMessage.timeout);
      }
      removeMessage(toastMessage);
    }
  }

  const removeMessage = function removeMessage(toastMessage) {
    toastMessage.parentNode.removeChild(toastMessage);
  }

  const initialize = function initialize() {
    wrapper = document.querySelector(wrapperSelector);
    template = document.getElementById(templateId);
    template.removeAttribute("id");
    template.parentNode.removeChild(template);
  }

  const create = function create(content, type, timeout, dismissible, callback) {
    dismissible = typeof dismissibile === 'undefined' ? true : dismissible;
    timeout = typeof timeout === 'undefined' ? 5000 : timeout;
    let toastMessage = template.cloneNode(true),
        contentArea = toastMessage.querySelector(contentSelector),
        typeArea = toastMessage.querySelector(typeSelector),
        dismissibleButton = toastMessage.querySelector(dismissibleSelector);
  
    contentArea.innerHTML = content;

    if (type) {
      typeArea.innerHTML = typeMapping[type];
      toastMessage.classList.add("bc-toast-message--" + type);
    } else {
      typeArea.parentNode.removeChild(typeArea);
    }

    if (!dismissible) {
      dismissibleButton.parentNode.removeChild(dismissibleButton);
    }

    wrapper.appendChild(toastMessage);
    toastMessage.addEventListener("click", handleToastMessageClick);
    if (callback) {
      toastMessage.addEventListener("click", callback);
    }

    if (timeout) {
      toastMessage.timeout = setTimeout(function(){
        removeMessage(toastMessage);
      }, timeout);
    }

    return toastMessage;
  }

  return {
    initialize: initialize,
    create: create,
    removeMessage: removeMessage
  }
}();
