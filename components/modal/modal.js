'use strict';
BC.Modal = function() {
  const wrapperSelector = '.bc-modal-wrapper',
        modalSelector = '.bc-modal',
        templateId = 'bc-modal-js-template',
        contentSelector = '.bc-modal__content-text',
        closableSelector = '.bc-modal__close-button',
        modalVisibleBodyClass = 'bc--modal-visible';

  let template,
      wrapper;

  // const handleModalClick = function handleModalClick(e) {
  //   if (e.target.classList.contains('bc-modal__dismiss')) {
  //     const modal = this;
  //     if (modal.timeout) {
  //       clearTimeout(modal.timeout);
  //     }
  //     removeMessage(modal);
  //   }
  // }

  const handleCloseModalClick = function handleCloseModalClick() {
    const modal = this.closest(modalSelector);
    modal.parentNode.removeChild(modal);
    document.body.classList.remove(modalVisibleBodyClass);
  };

  const initialize = function initialize() {
    wrapper = document.querySelector(wrapperSelector);
    template = document.getElementById(templateId);
    template.removeAttribute("id");
    template.parentNode.removeChild(template);
  };

  const create = function create(content, closable) {
    closable = typeof closable === 'undefined' ? true : closable;
    let modal = template.cloneNode(true),
        contentArea = modal.querySelector(contentSelector),
        closeButton = modal.querySelector(closableSelector);

    contentArea.innerHTML = content;

    if (!closable) {
      closeButton.parentNode.removeChild(closeButton);
    } else {
      closeButton.addEventListener('click', handleCloseModalClick);
    }

    wrapper.appendChild(modal);
    document.body.classList.add(modalVisibleBodyClass);
    // modal.addEventListener("click", handleModalClick);

    return modal;
  };

  return {
    initialize: initialize,
    create: create
  };
}();
