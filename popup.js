// popup.js
const DEFAULTS = {
  enabled: true,
  brightness: 90,
  contrast: 110,
  saturation: 100,
  hue: 0
};

const ids = ["toggle", "brightness", "contrast", "saturation", "hue"];
const els = Object.fromEntries(ids.map(id => [id, document.getElementById(id)]));
const valueEls = {
  brightness: document.getElementById('brightness-value'),
  contrast: document.getElementById('contrast-value'),
  saturation: document.getElementById('saturation-value'),
  hue: document.getElementById('hue-value')
};

function updateUI(settings) {
  els.toggle.checked = settings.enabled;
  els.brightness.value = settings.brightness;
  els.contrast.value = settings.contrast;
  els.saturation.value = settings.saturation;
  els.hue.value = settings.hue;
  valueEls.brightness.textContent = settings.brightness + '%';
  valueEls.contrast.textContent = settings.contrast + '%';
  valueEls.saturation.textContent = settings.saturation + '%';
  valueEls.hue.textContent = settings.hue + '°';
}

function saveAndUpdate(settings) {
  chrome.storage.sync.set(settings, () => {
    chrome.runtime.sendMessage({ type: 'UPDATE_FILTER', settings });
  });
}

function getSettings(cb) {
  chrome.storage.sync.get(DEFAULTS, cb);
}


function onSliderChange() {
  const settings = {
    enabled: els.toggle.checked,
    brightness: Number(els.brightness.value),
    contrast: Number(els.contrast.value),
    saturation: Number(els.saturation.value),
    hue: Number(els.hue.value)
  };
  valueEls.brightness.textContent = settings.brightness + '%';
  valueEls.contrast.textContent = settings.contrast + '%';
  valueEls.saturation.textContent = settings.saturation + '%';
  valueEls.hue.textContent = settings.hue + '°';
  saveAndUpdate(settings);
}

ids.forEach(id => {
  els[id].addEventListener('input', onSliderChange);
});
els.toggle.addEventListener('change', onSliderChange);

document.getElementById('reset').addEventListener('click', () => {
  updateUI(DEFAULTS);
  saveAndUpdate(DEFAULTS);
});

getSettings(updateUI);
