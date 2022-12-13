console.log("Hello, world");

var currentWeatherDisplay = document.querySelector("#current-weather-display");
var futureForeCastDisplay = document.querySelector("#future-forecast-display");
var searchInput = document.querySelector("#search-term");
var searchButton = document.querySelector("#search-button");
var savedCitiesDisplay = document.querySelector("#saved-cities-list");

var searchTerm; //This will be the saved, trimmed, and returned value of the search input

var geoApiKey = "f024b9c17a84301bd1b8cac7935e5c74";
var weatherApiKey = "4c49146a17ca318a41d0d72135a101bf";



function checkStorage() {
    var savedCities = localStorage.getItem("saved cities");
    if (savedCities) {
        savedCities = JSON.parse(savedCities);
    } else {
        savedCities = [];
    }
    return savedCities;
};

function getCurrentCity() {
    var currentCity = JSON.parse(localStorage.getItem("search city"));
    //currentCity = JSON.parse(currentCity);
    console.log(currentCity);
    return currentCity;
}


searchButton.addEventListener("click", async function () {
    searchTerm = searchInput.value;
    console.log(searchInput.value)
    console.log(searchTerm);
    var geoCodeUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + searchTerm + "&limit=1&appid=" + geoApiKey;
    await fetch(geoCodeUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) { 
            var searchCity = {
        name: data[0].name,
        latitude: data[0].lat.toFixed(2),
        longitude: data[0].lon.toFixed(2),
    }
    console.log(searchCity);
    var savedCities = checkStorage();
    savedCities.push(searchCity);
    localStorage.setItem("search city", JSON.stringify(searchCity));
    localStorage.setItem("saved cities", JSON.stringify(savedCities))})
    var currentCity = getCurrentCity();
    var searchLat = currentCity.latitude;
    var searchLon = currentCity.longitude;
    console.log(searchLat);
    console.log(searchLon);
    var currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" +searchLat + "&lon=" + searchLon + "&units=imperial&appid=" +weatherApiKey
    await fetch(currentWeatherUrl)
        .then(function (response) {
            return response.json();
        })
        .then (function (data) {
            console.log(data)
            var currentWeather = {
                name: data.name,
                temp: data.main.temp,
                humidity: data.main.humidity,
                wind: data.wind.speed
            }
            localStorage.setItem("current weather", JSON.stringify(currentWeather));
        })
    var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + searchLat + "&lon=" + searchLon + "&units=imperial&appid=" + weatherApiKey
    console.log(forecastUrl);
    await fetch(forecastUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
        })
})



