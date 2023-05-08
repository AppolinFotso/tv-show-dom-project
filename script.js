const allShows = getAllShows();
let showId = 0;
const selectShow = document.querySelector("#selectShow");
// Iterating through the Array of episodes while creating html elements to display each episode info.
for (let show of allShows) {
  // creating an option element to use inside a select element
  const selectOption = document.createElement("option");
  let alpha = "show";
  selectOption.textContent = `${show.name}`;
  selectOption.setAttribute("value", `#${alpha + show.id}`);
  //appending option inside the select element
  selectShow.appendChild(selectOption);
  showId = show.id;
}

selectShow.addEventListener("change", () => {
  showId = 0;
  for (let show of allShows) {
    if (`#show${show.id}` == selectShow.value) {
      console.log(show.id);
      showId += show.id;
    }
  }

  console.log(showId);
  const myPromise = fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);
  myPromise
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      makePageForEpisodes(data);

      function makePageForEpisodes(episodeList) {
        // taking control of the div and select elements.
        const rootElem = document.getElementById("root");
        const selectElement = document.getElementById("selectEpisode");
        selectElement.innerHTML = ``;
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
          }${
            episode.number < 10 ? `E0${episode.number}` : `E${episode.number}`
          } - ${episode.name}`;
          selectOptions.setAttribute(
            "value",
            `#${idForEpisodeContainer + counter}`
          );

          // rendering the episode name, season and episode number inside h2
          episodeTitle.textContent = `${episode.name} - ${
            episode.season < 10 ? `S0${episode.season}` : `S${episode.season}`
          }${
            episode.number < 10 ? `E0${episode.number}` : `E${episode.number}`
          }`;
          //rendering an image inside the img element
          episodePoster.setAttribute("src", `${episode.image.medium}`);
          episodeSummary.innerHTML = `${episode.summary}`;

          //appending option inside the select element
          selectElement.appendChild(selectOptions);
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

      // Locating the selected episode.
      const rootElem = document.getElementById("root");
      const selectElement = document.getElementById("selectEpisode");
      selectElement.addEventListener("change", () => {
        location = selectElement.value;

        if (rootElem.childNodes.length <= 2) {
          rootElem.innerHTML = ``;

          makePageForEpisodes(data);
        }
        for (let child of rootElem.childNodes) {
          if (`#${child.getAttribute("id")}` == selectElement.value) {
            const reloadPage = document.createElement("button");
            reloadPage.textContent = `Reload all the episodes`;
            rootElem.innerHTML = ``;
            rootElem.appendChild(child);
            rootElem.appendChild(reloadPage);
            reloadPage.addEventListener("click", () => {
              rootElem.innerHTML = ``;
              makePageForEpisodes(data);
            });
          }
        }
      });

      // taking control of the input element and creating an event listener
      const inputElement = document.getElementById("searchEpisode");
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
          makePageForEpisodes(data);
        } else {
          rootElem.innerHTML = ``;

          for (let episode of data) {
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

          numberOfEpisodeFound.textContent = `Displaying ${matchingEpisodes.length} of ${data.length} episodes`;
          divSearchContainer.appendChild(numberOfEpisodeFound);
          makePageForEpisodes(matchingEpisodes);
        }
      }

      window.onload = makePageForEpisodes(data);
    });
});
