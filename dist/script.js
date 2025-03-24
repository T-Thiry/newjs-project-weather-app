"use strict";
// @ts-nocheck
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
document.addEventListener('DOMContentLoaded', function () {
  // API information
  const API_KEY = '3bad52890d7306cc268371520cbaace6';
  const BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast';
  // List of default cities
  const cities = ['Stockholm', 'Gothenburg', 'Oslo'];
  let weeklyForecast = {};
  let currentCityIndex = 0;
  function fetchWeather(city) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const response = yield fetch(`${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`);
        const data = yield response.json();
        if (data.cod !== "200") {
          throw new Error(data.message || "Failed to fetch weather data.");
        }
        return data;
      }
      catch (error) {
        console.error(`Error fetching weather data for ${city}:`, error);
        return null;
      }
    });
  }
  function getDayName(dateString) {
    const date = new Date(dateString);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }
  function fetchAndStoreWeather(city) {
    return __awaiter(this, void 0, void 0, function* () {
      const data = yield fetchWeather(city);
      if (!data || !data.list) {
        return;
      }
      const todayData = data.list.find(entry => entry.dt_txt.includes("12:00:00")) || data.list[0];
      const todayDate = todayData.dt_txt.split(" ")[0];
      const sunriseTime = new Date(data.city.sunrise * 1000).toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" });
      const sunsetTime = new Date(data.city.sunset * 1000).toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" });
      const todayForecast = {
        city: data.city.name,
        day: getDayName(todayDate),
        weather: todayData.weather[0].description,
        icon: todayData.weather[0].icon,
        temp: todayData.main.temp,
        wind: todayData.wind.speed,
        sunrise: sunriseTime,
        sunset: sunsetTime,
      };
      const dailyForecasts = {};
      data.list.forEach(entry => {
        const date = entry.dt_txt.split(' ')[0];
        const hour = entry.dt_txt.split(' ')[1].split(':')[0];
        if (hour === '12' && date !== todayDate) {
          dailyForecasts[date] = {
            date: date,
            day: getDayName(date),
            icon: entry.weather[0].icon,
            weather: entry.weather[0].description,
            temp: entry.main.temp,
            wind: entry.wind.speed,
          };
        }
      });
      const upcomingForecast = Object.values(dailyForecasts).slice(0, 4);
      weeklyForecast[city] = {
        today: todayForecast,
        upcoming: upcomingForecast
      };
      localStorage.setItem("weatherData", JSON.stringify(weeklyForecast));
      displayTodaysWeather(todayForecast);
      displayWeeklyWeather(upcomingForecast);
      updateBackground(todayForecast.weather, todayForecast.icon);
    });
  }
  function displayTodaysWeather(forecast) {
    const weatherContent = document.getElementById('weather-content');
    if (!weatherContent)
      return;
    weatherContent.innerHTML = `
      <div class="weather-icon">
        <img id="main-icon" src="https://openweathermap.org/img/wn/${forecast.icon}@2x.png" alt="${forecast.weather}">
      </div>
      <p id="temperature">${Math.round(forecast.temp)}°C</p>
      <p id="city">${forecast.city}</p>
      <p id="weather">${forecast.weather}</p>
      <div class="sunrise-sunset">
        <p id="sunrise">Sunrise: ${forecast.sunrise}</p>
        <p id="sunset">Sunset: ${forecast.sunset}</p>
      </div>
    `;
  }
  function displayWeeklyWeather(forecastList) {
    const forecastTable = document.querySelector("#weather-forecast table");
    if (!forecastTable)
      return;
    const rows = forecastTable.getElementsByTagName("tr");
    if (!rows || rows.length === 0)
      return;
    forecastList.forEach((forecast, index) => {
      if (index < rows.length) {
        const dayCell = rows[index].querySelector(`#day${index + 1}`);
        if (dayCell)
          dayCell.textContent = forecast.day;
        const iconCell = rows[index].querySelector(`#iconday${index + 1}`);
        if (iconCell) {
          iconCell.innerHTML = `<img src="https://openweathermap.org/img/wn/${forecast.icon}.png" alt="${forecast.weather}">`;
        }
        const tempCell = rows[index].querySelector(`#tempday${index + 1}`);
        if (tempCell)
          tempCell.textContent = `${Math.round(forecast.temp)}°C`;
        const windCell = rows[index].querySelector(`#windday${index + 1}`);
        if (windCell)
          windCell.textContent = `${forecast.wind} m/s`;
      }
    });
  }
  function updateBackground(weatherDescription, iconCode) {
    const container = document.querySelector('.container');
    if (!container)
      return;
    container.classList.remove('rainy', 'cloudy', 'clear', 'snowy', 'daytime', 'nighttime');
    const isDaytime = iconCode.endsWith('d');
    container.classList.add(isDaytime ? 'daytime' : 'nighttime');
    if (weatherDescription.includes('rain') || weatherDescription.includes('drizzle')) {
      container.classList.add('rainy');
    }
    else if (weatherDescription.includes('cloud')) {
      container.classList.add('cloudy');
    }
    else if (weatherDescription.includes('clear')) {
      container.classList.add('clear');
    }
    else if (weatherDescription.includes('snow')) {
      container.classList.add('snowy');
    }
  }
  function cycleCity() {
    currentCityIndex = (currentCityIndex + 1) % cities.length;
    const city = cities[currentCityIndex];
    fetchAndStoreWeather(city);
  }
  function initializeEventListeners() {
    const searchButton = document.getElementById("search-button");
    const inputField = document.getElementById("input-field");
    const nextSideButton = document.getElementById('next-side-button');
    if (searchButton) {
      searchButton.addEventListener("click", function () {
        if (inputField && inputField.value.trim()) {
          fetchAndStoreWeather(inputField.value.trim());
        }
      });
    }
    if (inputField) {
      inputField.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && inputField.value.trim()) {
          fetchAndStoreWeather(inputField.value.trim());
        }
      });
    }
    if (nextSideButton) {
      nextSideButton.addEventListener('click', cycleCity);
    }
    else {
      console.error("Could not find button with ID 'next-side-button'");
    }
  }
  initializeEventListeners();
  fetchAndStoreWeather("Stockholm");
  const savedData = localStorage.getItem("weatherData");
  if (savedData) {
    try {
      weeklyForecast = JSON.parse(savedData);
    }
    catch (e) {
      console.error("Failed to parse saved weather data:", e);
    }
  }
});
/*document.addEventListener('DOMContentLoaded', function () {

  const API_KEY = '3bad52890d7306cc268371520cbaace6';
  const BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast';

  const cities: string[] = ['Stockholm', 'Gothenburg', 'Oslo'];
  let weeklyForecast = {};

  // Function to fetch weather data
  async function fetchWeather(city) {
    try {
      const response = await fetch(`${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`);
      const data = await response.json();
      if (data.cod !== "200") throw new Error(data.message);
      return data;
    } catch (error) {
      console.error(`Error fetching weather data for ${city}:`, error);
    }
  }

  // Function to get the day name from a date
  function getDayName(dateString: string): string {
    const date = new Date(dateString);
    const days: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }

  async function fetchAndStoreWeather(city) {
    const data = await fetchWeather(city);
    if (!data || !data.list) return;

    // Extract today's forecast (12:00 PM or fallback to first available)
    const todayData = data.list.find(entry => entry.dt_txt.includes("12:00:00")) || data.list[0];
    const todayDate = todayData.dt_txt.split(" ")[0]; // Extract 'YYYY-MM-DD'
    const sunriseTime = new Date(data.city.sunrise * 1000).toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" });
    const sunsetTime = new Date(data.city.sunset * 1000).toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" });

    const todayForecast = {
      city: data.city.name,
      day: getDayName(todayDate),
      weather: todayData.weather[0].description,
      icon: todayData.weather[0].icon,
      temp: todayData.main.temp,
      wind: todayData.wind.speed,
      sunrise: sunriseTime,
      sunset: sunsetTime,
    };

    // Extract 4-day forecast (choosing 12:00 PM for consistency)
    const filteredForecast = data.list.filter(entry => entry.dt_txt.includes("12:00:00"));
    const upcomingForecast = filteredForecast.slice(0, 4).map(entry => ({
      date: entry.dt_txt.split(' ')[0],
      day: getDayName(entry.dt_txt.split(' ')[0]),
      icon: entry.weather[0].icon,
      temp: entry.main.temp,
      wind: entry.wind.speed,
    }));

    // Store forecasts
    weeklyForecast[city] = {
      today: todayForecast,
      upcoming: upcomingForecast
    };

    // Store in localStorage
    localStorage.setItem("weatherData", JSON.stringify(weeklyForecast));

    // Update UI
    displayTodaysWeather(todayForecast);
    displayWeeklyWeather(upcomingForecast);
  }

  // Function to display today's weather
  function displayTodaysWeather(forecast) {
    const weatherContent = document.getElementById('weather-content');
    weatherContent.innerHTML = `
      <p id="temperature">${Math.round(forecast.temp)}°C</p>
      <p id="city">${forecast.city}</p>
      <p id="weather">${forecast.weather}
      <p id="sunrise">Sunrise: ${forecast.sunrise}</p>
      <p id="sunset">Sunset: ${forecast.sunset}</p>
    `;
  }


  // Function to display 4-day forecast in table
  function displayWeeklyWeather(forecastList) {
    const table = document.querySelector("#weather-forecast table");
    const rows = table.getElementsByTagName("tr");

    forecastList.forEach((forecast, index) => {
      if (rows[index]) {
        rows[index].querySelector(`#day${index + 1} `).textContent = forecast.day;
        rows[index].querySelector(`#tempday${index + 1} `).textContent = `${Math.round(forecast.temp)}°C`;
        rows[index].querySelector(`#windday${index + 1} `).textContent = `${forecast.wind} m / s`;
      }
    });
  }

  //Event listener for search button
  document.getElementById("search-button").addEventListener("click", function () {
    const cityInput = document.getElementById("input-field").value.trim();
    if (cityInput) {
      fetchAndStoreWeather(cityInput);
    }
  });

  // Event listener for Enter key
  document.getElementById("input-field").addEventListener("keydown", function (event) {
    // Check if the pressed key is Enter
    if (event.key === "Enter") {
      const cityInput = this.value.trim();
      if (cityInput) {
        fetchAndStoreWeather(cityInput);
      }
    }
  });

  // Load default city (Stockholm) on page load
  fetchAndStoreWeather("Stockholm");

  const searchButton = document.getElementById('search-button');
  const inputField = document.getElementById('input-field');

  // Slide button for looping through cities
  let currentCityIndex = 0;

  function cycleCity() {
    currentCityIndex = (currentCityIndex + 1) % cities.length; // % means we loop back

    // Get the current city
    const city = cities[currentCityIndex];

    fetchAndStoreWeather(city);
  }

  const nextSideButton = document.getElementById('next-side-button');
  console.log('Next side button:', nextSideButton);
  if (nextSideButton) {
    nextSideButton.addEventListener('click', cycleCity);
  } else {
    console.error("Could not find button with ID 'next-side-button'");
  }
});*/
