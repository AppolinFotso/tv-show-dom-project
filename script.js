const rootElem = document.getElementById("root");
const selectEpisode = document.getElementById("selectEpisode");
const selectShow = document.querySelector("#selectShow");
const searchForEpisode = document.getElementById("searchEpisode");
const returnToShows = document.createElement("button");

const unorderedShowlist = getAllShows();
const orderedShowList = [];
let episodes;
let showId;

function makePageForEpisodes(episodeList) {
  rootElem.classList.remove("flexDisplay");
  returnToShows.innerHTML = ``;
  returnToShowListing();

  // taking control of the div and select elements.
  rootElem.innerHTML = ``;
  // creating variables that will be passed as id attribute to identify the div holding each episode.
  let idForEpisodeContainer = "div";
  let counter = 1;

  // Iterating through the Array of episodes while creating html elements to display each episode info.
  for (let episode of episodeList) {
    const episodeContainer = document.createElement("div");
    const episodeTitle = document.createElement("h2");
    const episodePoster = document.createElement("img");
    const episodeSummary = document.createElement("p");

    // rendering the episode name, season and episode number inside h2
    episodeTitle.textContent = `${episode.name} - ${
      episode.season < 10 ? `S0${episode.season}` : `S${episode.season}`
    }${episode.number < 10 ? `E0${episode.number}` : `E${episode.number}`}`;
    //rendering an image inside the img element
    episodePoster.setAttribute(
      "src",
      `${episode.image == null ? "./comingsoon.jpg" : episode.image.medium}`
    );
    episodeSummary.innerHTML = `${episode.summary}`;

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

function selectAnEpisode(episodeList) {
  // taking control of the div and select elements.
  selectEpisode.innerHTML = `<option selected>Select one episode to watch</option>`;
  // creating variables that will be passed as id attribute to identify the div holding each episode.
  let idForEpisodeContainer = "div";
  let counter = 1;
  for (let episode of episodeList) {
    // creating an option element to use inside a select element
    const selectOptions = document.createElement("option");

    selectOptions.textContent = `${
      episode.season < 10 ? `S0${episode.season}` : `S${episode.season}`
    }${episode.number < 10 ? `E0${episode.number}` : `E${episode.number}`} - ${
      episode.name
    }`;
    selectOptions.setAttribute("value", `#${idForEpisodeContainer + counter}`);
    //appending option inside the select element
    selectEpisode.appendChild(selectOptions);
  }
}

function selectAShow() {
  //creating a sorted array of shows
  let alphaBet = "abcdefghijklmnopqrstuvwxyz";

  for (let letter of alphaBet) {
    for (let show of unorderedShowlist) {
      if (letter == show.name[0].toLowerCase()) {
        orderedShowList.push(show);
      }
    }
  }
  // Iterating through the Array of shows.
  for (let show of orderedShowList) {
    // creating an option element to use inside a select element
    const selectOption = document.createElement("option");
    let alpha = "show";
    selectOption.textContent = `${show.name}`;
    selectOption.setAttribute("value", `#${alpha + show.id}`);
    //appending option inside the select element
    selectShow.appendChild(selectOption);
  }
}
selectAShow();

// loading each show info on start.
function displayAllShows(shows) {
  selectEpisode.classList.toggle("hideEpisodeView");
  rootElem.classList.remove("flexDisplay");
  rootElem.classList.toggle("flexDisplay");
  for (let show of shows) {
    const showContainer = document.createElement("section");
    const showInfo = document.createElement("div");
    const showHeader = document.createElement("h2");
    const showImage = document.createElement("img");
    const showSummary = document.createElement("p");
    const showRating = document.createElement("p");
    const showGenres = document.createElement("p");
    const showStatus = document.createElement("p");
    const showRuntime = document.createElement("p");
    const ratingContainer = document.createElement("div");

    showHeader.textContent = `${show.name}`;
    showImage.setAttribute(
      "src",
      `${show.image == null ? "./comingsoon.jpg" : show.image.medium}`
    );
    showSummary.innerHTML = `${show.summary}`;
    showRating.innerHTML = `<span>Rated</span>: ${show.rating.average}`;
    // iterate through each show genres
    let genres;

    if (show.genres.length == 1) {
      genres += show.genres[0];
    } else {
      for (let genre of show.genres) {
        if (show.genres.indexOf(genre) == show.genres.length - 1) {
          genres += genre;
        } else {
          genres += `${genre} | `;
        }
      }
    }
    showGenres.innerHTML = `<span>Genres</span>: ${show.genres}`;
    showStatus.innerHTML = `<span>Status</span>: ${show.status}`;
    showRuntime.innerHTML = `<span>Runtime</span>: ${show.runtime}`;
    ratingContainer.appendChild(showRating);
    ratingContainer.appendChild(showGenres);

    ratingContainer.appendChild(showStatus);

    ratingContainer.appendChild(showRuntime);
    showInfo.appendChild(showImage);
    showInfo.appendChild(showSummary);
    showInfo.appendChild(ratingContainer);
    showContainer.appendChild(showHeader);
    showContainer.appendChild(showInfo);
    rootElem.appendChild(showContainer);
    showHeader.addEventListener("click", (e) => {
      if (e.target.textContent === show.name) {
        const myPromise = fetch(
          `https://api.tvmaze.com/shows/${show.id}/episodes`
        );
        myPromise
          .then((response) => response.json())
          .then((data) => {
            makePageForEpisodes(data);
            selectAnEpisode(data);
            episodes = data;
          });
        //selectShow.classList.toggle("hideShowView");
      }
    });
  }
}
displayAllShows(orderedShowList);

// applying event listener on selectShow element
selectShow.addEventListener("change", () => {
  selectEpisode.classList.remove("hideEpisodeView");
  showId = 0;
  for (let show of orderedShowList) {
    if (`#show${show.id}` == selectShow.value) {
      showId += show.id;
    }
  }

  const myPromise = fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);
  myPromise
    .then((response) => response.json())
    .then((data) => {
      makePageForEpisodes(data);
      selectAnEpisode(data);
      episodes = data;
      console.log(episodes);
    });
  returnToShows.innerHTML = ``;
  returnToShowListing();
});

console.log(episodes);

// Locating the selected episode.
selectEpisode.addEventListener("change", () => {
  if (rootElem.childNodes.length <= 2) {
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
});

// creating an event listener for the search input
searchForEpisode.addEventListener("keyup", searchEpisodeList);

// creating a call back function for the event listener
function searchEpisodeList() {
  const divSearchContainer = document.getElementById("search");
  const numberOfEpisodeFound = document.getElementById("displaying");

  const matchingEpisodes = [];
  if (searchForEpisode.value == "") {
    rootElem.innerHTML = ``;
    numberOfEpisodeFound.style.display = "none";
    makePageForEpisodes(episodes);
  } else {
    rootElem.innerHTML = ``;

    for (let episode of episodes) {
      if (
        episode.name
          .toLowerCase()
          .includes(searchForEpisode.value.toLowerCase()) ||
        episode.summary
          .toLowerCase()
          .includes(searchForEpisode.value.toLowerCase())
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

function returnToShowListing() {
  returnToShows.innerHTML = `Click to view <br>show listing`;
  returnToShows.setAttribute("id", "showListing");
  document.body.insertBefore(returnToShows, rootElem);
  returnToShows.addEventListener("click", () => {
    rootElem.innerHTML = ``;
    displayAllShows(orderedShowList);
    returnToShows.remove();
  });
}
