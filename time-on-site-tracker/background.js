let siteData = {};

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  const domain = new URL(tab.url).hostname;

  if (!siteData[domain]) {
    siteData[domain] = { time: 0, title: tab.title || domain };
  }

  const interval = setInterval(() => {
    siteData[domain].time += 1;
    chrome.storage.local.set({ siteData });
  }, 60000);

  chrome.tabs.onRemoved.addListener((tabId) => {
    if (tabId === activeInfo.tabId) {
      clearInterval(interval);
    }
  });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ siteData: {} });
});
