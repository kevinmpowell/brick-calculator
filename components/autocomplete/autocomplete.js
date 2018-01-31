'use strict';
BC.Autocomplete = function() {
  const autocompleteWrapperSelector = ".bc-autocomplete",
        autocompleteSelector = ".bc-autocomplete__list",
        autocompleteVisibleClass = "bc-autocomplete--visible",
        autocompleteItemTemplateClass = "bc-autocomplete__item--template",
        itemLinkClass = "bc-autocomplete__item-link",
        itemLinkTextClass = "bc-autocomplete__item-link-text",
        itemMetadataClass = "bc-autocomplete__item-metadata",
        inputTextSelector = ".bc-autocomplete__input-value",
        clearInputSelector = ".bc-autocomplete__clear-input",
        autocompleteInputValueFilledClass = "bc-autocomplete--with-value";

  let dataset,
      keys,
      autocomplete,
      autocompleteWrapper,
      itemTemplate,
      triggerInput,
      clearInputButton,
      inputText;

  function showAutocomplete() {
    autocomplete.classList.add(autocompleteVisibleClass);
  }

  function hideAutocomplete() {
    autocomplete.classList.remove(autocompleteVisibleClass);
  }

  function clearAutocompleteResults() {
    autocomplete.innerHTML = '';
  }

  function buildAutocompleteResults(matchedKeys) {
    const results = matchedKeys.map(function(k){
      return dataset[k];
    });

    clearAutocompleteResults();

    if (results.length > 1) {
      results.forEach(function(r) {
        const result = itemTemplate.cloneNode(true),
              setNumber = result.querySelector(`.${itemLinkTextClass}`),
              setTitle = result.querySelector(`.${itemMetadataClass}`);
        setNumber.innerHTML = r.k;
        setNumber.href = `#${r.k}`;
        setTitle.innerHTML = r.t;
        autocomplete.appendChild(result);
      });
    } else {
      autofillInput(results[0].k, results[0].t);
      hideAutocomplete();
    }
  }

  function findMatchesInDataset(value) {
    const search = new RegExp(`^${value}`);
    const matches = keys.filter(function(key) {
      return search.exec(key);
    });

    return matches.sort();
  }

  function triggerAutocomplete() {
    const currentValue = this.value,
          matches = findMatchesInDataset(currentValue);

    if (currentValue.length > 0) {
      autocompleteWrapper.classList.add(autocompleteInputValueFilledClass);
    } else {
      autocompleteWrapper.classList.remove(autocompleteInputValueFilledClass);
    }

    if (currentValue.length > 1) {
      clearInputAutoFillText();
      
      if (matches.length > 0) {
        buildAutocompleteResults(matches);
        showAutocomplete();
      } else {
        hideAutocomplete();
      }
    } else {
      hideAutocomplete();
    }
  }

  function clearInput() {
    clearInputAutoFillText();
    triggerInput.value = '';
    autocompleteWrapper.classList.remove(autocompleteInputValueFilledClass);
    hideAutocomplete();
  }

  function clearInputAutoFillText() {
    inputText.textContent = '';
  }

  function autofillInput(text, metadata) {
    triggerInput.value = text;
    inputText.textContent = metadata;
  }

  function handleAutocompleteClick(e) {
    e.preventDefault();
    let link;
    if (e.target.classList.contains(itemLinkClass)) {
      link = e.target;
    } else if (e.target.closest('.' + itemLinkClass) !== null) {
      link = e.target.closest('.' + itemLinkClass);
    }
    const setNumber = link.querySelector('.' + itemLinkTextClass).textContent,
          metadata = link.querySelector('.' + itemMetadataClass).textContent;
    autofillInput(setNumber, metadata);
    hideAutocomplete();
  }

  const updateDataset = function updateDataset(data) {
    dataset = data;
    if (dataset !== null) {
      keys = Object.keys(dataset);
    }
  }

  function setEventListeners() {
    autocomplete.addEventListener('click', handleAutocompleteClick);
    triggerInput.addEventListener('keyup', triggerAutocomplete);
    clearInputButton.addEventListener('click', clearInput);
  }


  const initialize = function initialize(targetSelector, data) {
    updateDataset(data);
    triggerInput = document.querySelector(targetSelector);
    inputText = document.querySelector(inputTextSelector);
    autocompleteWrapper = document.querySelector(autocompleteWrapperSelector);
    clearInputButton = document.querySelector(clearInputSelector);
    autocomplete = triggerInput.parentNode.querySelector(autocompleteSelector);
    itemTemplate = autocomplete.querySelector(`.${autocompleteItemTemplateClass}`);
    itemTemplate.classList.remove(autocompleteItemTemplateClass);
    itemTemplate.parentNode.removeChild(itemTemplate);
    setEventListeners();
  }

  return {
    initialize: initialize,
    updateDataset: updateDataset
  }
}();

function ready(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(function(){
  BC.Autocomplete.initialize("#bc-set-lookup-form__set-number-input", setDB);
});
