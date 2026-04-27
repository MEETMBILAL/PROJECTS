import React, { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';

const API_KEY = 'efba491989c2f16eef8e17feba5a0f9b';
const AUTO_REFRESH_MS = 10 * 60 * 1000;

const WEATHER_THEMES = {
  Clear: {
    label: 'Clear sky',
    className: 'theme-clear',
    accent: 'Sunlit outlook',
  },
  Clouds: {
    label: 'Layered clouds',
    className: 'theme-clouds',
    accent: 'Soft overcast',
  },
  Rain: {
    label: 'Rainy weather',
    className: 'theme-rain',
    accent: 'Bring an umbrella',
  },
  Drizzle: {
    label: 'Light rain',
    className: 'theme-rain',
    accent: 'Mist in the air',
  },
  Thunderstorm: {
    label: 'Storm front',
    className: 'theme-storm',
    accent: 'Stay weather-aware',
  },
  Snow: {
    label: 'Snowfall',
    className: 'theme-snow',
    accent: 'Cold and bright',
  },
  Mist: {
    label: 'Low visibility',
    className: 'theme-mist',
    accent: 'Foggy conditions',
  },
  Haze: {
    label: 'Hazy air',
    className: 'theme-mist',
    accent: 'Muted skyline',
  },
  Smoke: {
    label: 'Smoky air',
    className: 'theme-mist',
    accent: 'Low clarity',
  },
  Default: {
    label: 'Weather snapshot',
    className: 'theme-default',
    accent: 'Ready for a quick check',
  },
};

function App() {
  const [city, setCity] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('C');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const abortControllerRef = useRef(null);

  useEffect(() => {
    const lastCity = localStorage.getItem('lastCity');

    if (lastCity) {
      setCity(lastCity);
      setSearchInput(lastCity);
    } else {
      setCity('Karachi');
      setSearchInput('Karachi');
    }
  }, []);

  useEffect(() => {
    if (!city) {
      return undefined;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        const currentResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`,
          { signal, cache: 'no-store' }
        );

        if (!currentResponse.ok) {
          throw new Error('cityNotFound');
        }

        const currentData = await currentResponse.json();

        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`,
          { signal, cache: 'no-store' }
        );

        if (!forecastResponse.ok) {
          throw new Error('cityNotFound');
        }

        const forecastData = await forecastResponse.json();

        setWeather(currentData);
        processForecast(forecastData);
        setLastUpdated(currentData.dt ? currentData.dt * 1000 : Date.now());
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }

        if (err.message === 'cityNotFound') {
          setError('City not found. Try another search.');
        } else {
          setError('Network error. Please check your connection.');
        }

        setWeather(null);
        setForecast([]);
        setLastUpdated(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [city, refreshKey]);

  useEffect(() => {
    if (!city) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setRefreshKey((current) => current + 1);
    }, AUTO_REFRESH_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [city]);

  useEffect(() => {
    if (city) {
      localStorage.setItem('lastCity', city);
    }
  }, [city]);

  const processForecast = (data) => {
    const dailyMap = new Map();

    data.list.forEach((item) => {
      const date = item.dt_txt.split(' ')[0];
      const temp = item.main.temp;
      const icon = item.weather[0].icon;

      if (!dailyMap.has(date)) {
        dailyMap.set(date, {
          date,
          tempMin: temp,
          tempMax: temp,
          icon,
        });
      } else {
        const existing = dailyMap.get(date);
        existing.tempMin = Math.min(existing.tempMin, temp);
        existing.tempMax = Math.max(existing.tempMax, temp);
      }
    });

    setForecast(Array.from(dailyMap.values()).slice(0, 5));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!searchInput.trim()) {
      return;
    }

    setCity(searchInput.trim());
  };

  const toggleUnit = () => {
    setUnit((currentUnit) => (currentUnit === 'C' ? 'F' : 'C'));
  };

  const handleRefresh = () => {
    if (!city) {
      return;
    }

    setRefreshKey((current) => current + 1);
  };

  const convertTemp = (celsius) => {
    if (unit === 'C') {
      return Number(celsius).toFixed(1);
    }

    return Number((celsius * 9) / 5 + 32).toFixed(1);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);

    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const theme = useMemo(() => {
    if (!weather) {
      return WEATHER_THEMES.Default;
    }

    return WEATHER_THEMES[weather.weather[0].main] || WEATHER_THEMES.Default;
  }, [weather]);

  const statCards = weather
    ? [
        {
          label: 'Feels like',
          value: `${convertTemp(weather.main.feels_like)} deg ${unit}`,
        },
        {
          label: 'Humidity',
          value: `${weather.main.humidity}%`,
        },
        {
          label: 'Wind',
          value: `${Number(weather.wind.speed).toFixed(1)} m/s`,
        },
        {
          label: 'Pressure',
          value: `${weather.main.pressure} hPa`,
        },
        {
          label: 'Range',
          value: `${convertTemp(weather.main.temp_min)} to ${convertTemp(weather.main.temp_max)} deg`,
        },
      ]
    : [];

  const formattedUpdateTime = lastUpdated
    ? new Date(lastUpdated).toLocaleString(undefined, {
        weekday: 'short',
        hour: 'numeric',
        minute: '2-digit',
      })
    : '';

  return (
    <div className={`weather-shell ${theme.className}`}>
      <div className="weather-app">
        <section className="hero-panel">
          <div className="hero-copy">
            <p className="eyebrow">Live weather dashboard</p>
            <h1>Check the sky before you step outside.</h1>
            <p className="hero-text">
              A polished forecast view with simple beginner-friendly logic underneath:
              search a city, switch units, and scan the next few days.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="search-panel">
            <label className="search-label" htmlFor="city-search">
              Search city
            </label>
            <div className="search-row">
              <input
                id="city-search"
                type="text"
                placeholder="Enter city name"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                Search
              </button>
            </div>
            <div className="control-row">
              <button type="button" onClick={toggleUnit} className="unit-toggle">
                Switch to {unit === 'C' ? 'F' : 'C'}
              </button>
              <button type="button" onClick={handleRefresh} className="unit-toggle refresh-btn">
                Refresh now
              </button>
            </div>
          </form>
        </section>

        {loading && (
          <div className="status-card">
            <div className="spinner" />
            <p>Loading forecast...</p>
          </div>
        )}

        {error && !loading && <div className="status-card error-card">{error}</div>}

        {!loading && !error && weather && (
          <>
            <section className="overview-grid">
              <article className="current-card">
                <div className="current-card-top">
                  <div>
                    <p className="card-kicker">{theme.accent}</p>
                    <h2>
                      {weather.name}, {weather.sys.country}
                    </h2>
                  </div>
                  <img
                    className="weather-icon"
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                    alt={weather.weather[0].description}
                  />
                </div>

                <div className="current-temp">
                  {convertTemp(weather.main.temp)}
                  <span>deg {unit}</span>
                </div>

                <div className="condition-row">
                  <span>{theme.label}</span>
                  <span>{weather.weather[0].description}</span>
                </div>
                <p className="update-time">
                  Last updated: {formattedUpdateTime || 'Waiting for fresh data'}
                </p>
              </article>

              <article className="summary-card">
                <h3>Today at a glance</h3>
                <div className="summary-stats">
                  {statCards.map((card) => (
                    <div key={card.label} className="summary-stat">
                      <span>{card.label}</span>
                      <strong>{card.value}</strong>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            {forecast.length > 0 && (
              <section className="forecast-section">
                <div className="section-header">
                  <div>
                    <p className="eyebrow">Next 5 days</p>
                    <h3>Forecast trend</h3>
                  </div>
                  <p className="forecast-note">
                    High and low temperatures are shown in {unit === 'C' ? 'Celsius' : 'Fahrenheit'}.
                  </p>
                </div>

                <div className="forecast-grid">
                  {forecast.map((day) => (
                    <article key={day.date} className="forecast-card">
                      <div>
                        <p className="forecast-date">{formatDate(day.date)}</p>
                        <p className="forecast-label">Daily outlook</p>
                      </div>
                      <img
                        src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                        alt="forecast icon"
                      />
                      <div className="forecast-temps">
                        <span className="forecast-high">
                          {convertTemp(day.tempMax)} deg
                        </span>
                        <span className="forecast-low">
                          {convertTemp(day.tempMin)} deg
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {!loading && !error && !weather && (
          <div className="status-card empty-card">
            Search for a city to load current weather and a 5-day forecast.
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
