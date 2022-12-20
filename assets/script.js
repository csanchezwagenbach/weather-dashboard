// To begin, I call references to each display area and button on the page

var currentWeatherDisplay = document.querySelector("#current-weather-display");
var futureForeCastDisplay = document.querySelector("#future-forecast-display");
var searchInput = document.querySelector("#search-term");
var searchButton = document.querySelector("#search-button");
var savedCitiesDisplay = document.querySelector("#saved-cities-list");

// I define the variable for the city to be searched globally because I reference it in two different locations, when the user clicks "Search" and when the user selects a city from the list that has printed to the page

var searchTerm; 

var geoApiKey = "f024b9c17a84301bd1b8cac7935e5c74";
var weatherApiKey = "4c49146a17ca318a41d0d72135a101bf";

// checkStorage goes into local storage and grabs the previous cities a user has entered into search, which automatically saves their input

function checkStorage() {
    var savedCities = localStorage.getItem("saved cities");
    if (savedCities) {
        savedCities = JSON.parse(savedCities);
    } else {
        savedCities = [];
    }
    return savedCities;
};

// getCurrentCity goes into local storage and grabs out whatever has been set as the "search city". This function is called before making an API call to gather the pertinent data required to return the forecast for the location in question.

function getCurrentCity() {
    var currentCity = JSON.parse(localStorage.getItem("search city"));
    return currentCity;
}

// printCurrentWeather takes the currentCity object and prints HTML elements that hold various values assigned to properties within the object. These various elements are then printed into the container waiting for them on the web page, thus rendering the current forecast for the location in question.

function printCurrentWeather() {
    var currentCity = JSON.parse(localStorage.getItem("current weather"));
    var cityName = document.createElement("h3");
    cityName.textContent = currentCity.name;
    var currentDate = document.createElement("h5");
    currentDate.textContent = currentCity.date;
    var icon = currentCity.icon;
    var currentIcon = document.createElement("img");
    currentIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + icon + "@2x.png");
    var weatherSummary = document.createElement("p");
    weatherSummary.textContent = "The current temperature outside is " + currentCity.temp + "°F, but it feels like it's " + currentCity.feels_like + " °F. The wind speed is " + currentCity.wind + " miles per hour, and the relative humidity is " + currentCity.humidity + "%.";
    currentWeatherDisplay.innerHTML = "";
    currentWeatherDisplay.append(cityName);
    currentWeatherDisplay.append(currentDate);
    currentWeatherDisplay.append(currentIcon);
    currentWeatherDisplay.append(weatherSummary);
}

// printForecast acts much like printCurrentWeather, but it repeats the process of printing out individual cards by looping through the "forecasts" array, which is a series of objects, each of which holding information about a given day's forecast.

function printForecast () {
    var forecasts = JSON.parse(localStorage.getItem("forecasts"));
    futureForeCastDisplay.innerHTML = "";
    for (var i = 0; i < forecasts.length; i++) {
    var forecastCard = document.createElement("div");
    forecastCard.classList.add("card");
    forecastCard.setAttribute("style", "width: 18rem;");
    var forecastIcon = document.createElement("img");
    forecastIcon.classList.add("card-img-top");
    forecastIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + forecasts[i].icon + "@2x.png");
    forecastCard.append(forecastIcon);
    var forecastBody = document.createElement("div");
    forecastBody.classList.add("card-body");
    var forecastDate = document.createElement("h5");
    forecastDate.textContent = forecasts[i].date;
    forecastBody.append(forecastDate);
    var forecastSummary = document.createElement("p");
    forecastSummary.textContent = "On " + dayjs(forecasts[i].date).format("dddd") + " the temperature outside will be " + forecasts[i].temp + " °F. The wind speed will be " + forecasts[i].wind + " miles per hour, and the relative humidity will be " + forecasts[i].humidity + "%.";
    forecastBody.append(forecastSummary);
    forecastCard.append(forecastBody);
    futureForeCastDisplay.append(forecastCard);    
    }
}

// Like the two functions above, printSavedCities creates list item elements for each of the cities saved from a user's search history and prints them to the waiting container beneath the search bar.

function printSavedCities() {
    var cities = JSON.parse(localStorage.getItem("saved cities"));
    savedCitiesDisplay.innerHTML = "";
    for (var i = 0; i < cities.length; i++) {
        var city = document.createElement("li");
        city.classList.add("list-group-item");
        city.textContent = cities[i].name;
        savedCitiesDisplay.append(city);
    }
}

// Adds event listener onto each of the saved cities printed on the page.

 savedCitiesDisplay.addEventListener("click", searchClickedCity)

// All print functions collected into a single renderPage function for convenience's sake

function renderPage() {
    printCurrentWeather();
    printForecast();
    printSavedCities();
}

// The function below receives the name of a city clicked-on from the list of a user's search history, and passes that name into an api call to return the current and five day forecast for that location. All of the desired data returned from the api call is stored in local storage for printing just before finishing with a call to renderPage.

