// SHOWING CURRENT DAY AND TIME //

let now = new Date();
let hour = now.getHours();
hour = ("0" + hour).slice(-2);
let minute = now.getMinutes();
minute = ("0" + minute).slice(-2);
let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];
let day = days[now.getDay()];
let dayTime = day + ", " + hour + ":" + minute;
document.querySelector("#todayDayTime").innerHTML = `${dayTime}`;

// 

function formatForecastDay(timestamp) {
    let date = new Date(timestamp * 1000);
    let day = date.getDay();
    let days = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
    
    return days[day];
}

function displayForecast(response) {
    let forecast = response.data.daily;
    let forecastElement = document.querySelector("#weather-forecast");
    let forecastHTML = `<div class = "row">`;
    forecast.forEach(function (forecastDay, index) {
        if (index < 7) {
    forecastHTML = forecastHTML + 
    `<div class="col" style="width:70px;">${formatForecastDay(forecastDay.dt)}<br />
    <img src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png" style="height:60px;"/>
    <div class="row">
        <div class="col">
            <span class="weather-forecast-max">${Math.round(forecastDay.temp.max)}°</span>
        </div>
        <div class="col">
            <span class="weather-forecast-min">${Math.round(forecastDay.temp.min)}°</span>
        </div>
            </div>
    </div>
    `;
        }
});
    forecastHTML = forecastHTML + `</div>`;
    forecastElement.innerHTML = forecastHTML;
}

function getForecast (coordinate) {
    let apiKey = "001bc651977f4b024af4d84282b0f02a";
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinate.lat}&lon=${coordinate.lon}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayForecast);
}

function showAllRecords(response) {
    celsiusTemperature = Math.round(response.data.main.temp);
    document.querySelector("#weather-city-statement").innerHTML = response.data.name;
    document.querySelector("#main-degree").innerHTML = `${celsiusTemperature}°`;
    document.querySelector("#wind-speed").innerHTML = Math.round(response.data.wind.speed);
    document.querySelector("#humidity").innerHTML = response.data.main.humidity;
    document.querySelector("#weather-description").innerHTML = response.data.weather[0].description;
    document.querySelector("#weather-icon").setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);

    getForecast(response.data.coord);
}

function search(city) {
    let units = "metric";
    let apiKey = "4f57d9637c4c70579c074808bb3a6254";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
    axios.get(apiUrl).then(showAllRecords);
}

function handleSubmit(event) {
    event.preventDefault();
    let city = document.querySelector("#search-city").value;
    search(city);
}

function showCurrentNow(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let apiKey = "4f57d9637c4c70579c074808bb3a6254";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    axios.get(apiUrl).then(showAllRecords);
}

function showNow(event) {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(showCurrentNow);
}

function convertFahrenheit(event) {
    event.preventDefault();
    let temperatureElement = document.querySelector("#main-degree");
    celsiusLink.classList.remove("active");
    fahrenheitLink.classList.add("active");
    let fahrenheitTemperature = Math.round((celsiusTemperature * 9 / 5) + 32);
    temperatureElement.innerHTML = `${fahrenheitTemperature}°`;
}

function convertCelsius(event) {
    event.preventDefault();
    fahrenheitLink.classList.remove("active");
    celsiusLink.classList.add("active");
    let temperatureElement = document.querySelector("#main-degree");
    temperatureElement.innerHTML = `${celsiusTemperature}°`;
    }

let celsiusTemperature = null;

let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", convertFahrenheit);

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", convertCelsius);

let currentTemperatureButton = document.querySelector("#current-temperature-button");
currentTemperatureButton.addEventListener("click", showNow);

let form = document.querySelector("#city-form");
form.addEventListener("submit", handleSubmit);

search("Hokkaido");

displayForecast();