document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const resultsList = document.getElementById("resultsList");
    const audio = document.getElementById("myAudio");
    const songName = document.getElementById("songName");
    const songArtist = document.getElementById("songArtist");
    const songAlbum = document.getElementById("songAlbum");
  
    const clientId = "28d7316839b3472dbd3c5fc2c32fe164";
    const clientSecret = "ad3c13ad455647c2891e0e390e5550a3";
    let accessToken;
  
    function authenticateSpotify() {
      const tokenUrl = "https://accounts.spotify.com/api/token";
      const base64Credentials = btoa(`${clientId}:${clientSecret}`);
      const tokenOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${base64Credentials}`,
        },
        body: "grant_type=client_credentials",
      };
  
      return fetch(tokenUrl, tokenOptions)
        .then((response) => response.json())
        .then((data) => {
          accessToken = data.access_token;
        })
        .catch((error) => console.error("Error obtaining access token:", error));
    }
  
    function searchSpotify(query) {
      const apiUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        query
      )}&type=track`;
  
      const apiOptions = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
  
      return fetch(apiUrl, apiOptions)
        .then((response) => response.json())
        .then((data) => data.tracks.items)
        .catch((error) => {
          console.error("Error fetching search results:", error);
          return [];
        });
    }
  
    function displayResults(results) {
      resultsList.innerHTML = "";
      results.forEach((result, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${index + 1}. ${result.name} - ${
          result.artists[0].name
        }`;
        listItem.addEventListener("click", () => playTrack(result));
        resultsList.appendChild(listItem);
      });
    }
  
    function playTrack(track) {
      audio.src = track.preview_url;
      songName.textContent = `Song name: ${track.name}`;
      songArtist.textContent = `Song Artist: ${track.artists[0].name}`;
      songAlbum.textContent = `Song Album: ${track.album.name}`;
    }
  
    searchBtn.addEventListener("click", async () => {
      const query = searchInput.value.trim();
      if (query === "") {
        alert("You have not entered anything yet.");
        return;
      }
  
      displayResults(results);
    });
  
    // Initialize by authenticating with Spotify
    authenticateSpotify().catch((error) => {
      console.error("Error during initial authentication:", error);
    });
  });
  