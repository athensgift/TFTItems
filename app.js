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
    const [championsRes, itemsRes, recRes] = await Promise.all([
      fetch(`https://ddragon.leagueoflegends.com/cdn/${latest}/data/en_US/tft-champion.json`),
      fetch(`https://ddragon.leagueoflegends.com/cdn/${latest}/data/en_US/tft-item.json`),
      fetch('recommendations.json')
    ]);
    const championsData = await championsRes.json();
    const itemsData = await itemsRes.json();
    const recData = await recRes.json();
    const itemMap = {};
    Object.values(itemsData.data).forEach(item => {
      itemMap[item.name] = item.image.full;
    });
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

      const recItems = recData.championItems[champion.name];
      if (recItems) {
        const itemsUl = document.createElement('ul');
        itemsUl.classList.add('champion-items');
        recItems.sort((a, b) => a.priority - b.priority).forEach(item => {
          const itemLi = document.createElement('li');
          const itemImg = document.createElement('img');
          const imgName = itemMap[item.name];
          if (imgName) {
            itemImg.src = `https://ddragon.leagueoflegends.com/cdn/${latest}/img/tft-item/${imgName}`;
            itemImg.alt = item.name;
            itemLi.appendChild(itemImg);
          }
          const itemSpan = document.createElement('span');
          itemSpan.textContent = `${item.priority}. ${item.name}`;
          itemLi.appendChild(itemSpan);
          itemsUl.appendChild(itemLi);
        });
        li.appendChild(itemsUl);
      }

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
  const compsTab = document.getElementById('compsTab');
  const itemsContent = document.getElementById('itemsContent');
  const championsContent = document.getElementById('championsContent');
  const compsContent = document.getElementById('compsContent');

  itemsTab.addEventListener('click', () => {
    itemsTab.classList.add('active');
    championsTab.classList.remove('active');
    compsTab.classList.remove('active');
    itemsContent.classList.add('active');
    championsContent.classList.remove('active');
    compsContent.classList.remove('active');
  });

  championsTab.addEventListener('click', () => {
    championsTab.classList.add('active');
    itemsTab.classList.remove('active');
    compsTab.classList.remove('active');
    championsContent.classList.add('active');
    itemsContent.classList.remove('active');
    compsContent.classList.remove('active');
  });

  compsTab.addEventListener('click', () => {
    compsTab.classList.add('active');
    itemsTab.classList.remove('active');
    championsTab.classList.remove('active');
    compsContent.classList.add('active');
    itemsContent.classList.remove('active');
    championsContent.classList.remove('active');
  });
}

async function fetchComps() {
  try {
    const latest = await fetchLatestVersion();
    const [championsRes, recRes] = await Promise.all([
      fetch(`https://ddragon.leagueoflegends.com/cdn/${latest}/data/en_US/tft-champion.json`),
      fetch('recommendations.json')
    ]);
    const championsData = await championsRes.json();
    const recData = await recRes.json();
    const champMap = {};
    Object.values(championsData.data).forEach(ch => {
      champMap[ch.name] = ch.image.full;
    });
    const compsList = document.getElementById('compsList');
    recData.comps.forEach(comp => {
      const compLi = document.createElement('li');
      const title = document.createElement('div');
      title.textContent = `${comp.name} (${comp.popularity}% popularity)`;
      title.classList.add('comp-title');
      compLi.appendChild(title);
      const champsUl = document.createElement('ul');
      champsUl.classList.add('comp-champions');
      comp.champions.forEach(name => {
        const cLi = document.createElement('li');
        const cImg = document.createElement('img');
        const imgName = champMap[name];
        if (imgName) {
          cImg.src = `https://ddragon.leagueoflegends.com/cdn/${latest}/img/tft-champion/${imgName}`;
          cImg.alt = name;
        }
        cLi.appendChild(cImg);
        champsUl.appendChild(cLi);
      });
      compLi.appendChild(champsUl);
      compsList.appendChild(compLi);
    });
  } catch (err) {
    console.error('Error fetching comps', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  fetchChampions();
  fetchItems();
  fetchComps();
});
