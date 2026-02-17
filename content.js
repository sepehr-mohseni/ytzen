(function () {
  'use strict';

  /* ── Configurable Selectors ──────────────────────────────── */
  const SELECTORS_TO_HIDE = [
    '#secondary',
    '#related',
    '#comments',
    'ytd-watch-next-secondary-results-renderer',
    'ytd-comments#comments',
    'ytd-rich-grid-renderer',
    'ytd-browse[page-subtype="home"] ytd-rich-grid-renderer',
    'ytd-browse[page-subtype="home"] #contents.ytd-rich-grid-renderer',
    '.ytd-watch-next-secondary-results-renderer',
    '#chat',
    'ytd-merch-shelf-renderer',
  ];

  const SELECTOR_STRING = SELECTORS_TO_HIDE.join(', ');

  let researchMode = false;
  let toggleBtn = null;
  let observer = null;

  /* ── Storage ─────────────────────────────────────────────── */
  function loadState(callback) {
    if (chrome && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.get({ ytzenEnabled: false }, function (data) {
        callback(data.ytzenEnabled);
      });
    } else {
      callback(localStorage.getItem('ytzen-enabled') === 'true');
    }
  }

  function saveState(enabled) {
    if (chrome && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.set({ ytzenEnabled: enabled });
    } else {
      localStorage.setItem('ytzen-enabled', String(enabled));
    }
  }

  /* ── Apply / Remove Hiding ───────────────────────────────── */
  function applyHiding() {
    document.querySelectorAll(SELECTOR_STRING).forEach(function (el) {
      el.classList.add('ytzen-hidden');
    });
  }

  function removeHiding() {
    document.querySelectorAll('.ytzen-hidden').forEach(function (el) {
      el.classList.remove('ytzen-hidden');
    });
  }

  function syncState() {
    if (researchMode) {
      applyHiding();
    } else {
      removeHiding();
    }
    updateButton();
  }

  /* ── Toggle Button ───────────────────────────────────────── */
  function createToggleButton() {
    if (document.getElementById('ytzen-toggle')) return;

    toggleBtn = document.createElement('button');
    toggleBtn.id = 'ytzen-toggle';
    toggleBtn.setAttribute('aria-label', 'Toggle YtZen Research Mode');
    toggleBtn.innerHTML =
      '<span class="ytzen-dot"></span><span class="ytzen-label">YtZen</span>';

    toggleBtn.addEventListener('click', function () {
      researchMode = !researchMode;
      saveState(researchMode);
      syncState();
      chrome.runtime.sendMessage({ type: 'ytzen-state', enabled: researchMode });
    });

    document.body.appendChild(toggleBtn);
    updateButton();
  }

  function updateButton() {
    if (!toggleBtn) return;
    var label = toggleBtn.querySelector('.ytzen-label');
    if (researchMode) {
      toggleBtn.className = 'ytzen-on';
      label.textContent = 'YtZen ON';
    } else {
      toggleBtn.className = 'ytzen-off';
      label.textContent = 'YtZen OFF';
    }
  }

  /* ── MutationObserver for SPA Navigation ─────────────────── */
  function startObserver() {
    if (observer) return;

    observer = new MutationObserver(function () {
      if (researchMode) {
        applyHiding();
      }
      if (!document.getElementById('ytzen-toggle')) {
        createToggleButton();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  /* ── Listen for Messages from Popup ──────────────────────── */
  function listenForMessages() {
    if (chrome && chrome.runtime && chrome.runtime.onMessage) {
      chrome.runtime.onMessage.addListener(function (msg) {
        if (msg.type === 'ytzen-toggle') {
          researchMode = msg.enabled;
          syncState();
        }
      });
    }
  }

  /* ── Init ────────────────────────────────────────────────── */
  function init() {
    loadState(function (enabled) {
      researchMode = enabled;
      createToggleButton();
      syncState();
      startObserver();
      listenForMessages();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
