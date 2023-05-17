const rootElem = document.getElementById("root");
const selectEpisode = document.getElementById("selectEpisode");
const selectShow = document.querySelector("#selectShow");
const searchForEpisode = document.getElementById("searchEpisode");
const searchForShow = document.getElementById("searchShow");
const divSearchContainer = document.getElementById("search");
const numberOfEpisodeFound = document.getElementById("displaying");

const returnToShows = document.createElement("button");

const unorderedShowlist = getAllShows();
const orderedShowList = [];
let episodes;
let showId;

function makePageForEpisodes(episodeList) {
  rootElem.classList.remove("flexDisplay");
  searchForEpisode.classList.remove("hideEpisodeView");
  searchForShow.classList.add("hideEpisodeView");
  divSearchContainer.classList.remove("hideEpisodeView");

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
console.log(orderedShowList);

// loading each show info on start.
function displayAllShows(shows) {
  selectEpisode.classList.add("hideEpisodeView");
  searchForEpisode.classList.add("hideEpisodeView");
  searchForShow.classList.remove("hideEpisodeView");
  divSearchContainer.classList.remove("hideEpisodeView");

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
    const listOfCasts = document.createElement("ul");
    const castsHeader = document.createElement("h2");

    // appending headings for each episode
    castsHeader.textContent = `Click to View Cast members`;

    // Adding a class attribute to the listOfCasts

    listOfCasts.classList.add("hideCast");

    // Adding click event on castsHeader
    castsHeader.addEventListener("click", () => {
      listOfCasts.classList.toggle("hideCast");
    });

    showHeader.textContent = `${show.name}`;
    showImage.setAttribute(
      "src",
      `${show.image == null ? "./comingsoon.jpg" : show.image.medium}`
    );
    showSummary.innerHTML = `${show.summary}`;
    showSummary.appendChild(castsHeader);

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

    // view casts in the show listing
    const myPromise = fetch(
      `https://api.tvmaze.com/shows/${show.id}?embed=cast`
    );
    myPromise
      .then((response) => response.json())
      .then((data) => {
        for (let cast of data._embedded.cast) {
          const castName = document.createElement("li");
          castName.textContent = `${cast.person.name}`;
          listOfCasts.appendChild(castName);
        }
      });

    // appending to parents
    ratingContainer.append(showRating, showGenres, showStatus, showRuntime);
    showInfo.append(showImage, showSummary, ratingContainer);
    showContainer.append(showHeader, showInfo, listOfCasts);
    rootElem.appendChild(showContainer);
    showHeader.addEventListener("click", (e) => {
      if (e.target.textContent === show.name) {
        selectEpisode.classList.toggle("hideEpisodeView");

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
        numberOfEpisodeFound.textContent = ``;
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
    });
  returnToShows.innerHTML = ``;
  returnToShowListing();
  numberOfEpisodeFound.textContent = ``;
});

// Locating the selected episode.
selectEpisode.addEventListener("change", () => {
  makePageForEpisodes(episodes);
  for (let child of rootElem.childNodes) {
    if (
      selectEpisode.options[selectEpisode.selectedIndex].textContent.includes(
        child.firstChild.textContent.substring(
          child.firstChild.textContent.length - 6
        )
      )
    ) {
      const reloadPage = document.createElement("button");
      reloadPage.style.cursor = "pointer";
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
  divSearchContainer.classList.add("hideEpisodeView");
});

// creating an event listener for the search input
searchForEpisode.addEventListener("keyup", searchEpisodeList);

// creating a call back function for the event listener
function searchEpisodeList() {
  const matchingEpisodes = [];
  if (searchForEpisode.value == "") {
    rootElem.innerHTML = ``;
    numberOfEpisodeFound.style.display = "none";
    makePageForEpisodes(episodes);
  } else {
    rootElem.innerHTML = ``;

    for (let episode of episodes) {
      if (episode.summary == null) {
        if (
          episode.name
            .toLowerCase()
            .includes(searchForEpisode.value.toLowerCase())
        ) {
          matchingEpisodes.push(episode);
        }
      } else {
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
    selectEpisode.classList.add("hideEpisodeView");
  });
}

// creating a call back function for the event listener
searchForShow.addEventListener("keyup", searchShowList);
function searchShowList() {
  const matchingEpisodes = [];
  if (searchForShow.value == "") {
    rootElem.innerHTML = ``;
    numberOfEpisodeFound.style.display = "none";
    displayAllShows(orderedShowList);
  } else {
    rootElem.innerHTML = ``;

    for (let episode of orderedShowList) {
      if (
        episode.name
          .toLowerCase()
          .includes(searchForShow.value.toLowerCase()) ||
        episode.summary
          .toLowerCase()
          .includes(searchForShow.value.toLowerCase())
      ) {
        matchingEpisodes.push(episode);
      }
      for (let genre of episode.genres) {
        if (genre.toLowerCase().includes(searchForShow.value.toLowerCase())) {
          matchingEpisodes.push(episode);
        }
      }
    }
    numberOfEpisodeFound.style.display = "";

    numberOfEpisodeFound.textContent = `Displaying ${matchingEpisodes.length} of ${orderedShowList.length} Shows`;
    divSearchContainer.appendChild(numberOfEpisodeFound);
    displayAllShows(matchingEpisodes);
  }
}
