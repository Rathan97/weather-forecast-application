# 🌤️ Weather Forecast Application

A responsive Weather Forecast Web Application developed using **JavaScript**, **HTML**, and **Tailwind CSS**. It fetches real-time weather data from the OpenWeatherMap API and displays current and extended forecasts in an intuitive and interactive UI.

---

## 📌 Project Overview

This application enables users to:
- Search for weather forecasts by **city name**
- Get **current location** based forecasts
- View **5-day extended weather forecasts**
- Access **recent search history**
- Experience a **responsive UI** across different screen sizes (Desktop, iPad Mini, iPhone SE)

---

## 🚀 Features

### ✅ Project Structure & Tools
- Structured into `index.html`, `style.css`, and `script.js`
- Uses **Tailwind CSS** for fast and responsive UI design
- **Git** used for version control and collaboration

### 🌐 Weather API Integration
- Integrated with [OpenWeatherMap API](https://openweathermap.org/api)
- Fetches current and 5-day forecast data
- Uses latitude and longitude for location-based search

### 🎨 User Interface
- Clean, mobile-first UI using Tailwind CSS
- Fully responsive across:
  - Desktop
  - iPad Mini
  - iPhone SE

### 📍 Location-Based Forecast
- 🔍 Search by city name
- 📍 Detect current location (using `navigator.geolocation`)
- 🔽 Dropdown for recently searched cities (using `localStorage`)
- 🌡️ Displays:
  - Temperature
  - Humidity
  - Wind Speed
  - Weather icons (sunny, rainy, cloudy, etc.)
- Input validation and event-driven UI updates

### 📅 Extended Forecast
- Displays **5-day weather forecast**
- Each card includes:
  - Date
  - Weather icon
  - Temperature
  - Wind speed
  - Humidity

### ⚠️ Error Handling
- Alerts user when:
  - Internet is disconnected
  - Invalid city name is entered
  - API fails to respond

---

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Rathan97/weather-forecast-app.git
cd weather-forecast-app
```

### 2. API Key Setup

in index.js replace 
```bash
const apiKey = "YOUR_API_KEY";
```

### 3. Setup Tailwind css 

Install Tailwind CSS using the CLI:

```bash
npm install -D tailwindcss
npx tailwindcss init
```
Follow the official Tailwind installation guide here: https://tailwindcss.com/docs/installation

### 4. Run Locally 

Open **index.html** in your browser.


### Folder Structure

```
weather-forecast-app/
├── 📁 icons
├── 📁 public/
│   ├── index.html
│   ├── style.css
├── index.js
├── iconmap.js
└── README.md
```

## 📎 GitHub Repository
[Github Repo Link](https://github.com/Rathan97/weather-forecast-app)

## 👨‍💻 Developed By
Rathnakar Sidramyna

