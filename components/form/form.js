'use strict';
BC.FormInput = function() {
  const clearInputButtonSelector = '.bc-form-input__clear-button-touch-wrap',
        clearableInputSelector = '.bc-form-input-wrap--has-clear-button input',
        inputWrapSelector = '.bc-form-input-wrap',
        clearButtonVisibleClass = 'bc-form-input-wrap--show-clear-button';

  let clearInputButtons,
      clearableInputs;

  function showClearInputButton(inputWrap) {
    inputWrap.classList.add(clearButtonVisibleClass);
  }

  function hideClearInputButton(inputWrap) {
    inputWrap.classList.remove(clearButtonVisibleClass);
  }

  function handleClearInputButtonClick(e) {
    const inputWrap = this.closest(inputWrapSelector),
          input = inputWrap.querySelector(clearableInputSelector);
    input.value = '';
    hideClearInputButton(inputWrap);
    // console.log(input);
    
    // trigger a change event so other components like autocomplete can pick up on the change
    var event = document.createEvent('HTMLEvents');
    event.initEvent('keyup', true, false);
    input.dispatchEvent(event);
  }

  function handleClearableInputValueChange() {
    const inputWrap = this.closest(inputWrapSelector);
    if (this.value.length > 0) {
      showClearInputButton(inputWrap);
    } else {
      hideClearInputButton(inputWrap);
    }
  }

  function setEventListeners() {
    clearableInputs.forEach(function(i) {
      i.addEventListener('change', handleClearableInputValueChange);
      i.addEventListener('keyup', handleClearableInputValueChange);
    });

    clearInputButtons.forEach(function(b) {
      b.addEventListener('click', handleClearInputButtonClick);
    });

  }

  const initialize = function initialize() {
    clearInputButtons = document.querySelectorAll(clearInputButtonSelector);
    clearableInputs = document.querySelectorAll(clearableInputSelector);
    setEventListeners();
  }

  return {
    initialize: initialize
  }
}();
