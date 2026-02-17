(function () {
  'use strict';

  var toggle = document.getElementById('toggleSwitch');
  var statusText = document.getElementById('statusText');

  function updateUI(enabled) {
    toggle.checked = enabled;
    statusText.textContent = enabled ? 'ON' : 'OFF';
    statusText.classList.toggle('ytzen-active', enabled);
  }

  chrome.storage.sync.get({ ytzenEnabled: false }, function (data) {
    updateUI(data.ytzenEnabled);
  });

  toggle.addEventListener('change', function () {
    var enabled = toggle.checked;
    chrome.storage.sync.set({ ytzenEnabled: enabled });
    updateUI(enabled);

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0] && tabs[0].url && tabs[0].url.includes('youtube.com')) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'ytzen-toggle',
          enabled: enabled,
        });
      }
    });
  });
})();
