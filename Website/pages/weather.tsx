import { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import React from "react";
import Image from "next/image"; // Import next/image for optimized images

// Dynamically import Plotly for gauge charts and historical data graph
const PlotlyComponent = dynamic(() => import("react-plotly.js"), { ssr: false });

interface Condition {
  text: string;
  icon: string;
}

interface HourlyForecast {
  time: string;
  temp_c: number;
  wind_kph: number;
  humidity: number;
  chance_of_rain: number;
  condition: Condition;
}

interface DayCondition {
  text: string;
  icon: string;
}

interface ForecastDay {
  date: string;
  day: {
    avgtemp_c: number;
    maxwind_kph: number;
    avghumidity: number;
    daily_chance_of_rain: number;
    condition: DayCondition;
  };
  hour?: HourlyForecast[];
}

interface Forecast {
  forecast: {
    forecastday: ForecastDay[];
  };
}

interface SensorReading {
  Sensor_Timestamp: string;
  Sensor_Value: number;
}

const Weather: NextPage = () => {
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<string>("Wind Speed");
  const [forecastPeriod, setForecastPeriod] = useState<string>("7DAY");
  const location = "Amarillo"; // Default location

  const API_KEY = "cd1abd4ac4484d84b5455301251903"; //WeatherAPI key

  // Adjust states to use SensorReading
  const [WindSpeedData, setWindSpeedData] = useState<SensorReading[] | null>(null);
  const [WindDirData, setWindDirData] = useState<SensorReading[] | null>(null);
  const [HumidityData, setHumidityData] = useState<SensorReading[] | null>(null);
  const [PressureData, setPressureData] = useState<SensorReading[] | null>(null);
  const [TempData, setTempData] = useState<SensorReading[] | null>(null);
  const [LuminData, setLuminData] = useState<SensorReading[] | null>(null);
  const [RainfallData, setRainfallData] = useState<SensorReading[] | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/latest/6"), // Wind Speed
      fetch("/api/latest/7"),  // Wind Direction
      fetch("/api/latest/3"),  // Humidity
      fetch("/api/latest/4"),  // Pressure
      fetch("/api/latest/2"),  // Temperature
      fetch("/api/latest/5"),  // Luminescence
      fetch("/api/latest/8"),  // Rainfall
    ])
      .then((responses) => Promise.all(responses.map((r) => r.json())))
      .then(([data2, data3, data4, data5, data6, data7, data8]) => {
        data2.reverse();
        data3.reverse();
        data4.reverse();
        data5.reverse();
        data6.reverse();
        data7.reverse();
        data8.reverse();

        setWindSpeedData(data2);
        setWindDirData(data3);
        setHumidityData(data4);
        setPressureData(data5);
        setTempData(data6);
        setLuminData(data7);
        setRainfallData(data8);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  function latestValue(data: SensorReading[] | null): number {
    if (!data || data.length === 0) return 0;
    return data[data.length - 1].Sensor_Value;
  }

  const windSpeed = Math.round(latestValue(WindSpeedData));
  const windDirection = (latestValue(WindDirData) + 180) % 360;
  const humidity = latestValue(HumidityData);
  const atmosphericPressure = latestValue(PressureData);
  const atmosphericTemperature = latestValue(TempData);
  const luminescence = latestValue(LuminData);
  const rainfall = latestValue(RainfallData);

  const fetchForecastData = useCallback(async () => {
    try {
      let forecastUrl = "";
      switch (forecastPeriod) {
        case "HOURLY":
          forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=1`;
          break;
        case "3DAY":
          forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=3`;
          break;
        case "7DAY":
          forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=7`;
          break;
        default:
          forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=7`;
      }

      const response = await axios.get(forecastUrl);
      setForecast(response.data);
    } catch (error) {
      console.error("Error fetching forecast data:", error);
    }
  }, [forecastPeriod, location]);

  useEffect(() => {
    fetchForecastData();
  }, [fetchForecastData]);

  const renderGauge = (value: number, title: string, range: [number, number], color: string) => {
    return (
      <PlotlyComponent
        data={[{
          type: "indicator",
          mode: "gauge+number",
          value: value,
          title: { text: title },
          gauge: {
            axis: { range: range },
            bar: { color: color },
            steps: [
              { range: [0, range[1] / 2], color: "#ffcccc" },
              { range: [range[1] / 2, range[1]], color: "#66cc66" },
            ],
          },
        }]}

        layout={{
          autosize: true,
          margin: { t: 50, r: 40, l: 40, b: 40 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          font: { color: "black" },
        }}
        useResizeHandler
        style={{ width: "100%", height: "200px" }}
      />
    );
  };

  const renderForecast = () => {
    if (!forecast || !forecast.forecast?.forecastday) return null;
  
    let dataToRender: (ForecastDay | HourlyForecast)[] = []; // Mixed type for both ForecastDay and HourlyForecast
  
    if (forecastPeriod === "HOURLY") {
      // Extract hourly data for the first day in the forecast
      dataToRender = forecast.forecast.forecastday[0]?.hour || [];
    } else {
      // Use the entire forecastday array for daily forecast periods
      dataToRender = forecast.forecast.forecastday;
    }
  
    return (
      <div className="flex flex-col space-y-4">
        {dataToRender.map((item, index) => {
          // Check if the item is an HourlyForecast or ForecastDay
          const isHourly = (item as HourlyForecast).time !== undefined; // HourlyForecast has 'time'
  
          return (
            <div key={index} className="bg-white rounded-lg shadow p-4 text-black text-center">
              <h4 className="font-semibold">
                {isHourly
                  ? (item as HourlyForecast).time.split(" ")[1] // Display time for hourly forecast
                  : (item as ForecastDay).date} 
              </h4>
              <Image
                src={`https:${isHourly
                  ? (item as HourlyForecast).condition.icon
                  : (item as ForecastDay).day.condition.icon}`}
                alt={isHourly
                  ? (item as HourlyForecast).condition.text
                  : (item as ForecastDay).day.condition.text}
                width={48}
                height={48}
                className="mx-auto"
              />
              <p>
                {isHourly
                  ? (item as HourlyForecast).temp_c
                  : (item as ForecastDay).day.avgtemp_c}°C
              </p>
              <p>
                Wind: {isHourly
                  ? (item as HourlyForecast).wind_kph
                  : (item as ForecastDay).day.maxwind_kph} km/h
              </p>
              <p>
                Humidity: {isHourly
                  ? (item as HourlyForecast).humidity
                  : (item as ForecastDay).day.avghumidity}%
              </p>
              <p>
                Rain: {isHourly
                  ? (item as HourlyForecast).chance_of_rain
                  : (item as ForecastDay).day.daily_chance_of_rain}%
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>TerraTek</title>
        <meta name="description" content="Tank Dashboard UI" />
      </Head>

      <main className="bg-slate-500 p-6">
        <div className="flex flex-col gap-6 h-screen">
          <section className="bg-slate-100 rounded-lg shadow p-6 text-black flex flex-col items-center">
            <h2 className="text-center text-xl font-semibold mb-4">Current Readings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
              {renderGauge(windSpeed, "Wind Speed", [0, 50], "#00f")}
              {renderGauge(windDirection, "Wind Direction", [0, 360], "#ffa500")}
              {renderGauge(humidity, "Humidity", [0, 100], "#0f0")}
              {renderGauge(atmosphericPressure, "Pressure", [950, 1050], "#f00")}
              {renderGauge(atmosphericTemperature, "Temperature", [-10, 50], "#ff6347")}
              {renderGauge(luminescence, "Luminescence", [0, 1000], "#add8e6")}
              {renderGauge(rainfall, "Rainfall", [0, 100], "#87cefa")}
            </div>
          </section>

          <section className="bg-slate-100 rounded-lg shadow p-4 text-black overflow-y-auto">
            <h2 className="text-center text-xl font-semibold mb-3">Weather Forecast</h2>
            <div className="mb-4 flex justify-start">
              <select
                className="p-2 border border-gray-300 rounded-md"
                value={forecastPeriod}
                onChange={(e) => setForecastPeriod(e.target.value)}
              >
                <option value="HOURLY">Hourly Forecast</option>
                <option value="3DAY">3 Day Forecast</option>
                <option value="7DAY">7 Day Forecast</option>
              </select>
            </div>
            {forecast ? renderForecast() : <p>Loading forecast...</p>}
          </section>

          <section className="flex-grow bg-slate-100 rounded-lg shadow p-4 text-black flex flex-col">
            <h2 className="text-center text-xl font-semibold mb-3">Historical Data</h2>
            <div className="mb-4 flex justify-start">
              <select
                className="p-2 border border-gray-300 rounded-md"
                value={selectedSensor}
                onChange={(e) => setSelectedSensor(e.target.value)}
              >
                <option value="Wind Speed">Wind Speed</option>
                <option value="Humidity">Humidity</option>
                <option value="Pressure">Pressure</option>
                <option value="Wind Direction">Wind Direction</option>
                <option value="Temperature">Temperature</option>
                <option value="Luminescence">Luminescence</option>
                <option value="Rainfall">Rainfall</option>
              </select>
            </div>
            <div className="flex-grow">
              <PlotlyComponent
                data={[{
                  x: ["Jan", "Feb", "Mar"],
                  y: [65, 66, 67],
                  type: "scatter",
                  mode: "lines+markers",
                  marker: { color: "red" },
                }]}
                layout={{
                  autosize: true,
                  title: `${selectedSensor} - Historical Data`,
                  margin: { t: 30, r: 10, l: 40, b: 30 },
                }}
                useResizeHandler
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default Weather;
