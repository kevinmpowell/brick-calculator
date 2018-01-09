// 'use strict';
// BC.PortletPricePerPiece = function() {
//   const msrpPPPInputId = 'ppp-msrp',
//         userPPPInputId = 'ppp-your-price';

//   let msrpPPP,
//       userPPP;

//   const update = function update(setData, purchasePrice) {
//     msrpPPP = document.getElementById(msrpPPPInputId);
//     userPPP = document.getElementById(userPPPInputId);
//     const partCount = setData.pcs;
//     console.log(setData);

//     if (partCount !== null) {
//       if (setData.msrp !== null) {
//         msrpPPP.value = BC.Utils.formatCurrency(setData.msrp / partCount) + " per piece";
//       }

//       userPPP.value = BC.Utils.formatCurrency(purchasePrice / partCount) + " per piece";
//     }
//   }

//   return {
//     update: update
//   }
// }();
