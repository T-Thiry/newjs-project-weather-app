document.addEventListener('DOMContentLoaded', () => {
  const API_KEY = '0250724e2245517a875bc5855eb34244';
  const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

  //Global 
  const weeklyForecast = [];
  const cities = ['Stockholm', 'Gothenburg', 'Oslo']

  //Function to fetch weather
  async function fetchWeather(city) {
    const response = await fetch(`${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`);
    const data = await response.json();
    return data;
  }

  //Function to loop through city+weather (jasmin added .then)
  cities.forEach(city => {
    fetchWeather(city).then(data => {
      //Variables for the data properties
      let weather = data.weather[0].description;
      console.log(weather)
      let temperature = data.main.temp;
      console.log(temperature)
      let wind = data.wind.speed;
      console.log(wind)
      let sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      console.log(sunriseTime)
      let sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      console.log(sunsetTime)

      const dayForecast = {
        city: city,
        weather: weather,
        temp: temperature,
        wind: wind,
        sunrise: sunriseTime,
        sunset: sunsetTime
      };

      weeklyForecast.push(dayForecast);
      console.log(weeklyForecast)

      //Storing data (jasmin added)
      if (weeklyForecast.length === cities.length) {
        localStorage.setItem("weatherData", JSON.stringify(weeklyForecast));
      }

      //Calling the function (jasmin added)
      displayWeather(weeklyForecast[0])

    });

    //Start displaying the data (jasmin added)
    function displayWeather(forecast) {
      // Get the weather content container
      const weatherContent = document.querySelector('.weather-content');

      // Use template literals to build the HTML
      weatherContent.innerHTML = `
        <p id="temperature">${Math.round(forecast.temp)}°C</p>
        <p id="city">${forecast.city}</p>
        <p id="time">${new Date().toLocaleTimeString()}</p>
        <p id="weather">${forecast.weather}</p>
        <p id="sunrise">Sunrise: ${forecast.sunrise}</p>
        <p id="sunset">Sunset: ${forecast.sunset}</p>
      `;
    }

    //Function for our searchfield (jasmin added)
    //Search filed/button in html
    //Calling the field and button
    const searchButton = document.getElementById('search-button');
    const inputField = document.getElementById('input-field');


    async function searchWeather() {
      const city = inputField.value.trim(); // trim is a string method
      if (city) {
        try {
          const data = await fetchWeather(city);
          // Use the displayWeather function to show the searched city's weather
          displayWeather({
            city: data.name,
            weather: data.weather[0].description,
            temp: data.main.temp,
            sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
            sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
          });
        } catch (error) {
          console.error('Error fetching weather:', error);
        }
      }
    }
    searchButton.addEventListener('click', searchWeather);
    inputField.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        searchWeather();
      }
    });

  });



  //Function for forecast 4 day?






});



//The app should have: city name, current temperature, weather description, sunrise and sunset time, 4-day forecast
