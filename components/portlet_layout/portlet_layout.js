'use strict';
BC.PortletLayout = function() {
  const defaultLayout = [
    {
      header: "Complete Set Values",
      portlets: [
        {
          title: "Brick Owl"
        },
        {
          title: "Bricklink"
        },
        {
          title: "eBay"
        },
        {
          title: "Craigslist"
        }
      ]
    },
    {
      header: "Part Out Values",
      portlets: [
        {
          title: "Brick Owl"
        },
        {
          title: "Bricklink"
        }
      ]
    },
    {
      header: "Minifig Values",
      portlets: [
        {
          title: "Brick Owl"
        },
        {
          title: "Bricklink"
        }
      ]
    }
  ];

  let portletTemplate,
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

  function getPortlet(portlet) {
    let portletNode = portletTemplate.cloneNode(true),
        portletNodeTitle = portletNode.querySelector(".bc-portlet__title");
    portletNodeTitle.innerHTML = portlet.title;
    return portletNode;
  }

  function getPortletGrid(portlets) {
    let gridNode = gridTemplate.cloneNode(true);
    portlets.forEach(function(portlet){
      gridNode.append(getPortlet(portlet));
    });
    return gridNode;
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
    portletTemplate = document.getElementById('bc-portlet-template'),
    headerTemplate = document.getElementById('bc-portlet-section-header-template'),
    gridTemplate = document.getElementById('bc-portlet-grid-template'),
    portletWrapper = document.querySelector('.bc-portlet-section-wrapper');
    portletTemplate.parentNode.removeChild(portletTemplate);
    headerTemplate.parentNode.removeChild(headerTemplate);
    gridTemplate.parentNode.removeChild(gridTemplate);
    portletTemplate.removeAttribute("id");
    headerTemplate.removeAttribute("id");
    gridTemplate.removeAttribute("id");
  }

  return {
    initialize: initialize,
    buildLayout: buildLayout
  }
}();
