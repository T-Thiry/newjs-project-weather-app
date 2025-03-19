document.addEventListener('DOMContentLoaded', () => {

  const API_KEY = '0250724e2245517a875bc5855eb34244';
  const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
  //const URL = 'api.openweathermap.org/data/2.5/forecast';


  //Global 
  let weeklyForecast = []
  let cities = ['Stockholm', 'Gothenburg', 'Oslo']

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
});




/*Function to loop through city+weather
cities.forEach(city => {
  fetchForecast(city).then(data => {
    // Array för 4 dagars prognos
    const dailyForecasts = [];

    // Hämta prognoser för 4 dagar (en prognos per dag)
    const processedDates = new Set();

    // Loopa genom forecast-listan
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString();

      // Lägg bara till en prognos per dag
      if (!processedDates.has(date) && dailyForecasts.length < 4) {
        processedDates.add(date);

        const dayForecast = {
          city: city,
          weekday: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' }),
          weather: item.weather[0].description,
          temp: item.main.temp,
          wind: item.wind.speed
        };

        dailyForecasts.push(dayForecast);
      }
    });

    // Lagra i weeklyForecast
    weeklyForecast = dailyForecasts;
    console.log(weeklyForecast);

    // Spara datan
    localStorage.setItem("forecastData", JSON.stringify(weeklyForecast));

    // Visa prognosen (visa alla 4 dagar)
    dailyForecasts.forEach(forecast => {
      displayForecast(forecast);
    });
  });
});

function displayForecast(forecast) {
  // Skapa ett nytt element för varje dag
  const forecastItem = document.createElement('div');
  forecastItem.className = 'forecast-item';

  // Lägg till HTML med template literal
  forecastItem.innerHTML = `
    <p id="weekday">${forecast.weekday}</p>
    <p id="temperature">${Math.round(forecast.temp)}°C</p>
    <p id="city">${forecast.city}</p>
    <p id="weather">${forecast.weather}</p>
    <p id="wind">Wind: ${forecast.wind} m/s</p>
  `;

  // Lägg till i container
  document.querySelector('.weather-forecast').appendChild(forecastItem);
}*/









/*const API_KEY = '0250724e2245517a875bc5855eb34244';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weatherr';

//moved these up here for better structure
const weeklyForecast = [];
const cities = ['Stockholm', 'Gothenburg', 'Oslo'];

async function fetchWeather(city) {
  const response = await fetch(`${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`);
  const data = await response.json();
  return data;
}

//We need to loop through the cities through foreach
// Take action with data through .then
//Call function correctly   
cities.forEach(city => {
  fetchWeather(city).then(data => {

    // Variables for the data properties
    let weather = data.weather[0].description;
    let temperature = data.main.temp;
    let wind = data.wind.speed;
    let sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    let sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    const dayForecast = {
      city: city,
      weather: weather,
      temp: temperature,
      wind: wind,
      sunrise: sunriseTime,
      sunset: sunsetTime
    };

    weeklyForecast.push(dayForecast);
    console.log(weeklyForecast);


    //Each time a city's weather data is processed, its added to the weeklyForecast array
    //Entire updated array is converted to a string with JSON.stringify()
    //Saved to localStorage under the key "weatherData"
    localStorage.setItem("weatherData", JSON.stringify(weeklyForecast));
  });
});

//We also are asked to show forecast right?
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

async function fetchForecast(city) {
  const response = await fetch(`${FORECAST_URL}?q=${city}&units=metric&appid=${API_KEY}`);
  const data = await response.json();
  return data;
}

//Start with displaying the data
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
//Calling the function
displayWeather(weeklyForecast[0])

//Search filed/button in html
//Calling the field and button
const searchButton = document.getElementById('search-button');
const inputField = document.getElementById('input-field');

//Function checks for input text and then shows weather
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
};

// Add event listeners to the searchglass and to inputfield(enter) 
searchButton.addEventListener('click', searchWeather);
inputField.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    searchWeather();
  }
  })


  //Function to fetch forecast
  async function fetchForecast(city) {
    const response = await fetch(`${URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`);
    const data = await response.json();
    console.log(data);
    return data;
  }

  //Function to loop through city+weather
  cities.forEach(city => {
    fetchForecast(city).then(data => {
      // Array för 4 dagars prognos
      const dailyForecasts = [];

      // Hämta prognoser för 4 dagar (en prognos per dag)
      const processedDates = new Set();

      // Loopa genom forecast-listan
      data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();

        // Lägg bara till en prognos per dag
        if (!processedDates.has(date) && dailyForecasts.length < 4) {
          processedDates.add(date);

          const dayForecast = {
            city: city,
            weekday: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' }),
            weather: item.weather[0].description,
            temp: item.main.temp,
            wind: item.wind.speed
          };

          dailyForecasts.push(dayForecast);
        }
      });

      // Lagra i weeklyForecast
      weeklyForecast = dailyForecasts;
      console.log(weeklyForecast);

      // Spara datan
      localStorage.setItem("forecastData", JSON.stringify(weeklyForecast));

      // Visa prognosen (visa alla 4 dagar)
      dailyForecasts.forEach(forecast => {
        displayForecast(forecast);
      });
    });
  });

  function displayForecast(forecast) {
    // Skapa ett nytt element för varje dag
    const forecastItem = document.createElement('div');
    forecastItem.className = 'forecast-item';

    // Lägg till HTML med template literal
    forecastItem.innerHTML = `
    <p id="weekday">${forecast.weekday}</p>
    <p id="temperature">${Math.round(forecast.temp)}°C</p>
    <p id="city">${forecast.city}</p>
    <p id="weather">${forecast.weather}</p>
    <p id="wind">Wind: ${forecast.wind} m/s</p>
  `;

    // Lägg till i container
    document.querySelector('.weather-forecast').appendChild(forecastItem);
  }*/