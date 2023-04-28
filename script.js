//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  for (let episode of episodeList) {
    const episodeContainer = document.createElement("div");
    const episodeTitle = document.createElement("h2");
    const episodePoster = document.createElement("img");
    const episodeSummary = document.createElement("p");

    episodeTitle.textContent = `${episode.name} - ${
      episode.season < 10 ? `S0${episode.season}` : `S${episode.season}`
    }${episode.number < 10 ? `E0${episode.number}` : `E${episode.number}`}`;
    episodePoster.setAttribute("src", `${episode.image.medium}`);
    episodeSummary.innerHTML = `${episode.summary}`;
    episodeContainer.appendChild(episodeTitle);
    episodeContainer.appendChild(episodePoster);
    episodeContainer.appendChild(episodeSummary);
    rootElem.appendChild(episodeContainer);
  }
}

window.onload = setup;
