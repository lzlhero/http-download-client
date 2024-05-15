
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
      alert("需要开启下载服务器后，再进行下载");
    });
  });
}

// create download menu item into context
function createContextMenus() {
  const menus = [
    {
      context: "page",
      title: "下载当前页面",
    },
    {
      context: "frame",
      title: "下载当前框架页",
    },
    {
      context: "link",
      title: "下载当前链接",
    },
    {
      context: "image",
      title: "下载当前图片",
    },
    {
      context: "video",
      title: "下载当前视频",
    },
    {
      context: "audio",
      title: "下载当前音频",
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
