
// boCSNA: 30.39

// boCSNH: 41.87

// boCSNL: 24.13

// boCSNLC: 35

// boCSNM: 28.71

// boMA: 9.09

// boMH: 54.62

// boML: 6.1

// boMM: 7.82

// boPON: 42.77

// boPOU: 27.23

// boRA: "2018-01-09T04:58:24.784Z"

// k: "70901-1"

// msrp: 19.99

// n: "70901"

// nv: "1"

// pcs: 201

// t: "Mr. Freeze Ice Attack"

// y: 2017

'use strict';
BC.PortletLayout = function() {
  const emptyPortletClass = "bc-portlet--empty",
    defaultLayout = [
    {
      header: "Complete Set Values (New)",
      portlets: [
        {
          title: "Brick Owl",
          retrievedAtKey: "boRA",
          listingsCountKey: "boCSNLC",
          lineItems: [
            {
              key: "boCSNM",
              label: "Median Listing"
            },
            {
              key: "boFees",
              label: "BrickOwl & PayPal Fees"
            },
            {
              key: "setCost",
              label: "Cost<span class='bc-portlet__line-item-label-plus-member-snippet'> w/taxes</span>"
            }
          ]
        },
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
          title: "Brick Owl",
          retrievedAtKey: "boRA",
          listingsCountKey: "boCSNLC",
          lineItems: [
            {
              key: "boCSNL",
              label: "Lowest Listing"
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
          title: "Brick Owl",
          retrievedAtKey: "boRA",
          listingsCountKey: "boCSNLC",
          lineItems: [
            {
              key: "boCSNH",
              label: "High Listing"
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
        }
      ]
    },
    {
      header: "Complete Set Values (Used)",
      portlets: [
        {
          title: "Brick Owl",
          retrievedAtKey: "boRA",
          listingsCountKey: "boCSULC",
          lineItems: [
            {
              key: "boCSUM",
              label: "Median Listing"
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
          title: "Brick Owl",
          retrievedAtKey: "boRA",
          listingsCountKey: "boCSULC",
          lineItems: [
            {
              key: "boCSUL",
              label: "Low Listing"
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
          title: "Brick Owl",
          retrievedAtKey: "boRA",
          listingsCountKey: "boCSULC",
          lineItems: [
            {
              key: "boCSUH",
              label: "High Listing"
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
        }
      ]
    },
    {
      header: "Part Out Values",
      portlets: [
      {
        title: "Brick Owl (Used)",
        retrievedAtKey: "boRA",
        lineItems: [
          {
            key: "boPOU",
            label: "Avg Value"
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
        title: "Brick Owl (New)",
        retrievedAtKey: "boRA",
        lineItems: [
          {
            key: "boPON",
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
    return defaultLayout;
  }

  function getSectionHeader(text) {
    let headerNode = headerTemplate.cloneNode(true),
        headerNodeText = headerNode.querySelector(".bc-portlet-section-header__text");
    headerNodeText.innerHTML = text;
    return headerNode;
  }

  function getPortletLineItem(lineItem) {
    let pliNode = portletLineItemTemplate.cloneNode(true),
        input = pliNode.querySelector(".bc-portlet__line-item-input"),
        label = pliNode.querySelector(".bc-portlet__line-item-label");
    console.log(lineItem.label);
    label.innerHTML = lineItem.label;
    console.log(label);
    input.setAttribute("data-value-key", lineItem.key);
    return pliNode;
  }

  function getPortlet(portlet) {
    let portletNode = portletTemplate.cloneNode(true),
        portletNodeTitle = portletNode.querySelector(".bc-portlet__title"),
        portletRetrievedAt = portletNode.querySelector(".bc-portlet__data-retrieved-at"),
        portletListingsCount = portletNode.querySelector(".bc-portlet__listings-count"),
        portletListingsCountAmount = portletListingsCount.querySelector(".bc-portlet__listings-count-amount"),
        portletLineItems = portletNode.querySelector(".bc-portlet__line-items");
    portletNodeTitle.innerHTML = portlet.title;
    portletRetrievedAt.setAttribute("data-retrieved-at-key", portlet.retrievedAtKey);
    if (portlet.listingsCountKey) {
      portletListingsCountAmount.setAttribute("data-listings-count-key", portlet.listingsCountKey);
    } else {
      // If the portlet doesn't have a listingsCountKey, don't show the portletListingsCountSection
      portletListingsCount.parentNode.removeChild(portletListingsCount);
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
      case 'boFees':
        return BC.Utils.getBrickOwlSellerFees(salePrice);
        break;
    }
  }

  function updatePortletValues(p, data, setCost) {
    const lineItemInputs = Array.from(p.querySelectorAll(".bc-portlet__line-item-input")),
          profitInput = p.querySelector(".bc-portlet__profit-input"),
          portletRetrievedAt = p.querySelector(".bc-portlet__data-retrieved-at"),
          retrievedAtKey = portletRetrievedAt.getAttribute("data-retrieved-at-key"),
          portletListingsCountAmount = p.querySelector(".bc-portlet__listings-count-amount"),
          listingsCountKey = portletListingsCountAmount === null ? false : portletListingsCountAmount.getAttribute("data-listings-count-key"),
          liKeys = lineItemInputs.map(function(li){ return li.getAttribute("data-value-key"); }),
          marketplaceValueKey = liKeys.find(function(k){ return data.hasOwnProperty(k); }),
          marketplaceValue = marketplaceValueKey ? data[marketplaceValueKey] : false,
          marketplaceFeesKey = liKeys.find(function(k){ return k.toLowerCase().includes("fees"); }),
          marketplaceFees = marketplaceFeesKey && marketplaceValue ? getMarketplaceFees(marketplaceValue, marketplaceFeesKey) : false;

    if (data.hasOwnProperty(retrievedAtKey)) {
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

  const updateAllPortletValues = function updateAllPortletValues(data, setCost) {
    const portlets = document.querySelectorAll(".bc-portlet"),
          cost = getSetCostWithTaxes(setCost);

    portlets.forEach(function(p){
      updatePortletValues(p, data, cost);
    })
  }

  const buildLayout = function buildLayout() {
    const layout = getLayout();
    let layoutHtml;
    layout.forEach(function(portletSection){
      portletWrapper.append(getSectionHeader(portletSection.header));
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
  }

  return {
    initialize: initialize,
    buildLayout: buildLayout,
    updateAllPortletValues: updateAllPortletValues
  }
}();
