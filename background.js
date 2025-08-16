// background.js
chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.query({}, (tabs) => {
    for (let tab of tabs) {
      if (tab.id) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["content.js"]
        });
      }
    }
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'UPDATE_FILTER') {
    chrome.tabs.query({}, (tabs) => {
      for (let tab of tabs) {
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, message);
        }
      }
    });
  }
});
