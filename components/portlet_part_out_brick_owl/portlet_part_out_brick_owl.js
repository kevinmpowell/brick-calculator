'use strict';
BC.PortletPartOutBrickOwl = function() {
  const boPoNewInputId = 'bo-po-new',
        boPoUsedInputId = 'bo-po-used',
        boPoNewProfitInputId = 'bo-po-profit-new',
        boPoUsedProfitInputId = 'bo-po-profit-used',
        boPoCostNewInputId = 'bo-po-cost-new',
        boPoCostUsedInputId = 'bo-po-cost-used';

  let boPoNew,
      boPoUsed,
      boPoNewProfit,
      boPoUsedProfit,
      boPoCostNew,
      boPoCostUsed;

  const update = function update(setData, purchasePrice) {
    boPoNew = document.getElementById(boPoNewInputId);
    boPoUsed = document.getElementById(boPoUsedInputId);
    boPoNewProfit = document.getElementById(boPoNewProfitInputId);
    boPoUsedProfit = document.getElementById(boPoUsedProfitInputId);
    boPoCostNew = document.getElementById(boPoCostNewInputId);
    boPoCostUsed = document.getElementById(boPoCostUsedInputId);

    if (setData.boPON) {
      const newValue = setData.boPON,
            usedValue = setData.boPOU;

      if (newValue !== null) {
        boPoNew.value = BC.Utils.formatCurrency(newValue);
        boPoCostNew.value = BC.Utils.formatCurrency(purchasePrice);
        boPoNewProfit.value = BC.Utils.formatCurrency(newValue - purchasePrice);
      }

      if (usedValue !== null) {
        boPoUsed.value = BC.Utils.formatCurrency(usedValue);
        boPoCostUsed.value = BC.Utils.formatCurrency(purchasePrice);
        boPoUsedProfit.value = BC.Utils.formatCurrency(usedValue - purchasePrice);
      }
    }
  }

  return {
    update: update
  }
}();
