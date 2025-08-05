let latestVersion;

async function fetchLatestVersion() {
  if (latestVersion) return latestVersion;
  const versionRes = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
  const versions = await versionRes.json();
  latestVersion = versions[0];
  return latestVersion;
}

async function fetchChampions() {
  try {
    const latest = await fetchLatestVersion();
    const championsRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/${latest}/data/en_US/tft-champion.json`);
    const championsData = await championsRes.json();
    const championsList = document.getElementById('championsList');
    Object.values(championsData.data).forEach(champion => {
      const li = document.createElement('li');
      const img = document.createElement('img');
      img.src = `https://ddragon.leagueoflegends.com/cdn/${latest}/img/tft-champion/${champion.image.full}`;
      img.alt = champion.name;
      li.appendChild(img);
      const span = document.createElement('span');
      span.textContent = champion.name;
      li.appendChild(span);
      championsList.appendChild(li);
    });
  } catch (err) {
    console.error('Error fetching champions', err);
  }
}

async function fetchItems() {
  try {
    const latest = await fetchLatestVersion();
    const itemsRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/${latest}/data/en_US/tft-item.json`);
    const itemsData = await itemsRes.json();
    const itemsList = document.getElementById('itemsList');
    Object.values(itemsData.data).forEach(item => {
      const li = document.createElement('li');
      const img = document.createElement('img');
      img.src = `https://ddragon.leagueoflegends.com/cdn/${latest}/img/tft-item/${item.image.full}`;
      img.alt = item.name;
      li.appendChild(img);
      const span = document.createElement('span');
      span.textContent = item.name;
      li.appendChild(span);
      itemsList.appendChild(li);
    });
  } catch (err) {
    console.error('Error fetching items', err);
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
  fetchItems();
});
