// save options to chrome.storage
function saveOptions() {
  var serverUrl = document.getElementById("txt-server").value;
  localStorage.setItem("server.url", serverUrl);

  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.textContent = "Options saved.";

  setTimeout(function() {
    status.textContent = "";
  }, 750);
}

// stored in chrome.storage.
function restoreOptions() {
  document.getElementById("txt-server").value = localStorage.getItem("server.url") || "http://127.0.0.1:9999";
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("btn-save").addEventListener("click", saveOptions);
