const websiteInput = document.getElementById('websiteInput');
const addWebsiteBtn = document.getElementById('addWebsite');
const openAllBtn = document.getElementById('openAll');
const websiteList = document.getElementById('websiteList');

function loadWebsites() {
  chrome.storage.local.get('websites', (data) => {
    const websites = data.websites || [];
    websiteList.innerHTML = '';
    websites.forEach((url, index) => {
      const li = document.createElement('li');

      const input = document.createElement('input');
      input.type = 'text';
      input.value = url;
      input.disabled = true;

      const actions = document.createElement('div');
      actions.classList.add('actions');

      const editBtn = document.createElement('button');
      editBtn.textContent = '✏️';
      editBtn.addEventListener('click', () => {
        input.disabled = !input.disabled;
        if (!input.disabled) {
          input.focus();
          editBtn.textContent = '💾';
        } else {
          updateWebsite(index, input.value);
          editBtn.textContent = '✏️';
        }
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '🗑️';
      deleteBtn.addEventListener('click', () => deleteWebsite(index));

      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);

      li.appendChild(input);
      li.appendChild(actions);
      websiteList.appendChild(li);
    });
  });
}

function saveWebsite(url) {
  chrome.storage.local.get('websites', (data) => {
    const websites = data.websites || [];
    websites.push(url);
    chrome.storage.local.set({ websites }, loadWebsites);
  });
}

function updateWebsite(index, newUrl) {
  chrome.storage.local.get('websites', (data) => {
    const websites = data.websites || [];
    websites[index] = newUrl;
    chrome.storage.local.set({ websites }, loadWebsites);
  });
}

function deleteWebsite(index) {
  chrome.storage.local.get('websites', (data) => {
    const websites = data.websites || [];
    websites.splice(index, 1);
    chrome.storage.local.set({ websites }, loadWebsites);
  });
}

function openAllWebsites() {
  chrome.storage.local.get('websites', (data) => {
    const websites = data.websites || [];
    websites.forEach(url => {
      const fullUrl = url.startsWith('http://') || url.startsWith('https://') ? url : 'https://' + url;
      chrome.tabs.create({ url: fullUrl });
    });
  });
}

addWebsiteBtn.addEventListener('click', () => {
  const url = websiteInput.value.trim();
  if (url) {
    saveWebsite(url);
    websiteInput.value = '';
  }
});

openAllBtn.addEventListener('click', openAllWebsites);

// Load saved websites on popup open
document.addEventListener('DOMContentLoaded', loadWebsites);
