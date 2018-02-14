'use strict';
BC.Tos = function() {
  const termsOfServiceContentUrl = 'terms-of-service.html',
        showTriggerSelector = '.bc-tos--show-trigger';

  function getTosContent() {
    return new Promise(function(resolve, reject){
      const xhr = new XMLHttpRequest();
      xhr.open("GET", termsOfServiceContentUrl);
      xhr.onload = () => resolve(xhr.responseText);
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send();
    });
  }

  const showFromLink = function showFromLink(e) {
    e.preventDefault();
    show();
  };

  const show = function show() {
    // const content = 'Get the terms of service via an AJAX request here';
    getTosContent().then(function(content){
      BC.Modal.create(content);
    });
  };

  const initialize = function initialize() {
    const triggers = Array.from(document.querySelectorAll(showTriggerSelector));
    triggers.forEach(function(t){
      t.addEventListener('click', showFromLink);
    });
  };

  return {
    initialize: initialize,
    show: show,
    showFromLink: showFromLink
  };
}();
