console.log("Hello, world");

var currentWeatherDisplay = document.querySelector("#current-weather-display");
var futureForeCastDisplay = document.querySelector("#future-forecast-display");
var searchInput = document.querySelector("#search-term");
var searchButton = document.querySelector("#search-button");
var savedCitiesDisplay = document.querySelector("#saved-cities-list");

var searchTerm; //This will be the saved, trimmed, and returned value of the search input
// var searchLat = saveLat ();
// var searchLon = saveLon();
var apiKey = "f024b9c17a84301bd1b8cac7935e5c74";

function checkStorage () {
    var savedCities = localStorage.getItem("saved cities");
    if (savedCities) {
        savedCities = JSON.parse(savedCities);
    } else {
        savedCities = [];
    }
    return savedCities;
}

searchButton.addEventListener("click", function () {
    searchTerm = searchInput.value;
    console.log(searchInput.value)
    console.log(searchTerm);
    var geoCodeUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + searchTerm + "&limit=1&appid=" + apiKey;
    fetch(geoCodeUrl)
        .then(function (response) {
            return response.json();
        })
        .then (function (data) {
            var newCity = {
                name: data[0].name,
                latitude: data[0].lat,
                longitude: data[0].lon
            }
            var savedCities = checkStorage();
            savedCities.push(newCity);
            localStorage.setItem("search city", JSON.stringify(newCity))
            localStorage.setItem("saved cities", JSON.stringify(savedCities)) 
        }
    )});
