'use strict';
BC.PortletLayout = function() {
  const emptyPortletClass = "bc-portlet--empty",
    defaultLayout = [
    {
      header: "Complete Set Values",
      portlets: [
        {
          title: "Brick Owl (Used)",
          retrievedAtKey: "boRA",
          lineItems: [
            {
              key: "boCSUA",
              label: "Avg Listing"
            },
            {
              key: "boFees",
              label: "Seller Fees"
            },
            {
              key: "setCost",
              label: "Cost"
            }
          ]
        },
        {
          title: "Brick Owl (New)",
          retrievedAtKey: "boRA",
          lineItems: [
            {
              key: "boCSNA",
              label: "Avg Listing"
            },
            {
              key: "boFees",
              label: "Seller Fees"
            },
            {
              key: "setCost",
              label: "Cost"
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
            label: "Seller Fees"
          },
          {
            key: "setCost",
            label: "Cost"
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
            label: "Seller Fees"
          },
          {
            key: "setCost",
            label: "Cost"
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
    label.innerHTML = lineItem.label;
    input.setAttribute("data-value-key", lineItem.key);
    return pliNode;
  }

  function getPortlet(portlet) {
    let portletNode = portletTemplate.cloneNode(true),
        portletNodeTitle = portletNode.querySelector(".bc-portlet__title"),
        portletRetrievedAt = portletNode.querySelector(".bc-portlet__data-retrieved-at"),
        portletLineItems = portletNode.querySelector(".bc-portlet__line-items");
    portletNodeTitle.innerHTML = portlet.title;
    portletRetrievedAt.setAttribute("data-retrieved-at-key", portlet.retrievedAtKey);
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
          liKeys = lineItemInputs.map(function(li){ return li.getAttribute("data-value-key"); }),
          marketplaceValueKey = liKeys.find(function(k){ return data.hasOwnProperty(k); }),
          marketplaceValue = marketplaceValueKey ? data[marketplaceValueKey] : false,
          marketplaceFeesKey = liKeys.find(function(k){ return k.toLowerCase().includes("fees"); }),
          marketplaceFees = marketplaceFeesKey && marketplaceValue ? getMarketplaceFees(marketplaceValue, marketplaceFeesKey) : false;

    if (data.hasOwnProperty(retrievedAtKey)) {
      portletRetrievedAt.setAttribute("datetime", data[retrievedAtKey]);
      timeago().render(portletRetrievedAt);
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

  const updateAllPortletValues = function updateAllPortletValues(data, setCost) {
    const portlets = document.querySelectorAll(".bc-portlet"),
          cost = parseFloat(setCost, 10);

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
