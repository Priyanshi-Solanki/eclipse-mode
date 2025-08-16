// content.js
const DEFAULTS = {
  enabled: true,
  brightness: 90,
  contrast: 110,
  saturation: 100,
  hue: 0
};

let eclipseStyleTag = null;
function applyFilter(settings) {
  if (!eclipseStyleTag) {
    eclipseStyleTag = document.createElement('style');
    eclipseStyleTag.id = 'eclipse-dark-style';
    document.head.appendChild(eclipseStyleTag);
  }
  if (!settings.enabled) {
    document.documentElement.style.filter = '';
    if (eclipseStyleTag) eclipseStyleTag.textContent = '';
    return;
  }
  document.documentElement.style.filter =
    `brightness(${settings.brightness}%) contrast(${settings.contrast}%) saturate(${settings.saturation}%) hue-rotate(${settings.hue}deg)`;
  eclipseStyleTag.textContent = `
    html, body {
      background: #121212 !important;
      color: #f4f4f5 !important;
    }
    body * {
      background: transparent !important;
      color: #f4f4f5 !important;
      border-color: #333 !important;
    }
    a, a * { color: #8ab4f8 !important; }
    input, textarea, select, button {
      background: #23232b !important;
      color: #f4f4f5 !important;
      border-color: #444 !important;
    }
  `;
}

function loadAndApply() {
  chrome.storage.sync.get(DEFAULTS, (settings) => {
    applyFilter(settings);
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'UPDATE_FILTER') {
    applyFilter(message.settings);
  }
});

// Always apply filter on page load and when DOM changes (for SPAs)
loadAndApply();
const observer = new MutationObserver(() => {
  loadAndApply();
});
observer.observe(document.documentElement, { attributes: true, childList: true, subtree: true });
