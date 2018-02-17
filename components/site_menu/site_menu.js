'use strict';
BC.SiteMenu = function() {
  const showMenuSelector = '.bc-site-menu-show-trigger',
        hideMenuSelector = '.bc-site-menu-hide-trigger',
        menuSelector = '.bc-site-menu',
        menuVisibleClass = 'bc-site-menu--visible',
        signOutSelector = '[href="#sign-out"]',
        settingsSelector = '[href="#user-settings"]';

  let showMenuTriggers,
      hideMenuTriggers,
      signOutLink,
      settingsLink,
      menu;

  const showMenu = function showMenu() {
    document.body.classList.add(menuVisibleClass);
    const inputs = Array.from(menu.querySelectorAll("input"));
    inputs.forEach(function(i){
      i.removeAttribute("tabindex");
    });
  }

  const hideMenu = function showMenu() {
    document.body.classList.remove(menuVisibleClass);
    const inputs = Array.from(menu.querySelectorAll("input"));
    inputs.forEach(function(i){
      i.setAttribute("tabindex", "-1");
    });
  }

  function setEventListeners() {
    showMenuTriggers.forEach(function(t){
      t.addEventListener("click", showMenu);
    });

    hideMenuTriggers.forEach(function(t){
      t.addEventListener("click", hideMenu);
    });

    signOutLink.addEventListener("click", BC.App.signOut);
    settingsLink.addEventListener("click", BC.UserSettingsPane.showPane);
  }


  const initialize = function initialize() {
    showMenuTriggers = Array.from(document.querySelectorAll(showMenuSelector));
    hideMenuTriggers = Array.from(document.querySelectorAll(hideMenuSelector));
    menu = document.querySelector(menuSelector);
    signOutLink = document.querySelector(signOutSelector);
    settingsLink = document.querySelector(settingsSelector);
    setEventListeners();
  }

  return {
    initialize: initialize,
    showMenu: showMenu,
    hideMenu: hideMenu,
  }
}();
