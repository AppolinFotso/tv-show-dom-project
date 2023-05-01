//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  const selectElement = document.getElementById("selectEpisode");
  let idForEpisodeContainer = "div";
  let counter = 1;
  for (let episode of episodeList) {
    // creating html elements to display each episode info
    const episodeContainer = document.createElement("div");
    const episodeTitle = document.createElement("h2");
    const episodePoster = document.createElement("img");
    const episodeSummary = document.createElement("p");
    // creating an option element to use inside a select element
    const selectOptions = document.createElement("option");

    selectOptions.textContent = `${
      episode.season < 10 ? `S0${episode.season}` : `S${episode.season}`
    }${episode.number < 10 ? `E0${episode.number}` : `E${episode.number}`} - ${
      episode.name
    }`;
    selectOptions.setAttribute("value", `#${idForEpisodeContainer + counter}`);
    // rendering the episode name, the season and episode number inside h2
    episodeTitle.textContent = `${episode.name} - ${
      episode.season < 10 ? `S0${episode.season}` : `S${episode.season}`
    }${episode.number < 10 ? `E0${episode.number}` : `E${episode.number}`}`;
    //rendering an image inside the img element
    episodePoster.setAttribute("src", `${episode.image.medium}`);
    episodeSummary.innerHTML = `${episode.summary}`;

    //appending option inside the select element
    selectElement.appendChild(selectOptions);
    //appending h2, img, and p element inside the div element
    episodeContainer.appendChild(episodeTitle);
    episodeContainer.appendChild(episodePoster);
    episodeContainer.appendChild(episodeSummary);
    //setting the ID attribute on the div child element
    episodeContainer.setAttribute("id", idForEpisodeContainer + counter);
    //appending the div child inside the div parent
    rootElem.appendChild(episodeContainer);
    counter++;
  }
}

// taking control of the input element and creating an event listener
const inputElement = document.getElementById("searchEpisode");
inputElement.addEventListener("keyup", searchEpisodeList);
// creating a call back function for the event listener
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