async function searchClickedCity (event) {
    var clickedCity = event.target.textContent;
    searchTerm = clickedCity;
    var geoCodeUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + searchTerm + "&limit=1&appid=" + geoApiKey;
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
            localStorage.setItem("search city", JSON.stringify(searchCity));
        })
    var currentCity = getCurrentCity();
    var searchLat = currentCity.latitude;
    var searchLon = currentCity.longitude;
    var currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + searchLat + "&lon=" + searchLon + "&units=imperial&appid=" + weatherApiKey
    await fetch(currentWeatherUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var unix = data.dt
            var currentWeather = {
                name: data.name,
                date: dayjs.unix(unix).format("MMM D, YYYY"),
                temp: data.main.temp,
                feels_like: data.main.feels_like,
                humidity: data.main.humidity,
                wind: data.wind.speed,
                icon: data.weather[0].icon,
            }
            localStorage.setItem("current weather", JSON.stringify(currentWeather));
        })
    var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + searchLat + "&lon=" + searchLon + "&units=imperial&appid=" + weatherApiKey
    await fetch(forecastUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var forecasts = [];
            var unixOne = data.list[7].dt
            var forecastOne = {
                date: dayjs.unix(unixOne).format("MMMM D, YYYY"),
                temp: data.list[7].main.temp,
                humidity: data.list[7].main.humidity,
                wind: data.list[7].wind.speed,
                icon: data.list[7].weather[0].icon
            }
            forecasts.push(forecastOne);
            var unixTwo = data.list[15].dt
            var forecastTwo = {
                date: dayjs.unix(unixTwo).format("MMMM D, YYYY"),
                temp: data.list[15].main.temp,
                humidity: data.list[15].main.humidity,
                wind: data.list[15].wind.speed,
                icon: data.list[15].weather[0].icon
            }
            forecasts.push(forecastTwo);
            var unixThree = data.list[23].dt
            var forecastThree = {
                date: dayjs.unix(unixThree).format("MMMM D, YYYY"),
                temp: data.list[23].main.temp,
                humidity: data.list[23].main.humidity,
                wind: data.list[23].wind.speed,
                icon: data.list[23].weather[0].icon
            }
            forecasts.push(forecastThree);
            var unixFour = data.list[31].dt
            var forecastFour = {
                date: dayjs.unix(unixFour).format("MMMM D, YYYY"),
                temp: data.list[31].main.temp,
                humidity: data.list[31].main.humidity,
                wind: data.list[31].wind.speed,
                icon: data.list[31].weather[0].icon
            }
            forecasts.push(forecastFour);
            var unixFive = data.list[39].dt
            var forecastFive = {
                date: dayjs.unix(unixFive).format("MMMM D, YYYY"),
                temp: data.list[39].main.temp,
                humidity: data.list[39].main.humidity,
                wind: data.list[39].wind.speed,
                icon: data.list[39].weather[0].icon
            }
            forecasts.push(forecastFive);
            localStorage.setItem("forecasts", JSON.stringify(forecasts));
        })
    renderPage();
}

// Adds event listener onto the "Search" button. Nearly identical to the code above, the function that is called makes an api call with the input from the search bar being sent to the api. All returned data is saved to local storage before the page is rendered.

searchButton.addEventListener("click", async function () {
    searchTerm = searchInput.value;
    var geoCodeUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + searchTerm + "&limit=1&appid=" + geoApiKey;
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
            var savedCities = checkStorage();
            savedCities.push(searchCity);
            localStorage.setItem("search city", JSON.stringify(searchCity));
            localStorage.setItem("saved cities", JSON.stringify(savedCities))
        })
    var currentCity = getCurrentCity();
    var searchLat = currentCity.latitude;
    var searchLon = currentCity.longitude;
    var currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + searchLat + "&lon=" + searchLon + "&units=imperial&appid=" + weatherApiKey
    await fetch(currentWeatherUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var unix = data.dt
            var currentWeather = {
                name: data.name,
                date: dayjs.unix(unix).format("MMM D, YYYY"),
                temp: data.main.temp,
                feels_like: data.main.feels_like,
                humidity: data.main.humidity,
                wind: data.wind.speed,
                icon: data.weather[0].icon,
            }
            localStorage.setItem("current weather", JSON.stringify(currentWeather));
        })
    var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + searchLat + "&lon=" + searchLon + "&units=imperial&appid=" + weatherApiKey
    await fetch(forecastUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var forecasts = [];
            var unixOne = data.list[7].dt
            var forecastOne = {
                date: dayjs.unix(unixOne).format("MMMM D, YYYY"),
                temp: data.list[7].main.temp,
                humidity: data.list[7].main.humidity,
                wind: data.list[7].wind.speed,
                icon: data.list[7].weather[0].icon
            }
            forecasts.push(forecastOne);
            var unixTwo = data.list[15].dt
            var forecastTwo = {
                date: dayjs.unix(unixTwo).format("MMMM D, YYYY"),
                temp: data.list[15].main.temp,
                humidity: data.list[15].main.humidity,
                wind: data.list[15].wind.speed,
                icon: data.list[15].weather[0].icon
            }
            forecasts.push(forecastTwo);
            var unixThree = data.list[23].dt
            var forecastThree = {
                date: dayjs.unix(unixThree).format("MMMM D, YYYY"),
                temp: data.list[23].main.temp,
                humidity: data.list[23].main.humidity,
                wind: data.list[23].wind.speed,
                icon: data.list[23].weather[0].icon
            }
            forecasts.push(forecastThree);
            var unixFour = data.list[31].dt
            var forecastFour = {
                date: dayjs.unix(unixFour).format("MMMM D, YYYY"),
                temp: data.list[31].main.temp,
                humidity: data.list[31].main.humidity,
                wind: data.list[31].wind.speed,
                icon: data.list[31].weather[0].icon
            }
            forecasts.push(forecastFour);
            var unixFive = data.list[39].dt
            var forecastFive = {
                date: dayjs.unix(unixFive).format("MMMM D, YYYY"),
                temp: data.list[39].main.temp,
                humidity: data.list[39].main.humidity,
                wind: data.list[39].wind.speed,
                icon: data.list[39].weather[0].icon
            }
            forecasts.push(forecastFive);
            localStorage.setItem("forecasts", JSON.stringify(forecasts));
        })
    renderPage();
})

// Actual event listener added onto list of cities a user has searched

savedCitiesDisplay.addEventListener("click", searchClickedCity);

// renderPage called to print any previous data saved in local storage when the user loads the page.

renderPage();