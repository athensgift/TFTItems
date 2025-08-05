async function fetchChampions() {
  try {
    const versionRes = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
    const versions = await versionRes.json();
    const latest = versions[0];
    const championsRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/${latest}/data/en_US/tft-champion.json`);
    const championsData = await championsRes.json();
    const championsList = document.getElementById('championsList');
    Object.values(championsData.data).forEach(champion => {
      const li = document.createElement('li');
      li.textContent = champion.name;
      championsList.appendChild(li);
    });
  } catch (err) {
    console.error('Error fetching champions', err);
  }
}

function setupTabs() {
  const itemsTab = document.getElementById('itemsTab');
  const championsTab = document.getElementById('championsTab');
  const itemsContent = document.getElementById('itemsContent');
  const championsContent = document.getElementById('championsContent');

  itemsTab.addEventListener('click', () => {
    itemsTab.classList.add('active');
    championsTab.classList.remove('active');
    itemsContent.classList.add('active');
    championsContent.classList.remove('active');
  });

  championsTab.addEventListener('click', () => {
    championsTab.classList.add('active');
    itemsTab.classList.remove('active');
    championsContent.classList.add('active');
    itemsContent.classList.remove('active');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  fetchChampions();
});
