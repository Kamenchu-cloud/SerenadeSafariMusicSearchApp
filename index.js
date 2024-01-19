// Wait for the HTML document to be fully loaded before executing the code
document.addEventListener("DOMContentLoaded", function () {
    // Get references to various HTML elements
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const resultsList = document.getElementById("resultsList");
    const audio = document.getElementById("myAudio");
    const songName = document.getElementById("songName");
    const songArtist = document.getElementById("songArtist");
    const songAlbum = document.getElementById("songAlbum");

    // Spotify API credentials
    const clientId = "dbd515100bed4bf0a6415d42b481c6de";
    const clientSecret = "5f05d12ae9c24d1ea9835628bc7e97ad";
    let accessToken;

    // Function to authenticate with the Spotify API and obtain an access token
    async function authenticateSpotify() {
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

        try {
            const response = await fetch(tokenUrl, tokenOptions);
            const data_1 = await response.json();
            accessToken = data_1.access_token;
        } catch (error) {
            return console.error("Error obtaining access token:", error);
        }
    }

    // Function to search for tracks on Spotify
    async function searchSpotify(query) {
        const apiUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`;

        const apiOptions = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        try {
            const response = await fetch(apiUrl, apiOptions);
            const data = await response.json();
            return data.tracks.items;
        } catch (error) {
            console.error("Error fetching search results:", error);
            return [];
        }
    }

    // Function to display search results in the HTML
    function displayResults(results) {
        resultsList.innerHTML = "";
        results.forEach((result, index) => {
            // Create a list item for each result
            const listItem = document.createElement("li");
            listItem.textContent = `${index + 1}. ${result.name} - ${result.artists[0].name}`;

            // Add a click event listener to play the selected track
            listItem.addEventListener("click", () => playTrack(result));
            resultsList.appendChild(listItem);
        });
    }
    
    // Function to play the selected track
    function playTrack(track) {
        audio.src = track.preview_url;
        songName.textContent = `Song name: ${track.name}`;
        songArtist.textContent = `Song Artist: ${track.artists[0].name}`;
        songAlbum.textContent = `Song Album: ${track.album.name}`;
    }

    // Event listener for the "click" event on the search button
    searchBtn.addEventListener("click", async () => {
        // Get the user's search query
        const query = searchInput.value.trim();
        if (query === "") {
            // Display an alert if the user hasn't entered anything
            alert("You have not entered anything yet.");
            return;
        }

        if (!accessToken) {
            // If access token is not available, authenticate with Spotify
            console.error("Access token is not available. Authenticating...");
            await authenticateSpotify();
        }

        // Search for tracks on Spotify and display the results
        const results = await searchSpotify(query);
        displayResults(results);
    });

    // Initialize by authenticating with Spotify during the initial load
    authenticateSpotify().catch((error) => {
        console.error("Error during initial authentication:", error);
    });
});
