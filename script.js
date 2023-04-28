//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
  const episodeContainer = document.createElement("div");
  const episodeTitle = document.createElement("h2");
  const episodePoster = document.createElement("img");
  const episodeSummary = document.createElement("p");
}

window.onload = setup;
