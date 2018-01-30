'use strict';
BC.Autocomplete = function() {
  const autocompleteSelector = ".bc-autocomplete__list",
        autocompleteVisibleClass = "bc-autocomplete--visible",
        autocompleteItemTemplateClass = "bc-autocomplete__item--template",
        itemLinkClass = "bc-autocomplete__item-link",
        itemLinkTextClass = "bc-autocomplete__item-link-text",
        itemMetadataClass = "bc-autocomplete__item-metadata";
  let dataset,
      keys,
      autocomplete,
      itemTemplate,
      triggerInput;

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
    if (currentValue.length > 1) {
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

  function autofillInput(text) {
    triggerInput.value = text;
  }

  function handleAutocompleteClick(e) {
    e.preventDefault();
    let link;
    if (e.target.classList.contains(itemLinkClass)) {
      link = e.target;
    } else if (e.target.closest('.' + itemLinkClass) !== null) {
      link = e.target.closest('.' + itemLinkClass);
    }
    const setNumber = link.querySelector('.' + itemLinkTextClass).textContent;
    autofillInput(setNumber);
    hideAutocomplete();
  }

  const updateDataset = function updateDataset(data) {
    dataset = data;
    if (dataset !== null) {
      keys = Object.keys(dataset);
    }
  }


  const initialize = function initialize(targetSelector, data) {
    updateDataset(data);
    triggerInput = document.querySelector(targetSelector);
    console.log(triggerInput);
    autocomplete = triggerInput.parentNode.querySelector(autocompleteSelector);
    autocomplete.addEventListener('click', handleAutocompleteClick);
    triggerInput.addEventListener('keyup', triggerAutocomplete);
    itemTemplate = autocomplete.querySelector(`.${autocompleteItemTemplateClass}`);
    itemTemplate.classList.remove(autocompleteItemTemplateClass);
    itemTemplate.parentNode.removeChild(itemTemplate);
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
