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
        
});