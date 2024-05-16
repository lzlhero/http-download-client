
// get download url by context menu passing type.
function getUrl(info, type) {
  var url = "";

  switch(type) {
    case "page":
      url = info.pageUrl;
      break;

    case "frame":
      url = info.frameUrl;
      break;

    case "link":
      url = info.linkUrl;
      break;

    case "image":
    case "video":
    case "audio":
      url = info.srcUrl;
      break;
  }

  return url;
}

// function for context menu item click.
function onContextClick(info, tab, type) {
  var url = getUrl(info, type);
  if (!url) return;

  // get selected text from current page.
  chrome.tabs.executeScript( {
    code: "window.getSelection().toString();"
  }, function(selection) {
    var serverUrl = localStorage.getItem("server.url") || "http://127.0.0.1:9999";
    var outFile = selection[0].trim();

    // send url to http-download-server
    fetch(serverUrl + "?url=" + encodeURIComponent(url) + "&out=" + encodeURIComponent(outFile)).catch(function(error) {
      alert(chrome.i18n.getMessage("start_server_prompt"));
    });
  });
}

// create download menu item into context
function createContextMenus() {
  var getMessage = chrome.i18n.getMessage;
  const menus = [
    {
      context: "page",
      title: getMessage("download_current_page"),
    },
    {
      context: "frame",
      title: getMessage("download_current_frame"),
    },
    {
      context: "link",
      title: getMessage("download_current_link"),
    },
    {
      context: "image",
      title: getMessage("download_current_image"),
    },
    {
      context: "video",
      title: getMessage("download_current_video"),
    },
    {
      context: "audio",
      title: getMessage("download_current_audio"),
    }
  ];

  const urlPatterns = ["<all_urls>"];

  for (var i = 0; i < menus.length; i++) {
    chrome.contextMenus.create({
      title: menus[i].title,
      contexts: [menus[i].context],
      documentUrlPatterns: urlPatterns,
      targetUrlPatterns: urlPatterns,
      onclick: (function(type) {
        return function(info, tab) {
          onContextClick(info, tab, type);
        };
      })(menus[i].context)
    });
  }
}

// program enter point
createContextMenus();
