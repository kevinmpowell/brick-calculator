'use strict';
BC.SetSummary = function() {
  const showMenuSelector = '.bc-site-menu-show-trigger',
        hideMenuSelector = '.bc-site-menu-hide-trigger',
        menuSelector = '.bc-site-menu',
        menuVisibleClass = 'bc-site-menu--visible';

  let showMenuTriggers,
      hideMenuTriggers,
      menu;

  const showMenu = function showMenu() {
    menu.classList.add(menuVisibleClass);
  }

  const hideMenu = function showMenu() {
    menu.classList.remove(menuVisibleClass);
  }

  function setEventListeners() {
    showMenuTriggers.forEach(function(t){
      t.addEventListener("click", showMenu);
    });

    hideMenuTriggers.forEach(function(t){
      t.addEventListener("click", hideMenu);
    });
  }


  const initialize = function initialize() {
    showMenuTriggers = Array.from(document.querySelectorAll(showMenuSelector));
    hideMenuTriggers = Array.from(document.querySelectorAll(hideMenuSelector));
    menu = document.querySelector(menuSelector);
    setEventListeners();
  }

  return {
    initialize: initialize,
    showMenu: showMenu,
    hideMenu: hideMenu,
  }
}();
