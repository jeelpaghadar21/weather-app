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
      setError("");
      setLoading(true);
      setWeather(null);

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${API_KEY}&units=metric`;

      const response = await fetch(url);
      const data = await response.json();

      console.log("OpenWeather Response:", data);

      if (!response.ok) {
        setError(data.message || "Unable to fetch weather data");
        return;
      }

      setWeather({
        cityName: `${data.name}, ${data.sys.country}`,
        data: {
          temperature: data.main.temp,
          humidity: data.main.humidity,
          wind: data.wind.speed,
          condition: data.weather[0].main,
          description: data.weather[0].description,
        },
      });
    } catch (err) {
      console.error("API Error:", err);
      setError("Network error. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather">
      <h1>Weather App</h1>

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

      {error && <p>{error}</p>}

      {weather && (
        <div>
          <h2>{weather.cityName}</h2>

          <p>
            🌡 Temperature: {Math.round(weather.data.temperature)}°C
          </p>

          <p>
            💧 Humidity: {weather.data.humidity}%
          </p>

          <p>
            💨 Wind: {weather.data.wind} m/s
          </p>

          <p>
            ☁️ Weather: {weather.data.condition}
          </p>

          <p>
            🌤 Description: {weather.data.description}
          </p>
        </div>
      )}
    </div>
  );
}

export default Weather;