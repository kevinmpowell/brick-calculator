/* globals BC */

'use strict';
BC.PortletLayout = function() {
  const emptyPortletClass = "bc-portlet--empty",
        zebraStripedPortletSectionsClass = "bc-section--alt-background",
        defaultLayout = [
          {
            header: "Current Listings (New)",
            portlets: [
              {
                id: "blCLN",
                title: "Bricklink",
                retrievedAtKey: "blRA",
                listingsCountKey: "blCSNLC",
                marketplaceUrl: 'bricklinkCurrentListingsUrl',
                lineItems: [
                  {
                    key: "blCSNA",
                    label: "Avg Listing"
                  },
                  {
                    key: "blFees",
                    label: "Bricklink & PayPal Fees"
                  },
                  {
                    key: "setCost",
                    label: "Cost<span class='bc-portlet__line-item-label-taxes-included-snippet'> w/taxes</span>"
                  }
                ]
              },
              {
                id: "boCLN",
                title: "Brick Owl",
                retrievedAtKey: "boRA",
                listingsCountKey: "boCSNLC",
                marketplaceUrl: 'brickOwlListingsUrl',
                lineItems: [
                  {
                    key: "boCSNA",
                    label: "Avg Listing"
                  },
                  {
                    key: "boFees",
                    label: "Brick Owl & PayPal Fees"
                  },
                  {
                    key: "setCost",
                    label: "Cost<span class='bc-portlet__line-item-label-taxes-included-snippet'> w/taxes</span>"
                  }
                ]
              },
              {
                id: "eCLN",
                title: "eBay",
                retrievedAtKey: "eRA",
                listingsCountKey: "eCSNLC",
                marketplaceUrl: 'ebayCurrentListingsNewUrl',
                lineItems: [
                  {
                    key: "eCSNA",
                    label: "Avg Listing"
                  },
                  {
                    key: "eFees",
                    label: "eBay & PayPal Fees"
                  },
                  {
                    key: "setCost",
                    label: "Cost<span class='bc-portlet__line-item-label-taxes-included-snippet'> w/taxes</span>"
                  }
                ]
              }
            ]
          },
          {
            header: "Current Listings (Used)",
            portlets: [
              {
                id: "blCLU",
                title: "Bricklink",
                retrievedAtKey: "blRA",
                listingsCountKey: "blCSULC",
                marketplaceUrl: 'bricklinkCurrentListingsUrl',
                lineItems: [
                  {
                    key: "blCSUA",
                    label: "Avg Listing"
                  },
                  {
                    key: "blFees",
                    label: "Bricklink & PayPal Fees"
                  },
                  {
                    key: "setCost",
                    label: "Cost<span class='bc-portlet__line-item-label-taxes-included-snippet'> w/taxes</span>"
                  }
                ]
              },
              {
                id: "boCLU",
                title: "Brick Owl",
                retrievedAtKey: "boRA",
                listingsCountKey: "boCSULC",
                marketplaceUrl: 'brickOwlListingsUrl',
                lineItems: [
                  {
                    key: "boCSUA",
                    label: "Avg Listing"
                  },
                  {
                    key: "boFees",
                    label: "Brick Owl & PayPal Fees"
                  },
                  {
                    key: "setCost",
                    label: "Cost<span class='bc-portlet__line-item-label-taxes-included-snippet'> w/taxes</span>"
                  }
                ]
              },
              {
                id: "eCLU",
                title: "eBay",
                retrievedAtKey: "eRA",
                listingsCountKey: "eCSULC",
                marketplaceUrl: 'ebayCurrentListingsUsedUrl',
                lineItems: [
                  {
                    key: "eCSUA",
                    label: "Avg Listing"
                  },
                  {
                    key: "eFees",
                    label: "eBay & PayPal Fees"
                  },
                  {
                    key: "setCost",
                    label: "Cost<span class='bc-portlet__line-item-label-taxes-included-snippet'> w/taxes</span>"
                  }
                ]
              }
            ]
          },
          {
            header: "Sold Values (New)",
            headerClass: "",
            portlets: [
              {
                id: "blSVN",
                title: "Bricklink",
                retrievedAtKey: "blRA",
                listingsCountKey: "blCSCLNLC",
                timestampLabel: "In the last 6 months",
                listingsCountSuffix: "sold",
                marketplaceUrl: 'bricklinkSoldListingsUrl',
                lineItems: [
                  {
                    key: "blCSCLNA",
                    label: "Avg Value"
                  },
                  {
                    key: "blFees",
                    label: "Bricklink & PayPal Fees"
                  },
                  {
                    key: "setCost",
                    label: "Cost<span class='bc-portlet__line-item-label-taxes-included-snippet'> w/taxes</span>"
                  }
                ]
              },
              {
                id: "boSVN",
                title: "Brick Owl",
                retrievedAtKey: "boRA",
                listingsCountKey: "boCSCLNLC",
                timestampLabel: "In the last 6 months",
                listingsCountSuffix: "sold",
                marketplaceUrl: 'brickOwlListingsUrl',
                lineItems: [
                  {
                    key: "boCSCLNA",
                    label: "Avg Value"
                  },
                  {
                    key: "boFees",
                    label: "Brick Owl & PayPal Fees"
                  },
                  {
                    key: "setCost",
                    label: "Cost<span class='bc-portlet__line-item-label-taxes-included-snippet'> w/taxes</span>"
                  }
                ]
              },
              {
                id: "eSVN",
                title: "eBay",
                retrievedAtKey: "eRA",
                listingsCountKey: "eCSCLNLC",
                timestampLabel: "In the last 3 months",
                listingsCountSuffix: "sold",
                marketplaceUrl: 'ebaySoldListingsNewUrl',
                lineItems: [
                  {
                    key: "eCSCLNA",
                    label: "Avg Value"
                  },
                  {
                    key: "eFees",
                    label: "eBay & PayPal Fees"
                  },
                  {
                    key: "setCost",
                    label: "Cost<span class='bc-portlet__line-item-label-taxes-included-snippet'> w/taxes</span>"
                  }
                ]
              }
            ]
          },
          {
            header: "Sold Values (Used)",
            headerClass: "",
            portlets: [
              {
                id: "blSVU",
                title: "Bricklink",
                retrievedAtKey: "blRA",
                listingsCountKey: "blCSCLULC",
                timestampLabel: "In the last 6 months",
                listingsCountSuffix: "sold",
                marketplaceUrl: 'bricklinkSoldListingsUrl',
                lineItems: [
                  {
                    key: "blCSCLUA",
                    label: "Avg Value"
                  },
                  {
                    key: "blFees",
                    label: "Bricklink & PayPal Fees"
                  },
                  {
                    key: "setCost",
                    label: "Cost<span class='bc-portlet__line-item-label-taxes-included-snippet'> w/taxes</span>"
                  }
                ]
              },
              {
                id: "boSVU",
                title: "Brick Owl",
                retrievedAtKey: "boRA",
                listingsCountKey: "boCSCLULC",
                timestampLabel: "In the last 6 months",
                listingsCountSuffix: "sold",
                marketplaceUrl: 'brickOwlListingsUrl',
                lineItems: [
                  {
                    key: "boCSCLUA",
                    label: "Avg Value"
                  },
                  {
                    key: "boFees",
                    label: "Brick Owl & PayPal Fees"
                  },
                  {
                    key: "setCost",
                    label: "Cost<span class='bc-portlet__line-item-label-taxes-included-snippet'> w/taxes</span>"
                  }
                ]
              },
              {
                id: "eSVU",
                title: "eBay",
                retrievedAtKey: "eRA",
                listingsCountKey: "eCSCLULC",
                timestampLabel: "In the last 3 months",
                listingsCountSuffix: "sold",
                marketplaceUrl: 'ebaySoldListingsUsedUrl',
                lineItems: [
                  {
                    key: "eCSCLUA",
                    label: "Avg Value"
                  },
                  {
                    key: "eFees",
                    label: "eBay & PayPal Fees"
                  },
                  {
                    key: "setCost",
                    label: "Cost<span class='bc-portlet__line-item-label-taxes-included-snippet'> w/taxes</span>"
                  }
                ]
              }
            ]
          }
        ];

  let portletTemplate,
      portletLineItemTemplate,
      headerTemplate,
      gridTemplate,
      portletWrapper,
      lastSetLookupData,
      lastSetLookupCost;

  function getLayout() {
    const userSettings = BC.App.getUserSettings();
    let layout = JSON.parse(JSON.stringify(defaultLayout));

    // If this is a plus member
    if (userSettings !== null && userSettings.plus_member && userSettings.portletConfig) {
      // Loop over all sections
      for (let i = 0; i < layout.length; i++) {
        const section = layout[i];

        // Loop over all portlets within a section
        for (let j = 0; j < section.portlets.length; j++) {
          // If the plus member has chosen to hide a portlet, flag it as hidden
          const portlet = section.portlets[j];
          if (userSettings.portletConfig[portlet.id] === false) {
            portlet.hide = true;
          } else {
            portlet.hide = false;
          }
        }

        // After looping over all the portlets in this section, see if ALL of them are hidden, if so hide the whole section
        const hiddenPortlets = section.portlets.filter(function(p){ return p.hide; });
        if (hiddenPortlets.length === section.portlets.length) {
          section.hide = true;
        } else {
          section.hide = false;
        }
      }
    }

    return layout;
  }

  function getSectionHeader(text, headerClass, sectionClass) {
    let headerNode = headerTemplate.cloneNode(true),
        headerNodeText = headerNode.querySelector(".bc-portlet-section-header__text");
    headerNodeText.innerHTML = text;
    if (headerClass) {
      headerNode.classList.add(headerClass);
    }
    if (sectionClass) {
      headerNode.classList.add(sectionClass);
    }
    return headerNode;
  }

  function getPortletLineItem(lineItem) {
    let pliNode = portletLineItemTemplate.cloneNode(true),
        input = pliNode.querySelector(".bc-portlet__line-item-input"),
        label = pliNode.querySelector(".bc-portlet__line-item-label");
    label.innerHTML = lineItem.label;
    input.setAttribute("data-value-key", lineItem.key);
    return pliNode;
  }

  function getPortlet(portlet) {
    let portletNode = portletTemplate.cloneNode(true),
        portletNodeTitle = portletNode.querySelector(".bc-portlet__title"),
        portletTimestamp = portletNode.querySelector(".bc-portlet__data-timestamp"),
        portletRetrievedAt = portletNode.querySelector(".bc-portlet__data-retrieved-at"),
        portletListingsCount = portletNode.querySelector(".bc-portlet__listings-count"),
        portletListingsCountAmount = portletListingsCount.querySelector(".bc-portlet__listings-count-amount"),
        portletListingsCountSuffix = portletListingsCount.querySelector(".bc-portlet__listings-count-suffix"),
        portletLineItems = portletNode.querySelector(".bc-portlet__line-items");

    // Portlet Title
    portletNodeTitle.innerHTML = portlet.title;

    if (portlet.marketplaceUrl) {
      portletNode.setAttribute('data-marketplace-url', BC.Utils[portlet.marketplaceUrl]);
    }

    // Override retrieved at timestamp label with a string
    if (portlet.timestampLabel) {
      portletTimestamp.textContent = portlet.timestampLabel;
    } else {
      // Set retrieved at time
      portletRetrievedAt.setAttribute("data-retrieved-at-key", portlet.retrievedAtKey);
    }

    // Listings Count Amount
    if (portlet.listingsCountKey) {
      portletListingsCountAmount.setAttribute("data-listings-count-key", portlet.listingsCountKey);
    } else {
      // If the portlet doesn't have a listingsCountKey, don't show the portletListingsCountSection
      portletListingsCount.parentNode.removeChild(portletListingsCount);
    }

    // Listings Count Suffix
    if (portlet.listingsCountSuffix) {
      portletListingsCountSuffix.textContent = portlet.listingsCountSuffix;
    }


    if (portlet.lineItems) {
      portlet.lineItems.forEach(function(li){
        portletLineItems.append(getPortletLineItem(li));
      });
    }
    return portletNode;
  }

  function getPortletGrid(portlets, sectionClass) {
    let gridNode = gridTemplate.cloneNode(true);
    portlets.forEach(function(portlet){
      if (!portlet.hide) {
        gridNode.append(getPortlet(portlet));
      }
    });

    if (sectionClass) {
      gridNode.classList.add(sectionClass);
    }

    return gridNode;
  }

  function getMarketplaceFees(salePrice, feesKey) {
    switch(feesKey) {
      case 'blFees':
        return BC.Utils.getBricklinkSellerFees(salePrice);
        break;
      case 'boFees':
        return BC.Utils.getBrickOwlSellerFees(salePrice);
        break;
      case 'eFees':
        return BC.Utils.getEbaySellerFees(salePrice);
        break;
      default:
        console.log("No fee calculator for " + feesKey);
    }
  }

  function updatePortletValues(p, data, setCost, quantity) {
    const lineItemInputs = Array.from(p.querySelectorAll(".bc-portlet__line-item-input")),
          profitInput = p.querySelector(".bc-portlet__profit-input"),
          profitEachInput = p.querySelector(".bc-portlet__profit-each-input"),
          portletRetrievedAt = p.querySelector(".bc-portlet__data-retrieved-at"),
          portletNodeLink = p.querySelector(".bc-portlet__external-link"),
          title = p.querySelector(".bc-portlet__title").textContent,
          retrievedAtKey = portletRetrievedAt === null ? false : portletRetrievedAt.getAttribute("data-retrieved-at-key"),
          portletListingsCountAmount = p.querySelector(".bc-portlet__listings-count-amount"),
          listingsCountKey = portletListingsCountAmount === null ? false : portletListingsCountAmount.getAttribute("data-listings-count-key"),
          liKeys = lineItemInputs.map(function(li){ return li.getAttribute("data-value-key"); }),
          marketplaceValueKey = liKeys.find(function(k){ return data.hasOwnProperty(k); }),
          marketplaceValue = marketplaceValueKey ? data[marketplaceValueKey] : false,
          marketplaceFeesKey = liKeys.find(function(k){ return k.toLowerCase().includes("fees"); }),
          marketplaceFees = marketplaceFeesKey && marketplaceValue ? getMarketplaceFees(marketplaceValue, marketplaceFeesKey) : false,
          quantityMultiplierClass = 'bc-portlet--with-quantity-multiplier';

    if (retrievedAtKey && data.hasOwnProperty(retrievedAtKey)) {
      portletRetrievedAt.setAttribute("datetime", data[retrievedAtKey]);
      timeago().render(portletRetrievedAt);
    }

    if (listingsCountKey && data.hasOwnProperty(listingsCountKey)) {
      let listingsCount = data[listingsCountKey];

      if (title === "eBay" && data[listingsCountKey] >= 50) {
        listingsCount = "Over " + listingsCount;
      }
      portletListingsCountAmount.innerHTML = listingsCount;
    }

    if (p.dataset['marketplace-url']) {
      const baseUrl = p.dataset['marketplace-url'];
      let href = baseUrl.replace(/!{setNumber}/, data.n);

      if (data.boURL) {
        href = href.replace(/!{brickOwlUrl}/, data.boURL);
      }
      portletNodeLink.setAttribute('href', href);
    }

    let profit = Math.abs(setCost) * -1,
        portletValues = {
          setCost: setCost
        };

    if (marketplaceValue) {
      p.classList.remove(emptyPortletClass);
      portletValues[marketplaceValueKey] = marketplaceValue;
      profit += marketplaceValue;

      if (marketplaceFees) {
        portletValues[marketplaceFeesKey] = marketplaceFees;
        profit -= marketplaceFees;
      } else {
        // console.log("Could not calculate marketplace fees", liKeys);
      }

      lineItemInputs.forEach(function(i){
        const key = i.getAttribute("data-value-key");
        i.value = BC.Utils.formatCurrency(portletValues[key]);
      });

      if (quantity > 1) {
        p.classList.add(quantityMultiplierClass);
        profitEachInput.value = quantity + " @ " + BC.Utils.formatCurrency(profit) + " each";
        profit = profit * quantity;
      } else {
        p.classList.remove(quantityMultiplierClass);
      }

      profitInput.value = BC.Utils.formatCurrency(profit);
    } else {
      p.classList.add(emptyPortletClass);
      // console.log("Marketplace Value not found", liKeys);
    }
  }

  function getSetCostWithTaxes(setCost) {
    const userSettings = BC.App.getUserSettings();
    setCost = parseFloat(setCost, 10);
    if (userSettings !== null && userSettings.plus_member && userSettings.taxRate && userSettings.enableTaxes) {
      const taxes = parseFloat(userSettings.taxRate / 100, 10) * setCost;
      setCost += taxes;
    }
    return setCost;
  }

  function setEventListeners() {
    document.addEventListener(customEvents.userSignedIn, buildLayout);
    document.addEventListener(customEvents.userSignedOut, buildLayout);
    document.addEventListener(customEvents.currencyUpdated, buildLayout);
    document.addEventListener(customEvents.preferencesUpdated, buildLayout);
  }

  const updateAllPortletValues = function updateAllPortletValues(data, setCost, quantity) {
    const portlets = document.querySelectorAll(".bc-portlet"),
          cost = getSetCostWithTaxes(setCost);

    lastSetLookupData = data;
    lastSetLookupCost = setCost;

    portlets.forEach(function(p){
      updatePortletValues(p, data, cost, quantity);
    });
  };

  const buildLayout = function buildLayout() {
    const layout = getLayout();
    let sectionClass = false;
    portletWrapper.innerHTML = ''; // Clear the portlet wrapper
    layout.forEach(function(portletSection){
      if (!portletSection.hide) {
        portletWrapper.append(getSectionHeader(portletSection.header, portletSection.headerClass, sectionClass));
        portletWrapper.append(getPortletGrid(portletSection.portlets, sectionClass));
        sectionClass = sectionClass ? false : zebraStripedPortletSectionsClass;
      }
    });

    if (lastSetLookupData) {
      updateAllPortletValues(lastSetLookupData, lastSetLookupCost);
    }
  }

  const initialize = function initialize() {
    portletTemplate = document.getElementById('bc-portlet-template');
    portletLineItemTemplate = portletTemplate.querySelector('.bc-portlet__line-item');
    headerTemplate = document.getElementById('bc-portlet-section-header-template');
    gridTemplate = document.getElementById('bc-portlet-grid-template');
    portletWrapper = document.querySelector('.bc-portlet-section-wrapper');
    portletLineItemTemplate.parentNode.removeChild(portletLineItemTemplate);
    portletTemplate.parentNode.removeChild(portletTemplate);
    headerTemplate.parentNode.removeChild(headerTemplate);
    gridTemplate.parentNode.removeChild(gridTemplate);
    portletTemplate.removeAttribute("id");
    headerTemplate.removeAttribute("id");
    gridTemplate.removeAttribute("id");
    setEventListeners();
  }

  return {
    initialize: initialize,
    buildLayout: buildLayout,
    updateAllPortletValues: updateAllPortletValues
  }
}();
