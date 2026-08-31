import { useState } from "react";

function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = "b8414d31be44915708eb713a8811dfef";

  const getWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      setWeather(null);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setWeather(null);

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city,
      )}&appid=${API_KEY}&units=metric`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to fetch weather data");
        return;
      }

      setWeather({
        cityName: `${data.name}, ${data.sys.country}`,
        temperature: data.main.temp,
        humidity: data.main.humidity,
        wind: data.wind.speed,
        condition: data.weather[0].main,
        description: data.weather[0].description,
      });
    } catch (err) {
      console.error(err);
      setError("Network error. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather">
      <h1>Weather App</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter city (e.g. Rajkot, Mumbai)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              getWeather();
            }
          }}
        />

        <button onClick={getWeather} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-result">
          <h2>{weather.cityName}</h2>

          <div className="weather-info">
            <div className="weather-card">
              <span>🌡️ Temperature</span>
              <strong>{Math.round(weather.temperature)}°C</strong>
            </div>

            <div className="weather-card">
              <span>💧 Humidity</span>
              <strong>{weather.humidity}%</strong>
            </div>

            <div className="weather-card">
              <span>💨 Wind</span>
              <strong>{weather.wind} m/s</strong>
            </div>

            <div className="weather-card">
              <span>☁️ Weather</span>
              <strong>{weather.condition}</strong>
            </div>

            <div className="weather-card full-width">
              <span>🌤️ Description</span>
              <strong>{weather.description}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Weather;
