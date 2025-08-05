// Importing a custom icon mapping object for weather descriptions
import { iconMap } from "./iconmap.js";

// Selecting DOM elements
const search_input = document.querySelector("#search");
const search_btn = document.querySelector(".search-button");
const current_location_btn = document.querySelector(".current-location-btn");
const dropdown = document.getElementById("dropdown");

// Get recent searches from local storage
function getRecentSearches() {
  return JSON.parse(localStorage.getItem("recentSearches")) || [];
}

// Save a new search to local storage, ensuring no duplicates and limiting to 5 items
function saveRecentSearch(city) {
  let recent = getRecentSearches();
  recent = recent.filter((item) => item !== city);
  recent.unshift(city);
  if (recent.length > 5) recent = recent.slice(0, 5);
  localStorage.setItem("recentSearches", JSON.stringify(recent));
}

// Show recent searches in a dropdown
function showDropdown() {
  const recent = getRecentSearches();
  dropdown.innerHTML = `
    <li class="text-gray-700 py-0.5 cursor-default">Recent Searches</li>
    <hr class="my-0.5">
  `;

  // If no recent searches, hide the dropdown
  if (recent.length === 0) {
    dropdown.classList.add("hidden");
    return;
  }

  // Add each recent city to the dropdown list
  recent.forEach((city) => {
    const li = document.createElement("li");
    li.textContent = city;
    li.className = "hover:bg-blue-100 cursor-pointer py-1";
    li.onclick = () => {
      search_input.value = city;
      fetchCoordinates(city);
      dropdown.classList.add("hidden");
    };
    dropdown.appendChild(li);
  });

  dropdown.classList.remove("hidden");
}

// Show dropdown when input is focused or typed in
search_input.addEventListener("focus", showDropdown);
search_input.addEventListener("input", showDropdown);

// Hide dropdown if user clicks outside
document.addEventListener("click", (e) => {
  if (!e.target.closest("#search") && !e.target.closest("#dropdown")) {
    dropdown.classList.add("hidden");
  }
});

// Populate main weather card with data
function currentWeatherData(data, current_location, city) {
  const location = current_location;
  let date = new Date();
  date = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;

  let name = data.name;
  if (location) {
    name = data.name;
  } else if (name[0].toLowerCase().trim() !== city.toLowerCase().trim()) {
    name = city[0].toUpperCase() + city.slice(1);
  }

  document.querySelector(".main-card-h2").textContent = `${name} (${date})`;

  // Convert Kelvin to Celsius
  const temp = (data.main.temp - 273.15).toFixed(0);

  // Update temperature, wind and humidity
  document.querySelector(".main-card-temp").textContent = `Temperature: ${temp}\u00B0C`;
  document.querySelector(".main-card-wind").textContent = `Wind: ${data.wind.speed}M/S`;
  document.querySelector(".main-card-humidity").textContent = `Humidity: ${data.main.humidity}%`;

  // Update weather description and icon
  document.querySelector(".main-card-description").textContent = data.weather[0].description;
  document.querySelector(".main-card-icon").src = `../icons/${iconMap[data.weather[0].description]}.svg`;
}

// Generate 5-day forecast cards from weather data
function forecastWeatherData(list) {
  const cards = document.querySelector("#cards");
  cards.innerHTML = ""; // Clear previous forecast

  const today = new Date();
  const current_hour = today.getHours();
  let nearestHour = Math.round(current_hour / 3) * 3;
  if (nearestHour === 24) nearestHour = 0;
  const timeString = `${String(nearestHour).padStart(2, "0")}:00:00`;

  // Filter forecasts to get one entry per day at the same time
  const dailyForecast = list.filter((item) => item.dt_txt.includes(timeString));

  // Create and append a card for each forecast day
  dailyForecast.forEach((day) => {
    const temp = (day.main.temp - 273.15).toFixed(0);
    const date = new Date(day.dt_txt).toDateString();

    const section = document.createElement("section");
    section.className = "backdrop-blur-lg bg-white/40 border border-white/30 rounded-xl shadow-lg hover:shadow-xl transition-all p-3 w-[50%] mb-6 m-auto md:w-[25%] md:m-0 lg:w-[16.8%] lg:px-1.5 lg:py-3";
    section.innerHTML = `
      <h2 class="text-center font-bold text-[16px] m-2.5 text-[#0284C7]">${date}</h2>
      <section class="text-center flex flex-col justify-center items-center">
        <figure class="flex flex-col justify-center items-center">
          <img src="../icons/${iconMap[day.weather[0].description]}.svg" alt="description" class="h-16 brightness-110" />
          <figcaption class="py-1.5 font-medium lg:pb-2">${day.weather[0].description}</figcaption>
        </figure>

        <section class="flex flex-col text-[14px] mr-5">
          <figure class="flex">
            <img src="../icons/thermometer.svg" alt="Temperature" class="w-10" />
            <figcaption class="py-2">Temp: ${temp}\u00B0C</figcaption>
          </figure>
          <figure class="flex">
            <img src="../icons/wind.svg" alt="Wind" class="w-10 brightness-75" />
            <figcaption class="py-2 ">Wind: ${day.wind.speed}M/S</figcaption>
          </figure>
          <figure class="flex">
            <img src="../icons/humidity.svg" alt="Humidity" class="w-10" />
            <figcaption class="py-2">Humidity: ${day.main.humidity}%</figcaption>
          </figure>
        </section>
      </section>`;
    cards.appendChild(section);
  });
}

// Fetch current and forecast weather data using latitude and longitude
function weatherDataLatLon(lat, lon, current_location, city) {
  // Fetch current weather
  const cityData = fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=a850f6dcb749758c3d00b44e7aa7b76f`);
  cityData
    .then((response) => response.json())
    .then((data) => currentWeatherData(data, current_location, city))
    .catch((err) => {
      if (!navigator.onLine) {
        alert("You are currently offline. Please check your internet connection.");
        return;
      }
    });

  // Fetch 5-day forecast
  const forecastData = fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=a850f6dcb749758c3d00b44e7aa7b76f`);
  forecastData
    .then((response) => response.json())
    .then((data) => forecastWeatherData(data.list));
}

// Fetch coordinates (lat/lon) from city name
function fetchCoordinates(city) {
  const coordinates = fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&&appid=a850f6dcb749758c3d00b44e7aa7b76f`);
  coordinates
    .then((response) => response.json())
    .then((res) => {
      if (res.length === 0) {
        alert("City not found. Please try again.");
        return;
      }
      weatherDataLatLon(res[0].lat, res[0].lon, false, city);
    })
    .catch((err) => alert("Something went wrong. Please try again later."));

  saveRecentSearch(city);
}

// Search button click handler
search_btn.addEventListener("click", () => {
  const city = search_input.value.trim();
  if (city === "") {
    return alert("Enter a City Name");
  }
  fetchCoordinates(city);
});

// Current location button click handler
current_location_btn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      weatherDataLatLon(lat, lon, true);
    },
    (error) => {
      // Handle geolocation errors
      switch (error.code) {
        case error.PERMISSION_DENIED:
          alert("Location access was denied. Please allow location permission.");
          break;
        case error.POSITION_UNAVAILABLE:
          alert("Location information is unavailable.");
          break;
        case error.TIMEOUT:
          alert("Location request timed out.");
          break;
        default:
          alert("An unknown error occurred.");
          break;
      }
    }
  );
});

// Automatically fetch weather for a default location on page load (Hyderabad)
window.onload = function () {
  weatherDataLatLon(17.4065, 78.4772, true);
};
