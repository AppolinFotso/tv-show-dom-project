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
const inputElement = document.getElementById("searchEpisode");
inputElement.addEventListener("keyup", searchEpisodeList);

function searchEpisodeList() {
  const rootElem = document.getElementById("root");
  const divSearchContainer = document.getElementById("search");
  const numberOfEpisodeFound = document.getElementById("displaying");
  const allEpisodes = getAllEpisodes();
  const matchingEpisodes = [];
  if (inputElement.value == "") {
    rootElem.innerHTML = ``;
    numberOfEpisodeFound.style.display = "none";
    makePageForEpisodes(allEpisodes);
  } else {
    rootElem.innerHTML = ``;
    for (let episode of allEpisodes) {
      if (
        episode.name.toLowerCase().includes(inputElement.value.toLowerCase()) ||
        episode.summary.toLowerCase().includes(inputElement.value.toLowerCase())
      ) {
        matchingEpisodes.push(episode);
      }
    }
    numberOfEpisodeFound.style.display = "";

    numberOfEpisodeFound.textContent = `Displaying ${matchingEpisodes.length} of ${allEpisodes.length} episodes`;
    divSearchContainer.appendChild(numberOfEpisodeFound);
    makePageForEpisodes(matchingEpisodes);
  }
}

window.onload = setup;
