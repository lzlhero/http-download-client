// html i18n localize translate
function localizeHtmlPage() {
  //localize by replacing __MSG_***__ meta tags
  var objects = document.getElementsByTagName("html");
  for (var i = 0; i < objects.length; i++) {
    var obj = objects[i];

    var valStrH = obj.innerHTML.toString();
    var valNewH = valStrH.replace(/__MSG_(\w+)__/g, function(match, v1) {
      return v1 ? chrome.i18n.getMessage(v1) : "";
    });

    if(valNewH != valStrH) {
      obj.innerHTML = valNewH;
    }
  }
}

// save options to chrome.storage
function saveOptions() {
  var serverUrl = document.getElementById("txt-server").value;
  chrome.storage.local.set({
    serverUrl: serverUrl
  });

  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.textContent = "Options saved.";

  setTimeout(function() {
    status.textContent = "";
  }, 750);
}

// stored in chrome.storage.
function restoreOptions() {
  chrome.storage.local.get(
    ["serverUrl"],
    (result) => {
      document.getElementById("txt-server").value = result["serverUrl"] || "http://127.0.0.1:9999";
    }
  );
}

// localize first
localizeHtmlPage();

// add dom events
document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("btn-save").addEventListener("click", saveOptions);
