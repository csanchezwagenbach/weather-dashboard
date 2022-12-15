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
    console.log(currentCity);
    return currentCity;
}

function printCurrentWeather() {
    var currentCity = JSON.parse(localStorage.getItem("current weather"));
    var cityName = document.createElement("h3");
    cityName.textContent = currentCity.name;
    var currentDate = document.createElement("h5");
    currentDate.textContent = currentCity.date;
    var icon = currentCity.icon;
    console.log(icon);
    var iconUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
    console.log(iconUrl);
    var currentIcon = document.createElement("img");
    currentIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png");
    var weatherSummary = document.createElement("p");
    weatherSummary.textContent = "The current temperature outside is " + currentCity.temp + "°F, but it feels like it's " + currentCity.feels_like + "°F. The wind speed is " + currentCity.wind + " miles per hour, and the relative humidity is " + currentCity.humidity + "%.";
    currentWeatherDisplay.innerHTML = "";
    currentWeatherDisplay.append(cityName);
    currentWeatherDisplay.append(currentDate);
    currentWeatherDisplay.append(currentIcon);
    currentWeatherDisplay.append(weatherSummary);
}

function printForecast () {
    var forecasts = JSON.parse(localStorage.getItem("forecasts"));
    futureForeCastDisplay.innerHTML = "";
    for (var i = 0; i < forecasts.length; i++) {
    var forecastCard = document.createElement("div");
    forecastCard.classList.add("card");
    forecastCard.setAttribute("style", "width: 18rem;");
    var forecastIcon = document.createElement("img");
    forecastIcon.classList.add("card-img-top");
    forecastIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + forecasts[i].icon + "@2x.png");
    forecastCard.append(forecastIcon);
    var forecastBody = document.createElement("div");
    forecastBody.classList.add("card-body");
    var forecastDate = document.createElement("h5");
    forecastDate.textContent = forecasts[i].date;
    forecastBody.append(forecastDate);
    var forecastSummary = document.createElement("p");
    forecastSummary.textContent = "On " + dayjs(forecasts[i].date).format("dddd") + " the temperature outside will be " + forecasts[i].temp + "°F. The wind speed will be " + forecasts[i].wind + "miles per hour, and the relative humidity will be " + forecasts[i].humidity + "%.";
    forecastBody.append(forecastSummary);
    forecastCard.append(forecastBody);
    futureForeCastDisplay.append(forecastCard);    
    }
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
            localStorage.setItem("saved cities", JSON.stringify(savedCities))
        })
    var currentCity = getCurrentCity();
    var searchLat = currentCity.latitude;
    var searchLon = currentCity.longitude;
    console.log(searchLat);
    console.log(searchLon);
    var currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + searchLat + "&lon=" + searchLon + "&units=imperial&appid=" + weatherApiKey
    await fetch(currentWeatherUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
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
    console.log(forecastUrl);
    await fetch(forecastUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var forecasts = [];
            var unixOne = data.list[7].dt
            console.log(dayjs.unix(unixOne).format("MMM D, YYYY"))
            var forecastOne = {
                date: dayjs.unix(unixOne).format("MMMM D, YYYY"),
                temp: data.list[7].main.temp,
                humidity: data.list[7].main.humidity,
                wind: data.list[7].wind.speed,
                icon: data.list[7].weather[0].icon
            }
            console.log(forecastOne);
            forecasts.push(forecastOne);
            console.log(forecasts);
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
    printCurrentWeather();
    printForecast();
    //printSavedCities();
})



