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

  //Function to loop through city+weather (jasmin added.then)
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
    });

    //Storing data (jasmin added)
    localStorage.setItem("weatherData", JSON.stringify(weeklyForecast));
  });


  // Function to display data 



});
//The app should have: city name, current temperature, weather description, sunrise and sunset time, 4-day forecast
