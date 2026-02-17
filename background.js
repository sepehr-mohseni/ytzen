chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({ ytzenEnabled: false });
});

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.type === 'ytzen-state') {
    chrome.storage.sync.set({ ytzenEnabled: msg.enabled });
  }
});
