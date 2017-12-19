'use strict';
BC.Autocomplete = function() {
  const autocompleteSelector = ".bc-autocomplete",
        autocompleteVisibleClass = "bc-autocomplete--visible",
        autocompleteItemTemplateClass = "bc-autocomplete__item--template",
        itemLinkTextClass = "bc-autocomplete__item-link-text",
        itemMetadataClass = "bc-autocomplete__item-metadata";
  let dataset,
      keys,
      autocomplete,
      itemTemplate;

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
    results.forEach(function(r) {
      console.log(r);
      const result = itemTemplate.cloneNode(true),
            setNumber = result.querySelector(`.${itemLinkTextClass}`),
            setTitle = result.querySelector(`.${itemMetadataClass}`);
      setNumber.innerHTML = r.number;
      setNumber.href = `#${r.number}`;
      setTitle.innerHTML = r.title;
      autocomplete.appendChild(result);
    });
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


  const initialize = function initialize(targetSelector, data) {
    const target = document.querySelector(targetSelector);
    dataset = data;
    keys = Object.keys(dataset);
    target.addEventListener('keyup', triggerAutocomplete);
    console.log(target);
    autocomplete = target.parentNode.querySelector(autocompleteSelector);
    itemTemplate = autocomplete.querySelector(`.${autocompleteItemTemplateClass}`);
    itemTemplate.classList.remove(autocompleteItemTemplateClass);
    console.log(itemTemplate);
    itemTemplate.parentNode.removeChild(itemTemplate);
  }

  return {
    initialize: initialize
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
  BC.Autocomplete.initialize("#bc-value-lookup-form__set-number-input", setDB);
});
