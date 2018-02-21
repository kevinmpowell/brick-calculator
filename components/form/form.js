'use strict';
BC.FormInput = function() {
  const clearInputButtonSelector = '.bc-form-input__clear-button-touch-wrap',
        clearableInputSelector = '.bc-form-input-wrap--has-clear-button input',
        stepperInputButtonSelector = '.bc-form-input__number-stepper-button',
        inputWrapSelector = '.bc-form-input-wrap',
        clearButtonVisibleClass = 'bc-form-input-wrap--show-clear-button',
        stepperDecreaseClass = 'bc-form-input__number-stepper-button--decrease',
        stepperIncreaseClass = 'bc-form-input__number-stepper-button--increase';

  let clearInputButtons,
      clearableInputs,
      stepperButtons;

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

  function handleStepperButtonClick() {
    const inputWrap = this.closest(inputWrapSelector),
          input = inputWrap.querySelector('input[type="number"]'),
          step = parseFloat(input.getAttribute('step'), 10) || 1,
          min = parseFloat(input.getAttribute('min'), 10) || 1,
          max = parseFloat(input.getAttribute('max'), 10) || 100,
          direction = this.classList.contains(stepperDecreaseClass) ? 'decrease' : 'increase',
          currentValue = parseFloat(input.value, 10);
    if (direction === 'decrease') {
      input.value = Math.max(currentValue - step, min);
    } else {
      input.value = Math.min(currentValue + step, max);
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

    stepperButtons.forEach(function(b) {
      b.addEventListener('click', handleStepperButtonClick);
    });
  }

  const initialize = function initialize() {
    clearInputButtons = document.querySelectorAll(clearInputButtonSelector);
    clearableInputs = document.querySelectorAll(clearableInputSelector);
    stepperButtons = document.querySelectorAll(stepperInputButtonSelector);
    setEventListeners();
  }

  return {
    initialize: initialize
  }
}();
