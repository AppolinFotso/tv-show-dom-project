const rootElem = document.getElementById("root");
const selectEpisode = document.getElementById("selectEpisode");
const selectShow = document.querySelector("#selectShow");
const inputElement = document.getElementById("searchEpisode");
const unorderedShowlist = getAllShows();
const allShows = [];
let alphaBet = "abcdefghijklmnopqrstuvwxyz";
let episodes;

function makePageForEpisodes(episodeList) {
  // taking control of the div and select elements.
  rootElem.innerHTML = ``;
  selectEpisode.innerHTML = ``;
  // creating variables that will be passed as id attribute to identify the div holding each episode.
  let idForEpisodeContainer = "div";
  let counter = 1;

  // Iterating through the Array of episodes while creating html elements to display each episode info.
  for (let episode of episodeList) {
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

    // rendering the episode name, season and episode number inside h2
    episodeTitle.textContent = `${episode.name} - ${
      episode.season < 10 ? `S0${episode.season}` : `S${episode.season}`
    }${episode.number < 10 ? `E0${episode.number}` : `E${episode.number}`}`;
    //rendering an image inside the img element
    episodePoster.setAttribute("src", `${episode.image.medium}`);
    episodeSummary.innerHTML = `${episode.summary}`;

    //appending option inside the select element
    selectEpisode.appendChild(selectOptions);
    //appending h2, img, and p element inside the div element
    episodeContainer.appendChild(episodeTitle);
    episodeContainer.appendChild(episodePoster);
    episodeContainer.appendChild(episodeSummary);
    //setting the ID attribute on the div element
    episodeContainer.setAttribute("id", idForEpisodeContainer + counter);
    //appending the div episodeContainer inside the div parent root
    rootElem.appendChild(episodeContainer);
    counter++;
  }
}

// creating default show to be shown on load
let showId = 82;
const myPromise = fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);
myPromise
  .then((response) => response.json())
  .then((data) => {
    makePageForEpisodes(data);
  });

//creating a sorted array of shows
for (let letter of alphaBet) {
  for (let show of unorderedShowlist) {
    if (letter == show.name[0].toLowerCase()) {
      allShows.push(show);
    }
  }
}

// Iterating through the Array of shows.
for (let show of allShows) {
  // creating an option element to use inside a select element
  const selectOption = document.createElement("option");
  let alpha = "show";
  selectOption.textContent = `${show.name}`;
  selectOption.setAttribute("value", `#${alpha + show.id}`);
  //appending option inside the select element
  selectShow.appendChild(selectOption);
}

selectShow.addEventListener("change", () => {
  showId = 0;
  for (let show of allShows) {
    if (`#show${show.id}` == selectShow.value) {
      showId += show.id;
      console.log(showId);
    }
  }

  const myPromise = fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);
  myPromise
    .then((response) => response.json())
    .then((data) => {
      makePageForEpisodes(data);
      episodes = data;
    });

  // Locating the selected episode.
  selectEpisode.addEventListener("change", () => {
    console.log(rootElem.childNodes.length);
    if (rootElem.childNodes.length <= 2) {
      console.log(episodes);
      makePageForEpisodes(episodes);
    }

    for (let child of rootElem.childNodes) {
      if (`#${child.getAttribute("id")}` == selectEpisode.value) {
        const reloadPage = document.createElement("button");
        reloadPage.textContent = `Reload all the episodes`;
        rootElem.innerHTML = ``;
        rootElem.appendChild(child);
        rootElem.appendChild(reloadPage);

        // reload the entire show on click
        reloadPage.addEventListener("click", () => {
          makePageForEpisodes(episodes);
        });
      }
    }
    console.log(rootElem.childNodes.length);
  });

  // creating an event listener for the search input
  inputElement.addEventListener("keyup", searchEpisodeList);
  // creating a call back function for the event listener
  function searchEpisodeList() {
    const rootElem = document.getElementById("root");
    const divSearchContainer = document.getElementById("search");
    const numberOfEpisodeFound = document.getElementById("displaying");

    const matchingEpisodes = [];
    if (inputElement.value == "") {
      rootElem.innerHTML = ``;
      numberOfEpisodeFound.style.display = "none";
      makePageForEpisodes(episodes);
    } else {
      rootElem.innerHTML = ``;

      for (let episode of episodes) {
        if (
          episode.name
            .toLowerCase()
            .includes(inputElement.value.toLowerCase()) ||
          episode.summary
            .toLowerCase()
            .includes(inputElement.value.toLowerCase())
        ) {
          matchingEpisodes.push(episode);
        }
      }
      numberOfEpisodeFound.style.display = "";

      numberOfEpisodeFound.textContent = `Displaying ${matchingEpisodes.length} of ${episodes.length} episodes`;
      divSearchContainer.appendChild(numberOfEpisodeFound);
      makePageForEpisodes(matchingEpisodes);
    }
  }
});
