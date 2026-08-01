
// get download url by context menu.
function getUrl(info) {
  var url = "";

  switch(info.menuItemId) {
    case "download-page":
      url = info.pageUrl;
      break;

    case "download-frame":
      url = info.frameUrl;
      break;

    case "download-link":
      url = info.linkUrl;
      break;

    case "download-image":
    case "download-video":
    case "download-audio":
      url = info.srcUrl;
      break;
  }

  return url;
}

// create download menu items
chrome.runtime.onInstalled.addListener(() => {
  var getMessage = chrome.i18n.getMessage;
  const menus = [
    {
      id: "download-page",
      title: getMessage("download_current_page"),
      context: ["page"],
    },
    {
      id: "download-frame",
      title: getMessage("download_current_frame"),
      context: ["frame"],
    },
    {
      id: "download-link",
      title: getMessage("download_current_link"),
      context: ["link"],
    },
    {
      id: "download-image",
      title: getMessage("download_current_image"),
      context: ["image"],
    },
    {
      id: "download-video",
      title: getMessage("download_current_video"),
      context: ["video"],
    },
    {
      id: "download-audio",
      title: getMessage("download_current_audio"),
      context: ["audio"],
    }
  ];

  const urlPatterns = ["<all_urls>"];

  for (var i = 0; i < menus.length; i++) {
    chrome.contextMenus.create({
      id: menus[i].id,
      title: menus[i].title,
      contexts: menus[i].context,
      documentUrlPatterns: urlPatterns,
      targetUrlPatterns: urlPatterns
    });
  }
});

// handle context menu item when it clicked
chrome.contextMenus.onClicked.addListener((info, tab) => {
  var url = getUrl(info);
  if (!url) return;

  chrome.storage.local.get(
    ["serverUrl"],
    (result) => {
      var serverUrl = result["serverUrl"] || "http://127.0.0.1:9999";
      var outFile = info.selectionText ? info.selectionText.trim() : "";

      // send url to http-download-server
      fetch(serverUrl + "?url=" + encodeURIComponent(url) + "&out=" + encodeURIComponent(outFile))
        .catch((error) => {

          // alert
          chrome.scripting.executeScript({
            target: {
              tabId: tab.id
            },
            func: () => {
              alert(chrome.i18n.getMessage("start_server_prompt"));
            }
          });
        });
    }
  );
});
