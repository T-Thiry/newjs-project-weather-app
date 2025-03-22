"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// @ts-nocheck
document.addEventListener('DOMContentLoaded', function () {
    const API_KEY = '3bad52890d7306cc268371520cbaace6';
    const BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast';
    const cities = ['Stockholm', 'Gothenburg', 'Oslo'];
    let weeklyForecast = {};
    // Function to fetch weather data
    function fetchWeather(city) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`);
                const data = yield response.json();
                if (data.cod !== "200")
                    throw new Error(data.message);
                return data;
            }
            catch (error) {
                console.error(`Error fetching weather data for ${city}:`, error);
            }
        });
    }
    // Function to get the day name from a date
    function getDayName(dateString) {
        const date = new Date(dateString);
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[date.getDay()];
    }
    // Function to process and store weather data
    function fetchAndStoreWeather(city) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield fetchWeather(city);
            if (!data || !data.list)
                return;
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
        });
    }
    // Function to display today's weather
    function displayTodaysWeather(forecast) {
        const weatherContent = document.querySelector('.weather-content');
        weatherContent.innerHTML = `
        <p id="temperature">${Math.round(forecast.temp)}°C</p>
        <p id="city">${forecast.city}</p>
       
        <p id="weather">${forecast.weather}</p>
        <p id="sunrise">Sunrise: ${forecast.sunrise}</p>
        <p id="sunset">Sunset: ${forecast.sunset}</p>
    `;
    }
    // Function to display 4-day forecast in table
    function displayWeeklyWeather(forecastList) {
        const table = document.querySelector("#weather-forecast table");
        const rows = table.getElementsByTagName("tr");
        const weatherIcon = document.getElementById("iconday1");
        forecastList.forEach((forecast, index) => {
            if (rows[index]) {
                rows[index].querySelector(`#day${index + 1}`).textContent = forecast.day;
                // rows[index].querySelector(`#iconday${index + 1}`).innerHTML = `<>`;
                rows[index].querySelector(`#tempday${index + 1}`).textContent = `${Math.round(forecast.temp)}°C`;
                rows[index].querySelector(`#windday${index + 1}`).textContent = `${forecast.wind} m/s`;
            }
        });
    }
    // Event listener for search button
    document.getElementById("search-button").addEventListener("click", function () {
        const cityInput = document.getElementById("input-field").value.trim();
        if (cityInput) {
            fetchAndStoreWeather(cityInput);
        }
    });

    // Event listener for Enter key
    document.getElementById("input-field").addEventListener("keydown", function (event) {
        // Check if the pressed key is Enter (key code 13)
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
    const cycleCity = () => {
        currentCityIndex = (currentCityIndex + 1) % cities.length; // % means we loop back
        // Get the current city
        const city = cities[currentCityIndex];
        fetchAndStoreWeather(city);
    };
    const nextSideButton = document.getElementById('next-side-button');
    console.log('Next side button:', nextSideButton);
    if (nextSideButton) {
        nextSideButton.addEventListener('click', cycleCity);
    }
    else {
        console.error("Could not find button with ID 'next-side-button'");
    }
});
