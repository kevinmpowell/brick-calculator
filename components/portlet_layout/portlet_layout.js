'use strict';
BC.PortletLayout = function() {
  const emptyPortletClass = "bc-portlet--empty",
        defaultLayout = [
          {
            header: "Current Listings (New)",
            portlets: [
              {
                title: "Brick Owl",
                retrievedAtKey: "boRA",
                listingsCountKey: "boCSNLC",
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
                    label: "Cost<span class='bc-portlet__line-item-label-plus-member-snippet'> w/taxes</span>"
                  }
                ]
              },
              {
                title: "Bricklink",
                retrievedAtKey: "blRA",
                listingsCountKey: "blCSNLC",
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
                    label: "Cost<span class='bc-portlet__line-item-label-plus-member-snippet'> w/taxes</span>"
                  }
                ]
              }
            ]
          },
          {
            header: "Current Listings (Used)",
            portlets: [
              {
                title: "Brick Owl",
                retrievedAtKey: "boRA",
                listingsCountKey: "boCSULC",
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
                    label: "Cost<span class='bc-portlet__line-item-label-plus-member-snippet'> w/taxes</span>"
                  }
                ]
              },
              {
                title: "Bricklink",
                retrievedAtKey: "blRA",
                listingsCountKey: "blCSULC",
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
                    label: "Cost<span class='bc-portlet__line-item-label-plus-member-snippet'> w/taxes</span>"
                  }
                ]
              }
            ]
          }
        ],
        plusMemberPortlets = [
          {
            header: "Sold Listings (New)",
            headerClass: "bc-portlet-section-header--plus-member",
            portlets: [
              {
                title: "eBay",
                retrievedAtKey: "eRA",
                listingsCountKey: "eCSCLNLC",
                timestampLabel: "In the last 30 days",
                listingsCountSuffix: "sold",
                lineItems: [
                  {
                    key: "eCSCLNM",
                    label: "Median Value"
                  },
                  {
                    key: "eFees",
                    label: "eBay & PayPal Fees"
                  },
                  {
                    key: "setCost",
                    label: "Cost<span class='bc-portlet__line-item-label-plus-member-snippet'> w/taxes</span>"
                  }
                ]
              },
              {
                title: "Bricklink",
                retrievedAtKey: "blRA",
                listingsCountKey: "blCSCLNLC",
                timestampLabel: "In the last 6 months",
                listingsCountSuffix: "sold",
                lineItems: [
                  {
                    key: "blCSCLNM",
                    label: "Median Value"
                  },
                  {
                    key: "blFees",
                    label: "Bricklink & PayPal Fees"
                  },
                  {
                    key: "setCost",
                    label: "Cost<span class='bc-portlet__line-item-label-plus-member-snippet'> w/taxes</span>"
                  }
                ]
              }
            ]
          },
          {
            header: "Sold Listings (Used)",
            headerClass: "bc-portlet-section-header--plus-member",
            portlets: [
              {
                title: "eBay",
                retrievedAtKey: "eRA",
                listingsCountKey: "eCSCLULC",
                timestampLabel: "In the last 30 days",
                listingsCountSuffix: "sold",
                lineItems: [
                  {
                    key: "eCSCLUM",
                    label: "Median Value"
                  },
                  {
                    key: "eFees",
                    label: "eBay & PayPal Fees"
                  },
                  {
                    key: "setCost",
                    label: "Cost<span class='bc-portlet__line-item-label-plus-member-snippet'> w/taxes</span>"
                  }
                ]
              },
              {
                title: "Bricklink",
                retrievedAtKey: "blRA",
                listingsCountKey: "blCSCLULC",
                timestampLabel: "In the last 6 months",
                listingsCountSuffix: "sold",
                lineItems: [
                  {
                    key: "blCSCLUM",
                    label: "Median Value"
                  },
                  {
                    key: "blFees",
                    label: "Bricklink & PayPal Fees"
                  },
                  {
                    key: "setCost",
                    label: "Cost<span class='bc-portlet__line-item-label-plus-member-snippet'> w/taxes</span>"
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
      portletWrapper;

  function getLayout() {
    const userSettings = BC.Utils.getFromLocalStorage(localStorageKeys.userSettings);
    let layout = defaultLayout.slice(); // Using .slice() to clone so it's not referenced

    if (userSettings !== null && userSettings.plus_member) {
      layout = defaultLayout.slice().concat(plusMemberPortlets.slice()); 
    }

    return layout;
  }

  function getSectionHeader(text, headerClass) {
    let headerNode = headerTemplate.cloneNode(true),
        headerNodeText = headerNode.querySelector(".bc-portlet-section-header__text");
    headerNodeText.innerHTML = text;
    if (headerClass) {
      headerNode.classList.add(headerClass);
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

  function getPortletGrid(portlets) {
    let gridNode = gridTemplate.cloneNode(true);
    portlets.forEach(function(portlet){
      gridNode.append(getPortlet(portlet));
    });
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

  function updatePortletValues(p, data, setCost) {
    const lineItemInputs = Array.from(p.querySelectorAll(".bc-portlet__line-item-input")),
          profitInput = p.querySelector(".bc-portlet__profit-input"),
          portletRetrievedAt = p.querySelector(".bc-portlet__data-retrieved-at"),
          retrievedAtKey = portletRetrievedAt === null ? false : portletRetrievedAt.getAttribute("data-retrieved-at-key"),
          portletListingsCountAmount = p.querySelector(".bc-portlet__listings-count-amount"),
          listingsCountKey = portletListingsCountAmount === null ? false : portletListingsCountAmount.getAttribute("data-listings-count-key"),
          liKeys = lineItemInputs.map(function(li){ return li.getAttribute("data-value-key"); }),
          marketplaceValueKey = liKeys.find(function(k){ return data.hasOwnProperty(k); }),
          marketplaceValue = marketplaceValueKey ? data[marketplaceValueKey] : false,
          marketplaceFeesKey = liKeys.find(function(k){ return k.toLowerCase().includes("fees"); }),
          marketplaceFees = marketplaceFeesKey && marketplaceValue ? getMarketplaceFees(marketplaceValue, marketplaceFeesKey) : false;

    if (retrievedAtKey && data.hasOwnProperty(retrievedAtKey)) {
      portletRetrievedAt.setAttribute("datetime", data[retrievedAtKey]);
      timeago().render(portletRetrievedAt);
    }

    if (listingsCountKey && data.hasOwnProperty(listingsCountKey)) {
      portletListingsCountAmount.innerHTML = data[listingsCountKey];
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
        console.log("Could not calculate marketplace fees", liKeys);
      }

      lineItemInputs.forEach(function(i){
        const key = i.getAttribute("data-value-key");
        i.value = BC.Utils.formatCurrency(portletValues[key]);
      });

      profitInput.value = BC.Utils.formatCurrency(profit);
    } else {
      p.classList.add(emptyPortletClass);
      console.log("Marketplace Value not found", liKeys);
    }
  }

  function getSetCostWithTaxes(setCost) {
    const userSettings = BC.Utils.getFromLocalStorage(localStorageKeys.userSettings);
    setCost = parseFloat(setCost, 10);
    if (userSettings !== null && userSettings.plus_member && userSettings.taxRate) {
      const taxes = parseFloat(userSettings.taxRate / 100, 10) * setCost;
      setCost += taxes;
    }
    return setCost;
  }

  function setEventListeners() {
    document.addEventListener(customEvents.userSignedIn, buildLayout);
    document.addEventListener(customEvents.userSignedOut, buildLayout);
  }

  const updateAllPortletValues = function updateAllPortletValues(data, setCost) {
    const portlets = document.querySelectorAll(".bc-portlet"),
          cost = getSetCostWithTaxes(setCost);

    portlets.forEach(function(p){
      updatePortletValues(p, data, cost);
    })
  }

  const buildLayout = function buildLayout() {
    const layout = getLayout();
    portletWrapper.innerHTML = ''; // Clear the portlet wrapper
    layout.forEach(function(portletSection){
      portletWrapper.append(getSectionHeader(portletSection.header, portletSection.headerClass));
      portletWrapper.append(getPortletGrid(portletSection.portlets));
    });
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
