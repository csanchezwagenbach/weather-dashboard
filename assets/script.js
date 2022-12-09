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

function getSearchInfo() {
    searchTerm = searchInput.value;
    console.log(searchInput.value)
    console.log(searchTerm);
    var geoCodeUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + searchTerm + "&limit=1&appid=" + apiKey;
    var searchCity = fetch(geoCodeUrl)
                    .then(function (response) {
                     return response.json();
                    })
                    .then(function (data) {
                        var searchCity = {
                            name: data[0].name,
                            latitude: data[0].lat,
                            longitude: data[0].lon
                        }
                        console.log(searchCity);
                        return searchCity;
                    })
            console.log(searchCity);
        }


function checkStorage() {
    var savedCities = localStorage.getItem("saved cities");
    if (savedCities) {
        savedCities = JSON.parse(savedCities);
    } else {
        savedCities = [];
    }
    return savedCities;
};

function getCurrentCityDisplay() {
    var currentCity = localStorage.getItem("search city");
    currentCity = JSON.parse(currentCity);
    return currentCity;
}


searchButton.addEventListener("click", getSearchInfo);
console.log(searchCity);
    
        //     var savedCities = checkStorage();
        //     savedCities.push(newCity);
        //     localStorage.setItem("search city", JSON.stringify(newCity));
        //     localStorage.setItem("saved cities", JSON.stringify(savedCities));
        //     var currentCity = getCurrentCityDisplay();
        //     console.log(currentCity);
        //     var searchLat = currentCity.latitude;
        //     var searchLon = currentCity.longitude;
        //     console.log(searchLat);
        //     console.log(searchLon);
        //     var currentWeatherUrl = "api.openweathermap.org/data/2.5/forecast/daily?lat=" + searchLat + "&lon=" + searchLon + "&cnt=6&appid=" + apiKey
        //     console.log(currentWeatherUrl);
        // }
        // )


