let today = new Date();
let dayNum = today.getDate();
let monthIndex = today.getMonth();
let hour = today.getHours();
hour = ("0" + hour).slice(-2);
let minute = today.getMinutes();
minute = ("0" + minute).slice(-2);
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
let month = months[monthIndex];
let day = days[today.getDay()];
let fullDate = day + " " + dayNum + " " + month + ", " + hour + ":" + minute;
document.querySelector("#todayDayTime").innerHTML = `${fullDate}`;

function formatForecastDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

let lastForecastResponse = null;

function displayForecast(response, isCelsius) {
  lastForecastResponse = response;

  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#weather-forecast");
  let forecastHTML = `<div class = "row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 7) {
      let maxTemperature = isCelsius
        ? Math.round(forecastDay.temp.max)
        : Math.round((forecastDay.temp.max * 9) / 5 + 32);
      let minTemperature = isCelsius
        ? Math.round(forecastDay.temp.min)
        : Math.round((forecastDay.temp.min * 9) / 5 + 32);

      forecastHTML += `
        <div class="col" style="width:70px;">
          ${formatForecastDay(forecastDay.dt)}<br />
          <img src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png" style="height:60px;"/>
          <div class="row">
            <div class="col">
              <span class="weather-forecast-max">${maxTemperature}°</span>
            </div>
            <div class="col">
              <span class="weather-forecast-min">${minTemperature}°</span>
            </div>
          </div>
        </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinate) {
  let apiKey = "001bc651977f4b024af4d84282b0f02a";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinate.lat}&lon=${coordinate.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(function (response) {
    lastForecastResponse = response;
    displayForecast(lastForecastResponse, true);
  });
}

function showAllRecords(response) {
  celsiusTemperature = Math.round(response.data.main.temp);
  document.querySelector("#weather-city-statement").innerHTML =
    response.data.name;
  document.querySelector("#main-degree").innerHTML = `${celsiusTemperature}°`;
  document.querySelector("#wind-speed").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#weather-description").innerHTML =
    response.data.weather[0].description;
  document
    .querySelector("#weather-icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );

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
  let cityInput = document.querySelector("#search-city");
  let city = cityInput.value;
  search(city);
  cityInput.value = "";
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
  let fahrenheitTemperature = Math.round((celsiusTemperature * 9) / 5 + 32);
  temperatureElement.innerHTML = `${fahrenheitTemperature}°`;
  displayForecast(lastForecastResponse, false);
}

function convertCelsius(event) {
  event.preventDefault();
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
  let temperatureElement = document.querySelector("#main-degree");
  temperatureElement.innerHTML = `${celsiusTemperature}°`;
  displayForecast(lastForecastResponse, true);
}

const draggable = document.getElementById("weather-app");

let posX = 0,
  posY = 0,
  mouseX = 0,
  mouseY = 0;

draggable.addEventListener("mousedown", mouseDown, false);
window.addEventListener("mouseup", mouseUp, false);

function mouseDown(e) {
  if (e.target.tagName.toLowerCase() === "input") {
    return;
  }

  e.preventDefault();
  posX = e.clientX - draggable.offsetLeft;
  posY = e.clientY - draggable.offsetTop;
  window.addEventListener("mousemove", moveElement, false);
}

function mouseUp() {
  window.removeEventListener("mousemove", moveElement, false);
}

function moveElement(e) {
  mouseX = e.clientX - posX;
  mouseY = e.clientY - posY;

  mouseX = Math.max(
    0,
    Math.min(mouseX, window.innerWidth - draggable.offsetWidth)
  );
  mouseY = Math.max(
    0,
    Math.min(mouseY, window.innerHeight - draggable.offsetHeight)
  );

  draggable.style.left = mouseX + "px";
  draggable.style.top = mouseY + "px";
}

let celsiusTemperature = null;

let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", convertFahrenheit);

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", convertCelsius);

let currentTemperatureButton = document.querySelector(
  "#current-temperature-button"
);
currentTemperatureButton.addEventListener("click", showNow);

let form = document.querySelector("#city-form");
form.addEventListener("submit", handleSubmit);

search("Hokkaido");

displayForecast(lastForecastResponse, true);
