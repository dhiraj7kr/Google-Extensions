document.addEventListener('DOMContentLoaded', async () => {
  const { siteData } = await chrome.storage.local.get('siteData');
  const labels = Object.keys(siteData);
  const data = labels.map(domain => siteData[domain].time);

  const ctx = document.getElementById('usageChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Minutes Spent',
        data,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
});
