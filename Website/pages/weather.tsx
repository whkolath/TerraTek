import { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import React from "react";
import Image from "next/image"; // Import next/image for optimized images
//import Plotly from "plotly.js-dist";



// Dynamically import Plotly for gauge charts and historical data graph
const PlotlyComponent = dynamic(() => import("react-plotly.js"), { ssr: false });
// const interval = "hourly"; // Options: "halfhour", "hourly", "daily"



interface SensorReading {
  Sensor_Timestamp: string;
  Sensor_Value: number;
  Interval_Timestamp: string;
  Calculated_Reading: number;
}

type DateRange = {
  start: Date;
  end: Date;
};

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

// type DataSet = {
//   dates: Array<Date>;
//   values: Array<number>;
//   days: Array<Date>;
//   hours: Array<Date>;
// }

// type SensorList = {
//   Sensor_ID: Array<number>;
//   Sensor_Description: Array<string>;
//   Units: Array<string>;
// }

// type BoardList = {
//   Board_ID: Array<string>;
//   Board_Description: Array<string>;
// }



const Weather: NextPage = () => {
  const [forecast, setForecast] = useState<Forecast | null>(null);
  type SensorType = "Wind Speed" | "Wind Direction" | "Humidity" | "Pressure" | "Temperature" | "Luminescence" | "Rainfall";
  const [selectedSensor, setSelectedSensor] = useState<SensorType>("Wind Speed");
  const [forecastPeriod, setForecastPeriod] = useState<string>("7DAY");
  const location = "Amarillo"; // Default location

  const API_KEY = "cd1abd4ac4484d84b5455301251903"; // WeatherAPI key

  // Local state to hold the historical data for the currently selected sensor
  const [, setSensorData] = useState<{ time: Date; value: number }[]>([]);

  // function formatTimeToNazareth(timeString: string): string {
  //   const date = new Date(timeString);
  //   return date.toLocaleTimeString("en-US", {
  //       timeZone: "America/Chicago",
  //       hour: "2-digit",
  //       minute: "2-digit",
  //   });
  // }

  const [time] = useState<DateRange>({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)), // One month ago
    end: new Date(), // Current date
  });


  // Store the latest sensor reading (a number or null)
  const [windSpeedData, setWindSpeedData] = useState<number | null>(null);
  const [windDirData, setWindDirData] = useState<number | null>(null);
  const [humidityData, setHumidityData] = useState<number | null>(null);
  const [pressureData, setPressureData] = useState<number | null>(null);
  const [tempData, setTempData] = useState<number | null>(null);
  const [luminData, setLuminData] = useState<number | null>(null);
  const [rainfallData, setRainfallData] = useState<number | null>(null);

  const [windSpeedHData, setWindSpeedHData] = useState<SensorReading[] | null>(null);
  const [windDirHData, setWindDirHData] = useState<SensorReading[] | null>(null);
  const [humidityHData, setHumidityHData] = useState<SensorReading[] | null>(null);
  const [pressureHData, setPressureHData] = useState<SensorReading[] | null>(null);
  const [tempHData, setTempHData] = useState<SensorReading[] | null>(null);
  const [luminHData, setLuminHData] = useState<SensorReading[] | null>(null);
  const [rainfallHData, setRainfallHData] = useState<SensorReading[] | null>(null);

  // Sensor and board identifiers
  const board_freshwater1 = "0xa8610a3436268316";
  const board_weatherstation = "0xa8610a34362d800f";
  const sensor_Temp = "1";
  const sensor_WindS = "6";
  const sensor_WindD = "7";
  const sensor_Humidity = "3";
  const sensor_Pressure = "4";
  const sensor_Luminescence = "5";
  const sensor_Rainfall = "8";

  const aggregation = "AVG"; // Options: AVG, MIN, MAX, MEDIAN, SUM
  const interval = "hourly"; // Options: "halfhour", "hourly", "daily"





  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          reading2, // Wind Speed
          reading3, // Wind Direction
          reading4, // Humidity
          reading5, // Pressure
          reading6, // Temperature
          reading7, // Luminescence
          reading8, // Rainfall
        ] = await Promise.all([
          fetch(`/api/fetchdata/sensor-data?board=${board_weatherstation}&sensor=${sensor_WindS}&calc=${aggregation}&timeframe=1`),
          fetch(`/api/fetchdata/sensor-data?board=${board_weatherstation}&sensor=${sensor_WindD}&calc=${aggregation}&timeframe=1`),
          fetch(`/api/fetchdata/sensor-data?board=${board_weatherstation}&sensor=${sensor_Humidity}&calc=${aggregation}&timeframe=1`),
          fetch(`/api/fetchdata/sensor-data?board=${board_freshwater1}&sensor=${sensor_Pressure}&calc=${aggregation}&timeframe=1`),
          fetch(`/api/fetchdata/sensor-data?board=${board_weatherstation}&sensor=${sensor_Temp}&calc=${aggregation}&timeframe=1`),
          fetch(`/api/fetchdata/sensor-data?board=${board_freshwater1}&sensor=${sensor_Luminescence}&calc=${aggregation}&timeframe=1`),
          fetch(`/api/fetchdata/sensor-data?board=${board_weatherstation}&sensor=${sensor_Rainfall}&calc=${aggregation}&timeframe=1`),
        ]);

        // Define the expected structure of the response
        interface SensorData {
          Interval_Timestamp: string;
          Calculated_Reading: string;
        }

        // Parse responses
        const data2: SensorData[] = await reading2.json();
        const data3: SensorData[] = await reading3.json();
        const data4: SensorData[] = await reading4.json();
        const data5: SensorData[] = await reading5.json();
        const data6: SensorData[] = await reading6.json();
        const data7: SensorData[] = await reading7.json();
        const data8: SensorData[] = await reading8.json();

        // Helper function to process data arrays.
        const processSensorData = (dataArray: SensorData[]) =>
          dataArray.map(item => ({
            time: new Date(item.Interval_Timestamp),
            value: parseFloat(item.Calculated_Reading),
          }));

        setWindSpeedData(data2?.length > 0 ? parseFloat(data2[0].Calculated_Reading) : null);
        setWindDirData(data3?.length > 0 ? parseFloat(data3[0].Calculated_Reading) : null);
        setHumidityData(data4?.length > 0 ? parseFloat(data4[0].Calculated_Reading) : null);
        setPressureData(data5?.length > 0 ? parseFloat(data5[0].Calculated_Reading) : null);
        setTempData(data6?.length > 0 ? parseFloat(data6[0].Calculated_Reading) : null);
        setLuminData(data7?.length > 0 ? parseFloat(data7[0].Calculated_Reading) : null);
        setRainfallData(data8?.length > 0 ? parseFloat(data8[0].Calculated_Reading) : null);

        // Process each sensor's data
        const windSpeedData = processSensorData(data2);
        const windDirData = processSensorData(data3);
        const humidityData = processSensorData(data4);
        const pressureData = processSensorData(data5);
        const temperatureData = processSensorData(data6);
        const luminData = processSensorData(data7);
        const rainfallData = processSensorData(data8);

        const sensorMapping: Record<SensorType, { time: Date; value: number }[]> = {
          "Wind Speed": windSpeedData,
          "Wind Direction": windDirData,
          "Humidity": humidityData,
          "Pressure": pressureData,
          "Temperature": temperatureData,
          "Luminescence": luminData,
          "Rainfall": rainfallData,
        };

        // Set the state for the currently selected sensor.
        setSensorData(sensorMapping[selectedSensor] || []);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };

    fetchData();
  }, [selectedSensor, setSensorData]);


  useEffect(() => {
    const fetchWindSpeedHData = async () => {
      try {
        const response = await fetch(
          `/api/fetchdata/sensor-data?board=${board_weatherstation}&sensor=${sensor_WindS}&calc=${aggregation}&start=${time.start.toISOString()}&end=${time.end.toISOString()}&timeinterval=${interval}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch wind speed data: ${response.statusText}`);
        }
        const data: SensorReading[] = await response.json();
        setWindSpeedHData(data);
      } catch (error) {
        console.error("Error fetching wind speed data:", error);
      }
    };

    fetchWindSpeedHData();
  }, [time]);

  useEffect(() => {
    const fetchWindDirHData = async () => {
      try {
        const response = await fetch(
          `/api/fetchdata/sensor-data?board=${board_weatherstation}&sensor=${sensor_WindD}&calc=${aggregation}&start=${time.start.toISOString()}&end=${time.end.toISOString()}&timeinterval=${interval}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch wind direction data: ${response.statusText}`);
        }
        const data: SensorReading[] = await response.json();
        setWindDirHData(data);
      } catch (error) {
        console.error("Error fetching wind direction data:", error);
      }
    };

    fetchWindDirHData();
  }, [time]);

  useEffect(() => {
    const fetchHumidityHData = async () => {
      try {
        const response = await fetch(
          `/api/fetchdata/sensor-data?board=${board_weatherstation}&sensor=${sensor_Humidity}&calc=${aggregation}&start=${time.start.toISOString()}&end=${time.end.toISOString()}&timeinterval=${interval}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch humidity data: ${response.statusText}`);
        }
        const data: SensorReading[] = await response.json();
        setHumidityHData(data);
      } catch (error) {
        console.error("Error fetching humidity data:", error);
      }
    };

    fetchHumidityHData();
  }, [time]);

  useEffect(() => {
    const fetchPressureHData = async () => {
      try {
        const response = await fetch(
          `/api/fetchdata/sensor-data?board=${board_freshwater1}&sensor=${sensor_Pressure}&calc=${aggregation}&start=${time.start.toISOString()}&end=${time.end.toISOString()}&timeinterval=${interval}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch pressure data: ${response.statusText}`);
        }
        const data: SensorReading[] = await response.json();
        setPressureHData(data);
      } catch (error) {
        console.error("Error fetching pressure data:", error);
      }
    };

    fetchPressureHData();
  }, [time]);

  useEffect(() => {
    const fetchTempHData = async () => {
      try {
        const response = await fetch(
          `/api/fetchdata/sensor-data?board=${board_weatherstation}&sensor=${sensor_Temp}&calc=${aggregation}&start=${time.start.toISOString()}&end=${time.end.toISOString()}&timeinterval=${interval}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch temperature data: ${response.statusText}`);
        }
        const data: SensorReading[] = await response.json();
        setTempHData(data);
      } catch (error) {
        console.error("Error fetching temperature data:", error);
      }
    };

    fetchTempHData();
  }, [time]);

  useEffect(() => {
    const fetchLuminescenceHData = async () => {
      try {
        const response = await fetch(
          `/api/fetchdata/sensor-data?board=${board_freshwater1}&sensor=${sensor_Luminescence}&calc=${aggregation}&start=${time.start.toISOString()}&end=${time.end.toISOString()}&timeinterval=${interval}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch luminescence data: ${response.statusText}`);
        }
        const data: SensorReading[] = await response.json();
        setLuminHData(data);
      } catch (error) {
        console.error("Error fetching luminescence data:", error);
      }
    };

    fetchLuminescenceHData();
  }, [time]);

  useEffect(() => {
    const fetchRainfallHData = async () => {
      try {
        const response = await fetch(
          `/api/fetchdata/sensor-data?board=${board_weatherstation}&sensor=${sensor_Rainfall}&calc=${aggregation}&start=${time.start.toISOString()}&end=${time.end.toISOString()}&timeinterval=${interval}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch rainfall data: ${response.statusText}`);
        }
        const data: SensorReading[] = await response.json();
        setRainfallHData(data);
      } catch (error) {
        console.error("Error fetching rainfall data:", error);
      }
    };

    fetchRainfallHData();
  }, [time]);





  // Use nullish coalescing to default to 0 if a sensor reading is null
  // const windSpeed = windSpeedData !== null ? Math.round(windSpeedData) : 0;
  // const windDirection = windDirData !== null ? (windDirData + 180) % 360 : 0;
  const humidity = humidityData ?? 0;
  const atmosphericPressure = pressureData ?? 0;
  const atmosphericTemperature = tempData ?? 0;
  const luminescence = luminData ?? 0;
  const rainfall = rainfallData ?? 0;

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
        data={[
          {
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
          },
        ]}
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

    let dataToRender: (ForecastDay | HourlyForecast)[] = [];

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
          const isHourly = (item as HourlyForecast).time !== undefined;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-4 text-black text-center">
              <h4 className="font-semibold">
                {isHourly
                  ? (item as HourlyForecast).time.split(" ")[1]
                  : (item as ForecastDay).date}
              </h4>
              <Image
                src={`https:${isHourly
                    ? (item as HourlyForecast).condition.icon
                    : (item as ForecastDay).day.condition.icon
                  }`}
                alt={
                  isHourly
                    ? (item as HourlyForecast).condition.text
                    : (item as ForecastDay).day.condition.text
                }
                width={48}
                height={48}
                className="mx-auto"
              />
              <p>
                {isHourly
                  ? (item as HourlyForecast).temp_c
                  : (item as ForecastDay).day.avgtemp_c}
                °C
              </p>
              <p>
                Wind:{" "}
                {isHourly
                  ? (item as HourlyForecast).wind_kph
                  : (item as ForecastDay).day.maxwind_kph}{" "}
                km/h
              </p>
              <p>
                Humidity:{" "}
                {isHourly
                  ? (item as HourlyForecast).humidity
                  : (item as ForecastDay).day.avghumidity}
                %
              </p>
              <p>
                Rain:{" "}
                {isHourly
                  ? (item as HourlyForecast).chance_of_rain
                  : (item as ForecastDay).day.daily_chance_of_rain}
                %
              </p>
            </div>
          );
        })}
      </div>
    );
  };
  interface WindReading {
    windSpeed: number;
    windDir: number;
  }


  // interface WindRoseData {
  //   r: number[];
  //   theta: string[];
  //   name: string;
  //   type: string;
  //   marker: { color: string };
  // }

  const [windRoseData, setWindRoseData] = useState<Plotly.Data[]>([]);


  useEffect(() => {
    const fetchHistoricalWindData = async () => {
      try {
        // Perform two separate fetch calls concurrently for wind speed and wind direction
        const [windSpeedResponse, windDirResponse] = await Promise.all([
          fetch(
            `/api/fetchdata/sensor-data?board=${board_weatherstation}&sensor=${sensor_WindS}&calc=${aggregation}&timeframe=24`
          ),
          fetch(
            `/api/fetchdata/sensor-data?board=${board_weatherstation}&sensor=${sensor_WindD}&calc=${aggregation}&timeframe=24`
          ),
        ]);

        // Parse both responses
        const windSpeedData: SensorReading[] = await windSpeedResponse.json();
        const windDirData: SensorReading[] = await windDirResponse.json();

        // Combine the readings into a single array.
        // Here we assume that both arrays are of the same length and order.
        const historicalData: WindReading[] = windSpeedData.map((entry, index) => ({
          windSpeed: parseFloat(String(entry.Calculated_Reading)),
          windDir: parseFloat(String(windDirData[index]?.Calculated_Reading ?? "0")),
        }));

        // Define the direction labels
        const directions = ["North", "N-E", "East", "S-E", "South", "S-W", "West", "N-W"];

        // Prepare bins for different wind speed ranges
        // Define bins for all wind speed ranges
        const bins = {
          "<5": new Array(8).fill(0),
          "5-8": new Array(8).fill(0),
          "8-11": new Array(8).fill(0),
          "11-14": new Array(8).fill(0),
          "15-19": new Array(8).fill(0),
          "20-24": new Array(8).fill(0),
          "25-29": new Array(8).fill(0),
          "30-34": new Array(8).fill(0),
          "35-39": new Array(8).fill(0),
          "40-44": new Array(8).fill(0),
          "45-49": new Array(8).fill(0),
          "50-54": new Array(8).fill(0),
          "55-59": new Array(8).fill(0),
          "60-64": new Array(8).fill(0),
          "65-69": new Array(8).fill(0),
          "70-74": new Array(8).fill(0),
          "75-79": new Array(8).fill(0),
          "80-84": new Array(8).fill(0),
          "85-89": new Array(8).fill(0),
          "90-94": new Array(8).fill(0),
          "95-99": new Array(8).fill(0),
        };

        // Process each reading from your historicalData
        historicalData.forEach((entry) => {
          const speed = entry.windSpeed;
          const dir = entry.windDir;
          // Compute the direction index (assuming 8 directions; each bin is 45° wide, offset by 22.5°)
          const index = Math.floor(((dir + 22.5) % 360) / 45);
          if (speed < 5) {
            bins["<5"][index]++;
          } else if (speed < 8) {
            bins["5-8"][index]++;
          } else if (speed < 11) {
            bins["8-11"][index]++;
          } else if (speed < 14) {
            bins["11-14"][index]++;
          } else if (speed < 19) {
            bins["15-19"][index]++;
          } else if (speed < 24) {
            bins["20-24"][index]++;
          } else if (speed < 29) {
            bins["25-29"][index]++;
          } else if (speed < 34) {
            bins["30-34"][index]++;
          } else if (speed < 39) {
            bins["35-39"][index]++;
          } else if (speed < 44) {
            bins["40-44"][index]++;
          } else if (speed < 49) {
            bins["45-49"][index]++;
          } else if (speed < 54) {
            bins["50-54"][index]++;
          } else if (speed < 59) {
            bins["55-59"][index]++;
          } else if (speed < 64) {
            bins["60-64"][index]++;
          } else if (speed < 69) {
            bins["65-69"][index]++;
          } else if (speed < 74) {
            bins["70-74"][index]++;
          } else if (speed < 79) {
            bins["75-79"][index]++;
          } else if (speed < 84) {
            bins["80-84"][index]++;
          } else if (speed < 89) {
            bins["85-89"][index]++;
          } else if (speed < 94) {
            bins["90-94"][index]++;
          } else if (speed < 99) {
            bins["95-99"][index]++;
          }
        });

        // Create the data array for the wind rose chart
        const data: Plotly.Data[] = [
          {
            r: bins["<5"],
            theta: directions,
            name: "< 5 m/s",
            type: "barpolar",
            marker: { color: "rgb(242,240,247)" },
          },
          {
            r: bins["5-8"],
            theta: directions,
            name: "5-8 m/s",
            type: "barpolar",
            marker: { color: "rgb(203,201,226)" },
          },
          {
            r: bins["8-11"],
            theta: directions,
            name: "8-11 m/s",
            type: "barpolar",
            marker: { color: "rgb(158,154,200)" },
          },
          {
            r: bins["11-14"],
            theta: directions,
            name: "11-14 m/s",
            type: "barpolar",
            marker: { color: "rgb(106,81,163)" },
          },
          {
            r: bins["15-19"],
            theta: directions,
            name: "15-19 m/s",
            type: "barpolar",
            marker: { color: "rgb(255,255,190)" },
          },
          {
            r: bins["20-24"],
            theta: directions,
            name: "20-24 m/s",
            type: "barpolar",
            marker: { color: "rgb(255,255,210)" },
          },
          {
            r: bins["25-29"],
            theta: directions,
            name: "25-29 m/s",
            type: "barpolar",
            marker: { color: "rgb(255,255,230)" },
          },
          {
            r: bins["30-34"],
            theta: directions,
            name: "30-34 m/s",
            type: "barpolar",
            marker: { color: "rgb(255,240,255)" },
          },
          {
            r: bins["35-39"],
            theta: directions,
            name: "35-39 m/s",
            type: "barpolar",
            marker: { color: "rgb(255,210,255)" },
          },
          {
            r: bins["40-44"],
            theta: directions,
            name: "40-44 m/s",
            type: "barpolar",
            marker: { color: "rgb(255,180,255)" },
          },
          {
            r: bins["45-49"],
            theta: directions,
            name: "45-49 m/s",
            type: "barpolar",
            marker: { color: "rgb(255,150,255)" },
          },
          {
            r: bins["50-54"],
            theta: directions,
            name: "50-54 m/s",
            type: "barpolar",
            marker: { color: "rgb(252,120,255)" },
          },
          {
            r: bins["55-59"],
            theta: directions,
            name: "55-59 m/s",
            type: "barpolar",
            marker: { color: "rgb(231,90,255)" },
          },
          {
            r: bins["60-64"],
            theta: directions,
            name: "60-64 m/s",
            type: "barpolar",
            marker: { color: "rgb(210,60,255)" },
          },
          {
            r: bins["65-69"],
            theta: directions,
            name: "65-69 m/s",
            type: "barpolar",
            marker: { color: "rgb(189,30,255)" },
          },
          {
            r: bins["70-74"],
            theta: directions,
            name: "70-74 m/s",
            type: "barpolar",
            marker: { color: "rgb(168,0,250)" },
          },
          {
            r: bins["75-79"],
            theta: directions,
            name: "75-79 m/s",
            type: "barpolar",
            marker: { color: "rgb(147,0,225)" },
          },
          {
            r: bins["80-84"],
            theta: directions,
            name: "80-84 m/s",
            type: "barpolar",
            marker: { color: "rgb(126,0,200)" },
          },
          {
            r: bins["85-89"],
            theta: directions,
            name: "85-89 m/s",
            type: "barpolar",
            marker: { color: "rgb(105,0,175)" },
          },
          {
            r: bins["90-94"],
            theta: directions,
            name: "90-94 m/s",
            type: "barpolar",
            marker: { color: "rgb(84,0,150)" },
          },
          {
            r: bins["95-99"],
            theta: directions,
            name: "95-99 m/s",
            type: "barpolar",
            marker: { color: "rgb(63,0,125)" },
          },
        ];
        setWindRoseData(data);
      } catch (error) {
        console.error("Error fetching wind rose data:", error);
      }
    };

    fetchHistoricalWindData();
  }, []);

  const layout = {
    title: { text: "Wind Speed Distribution" },
    font: { size: 16 },
    legend: { font: { size: 10 } },
    polar: {
      bgcolor: "#f1f5f9",
      barmode: "overlay",
      bargap: 0,
      radialaxis: { ticksuffix: "%", angle: 45, dtick: 20 },
      angularaxis: { direction: "clockwise" as const },
    },
  };

  // Conversion helper functions
  //   function celsiusToFahrenheit(celsius: number): number {
  //     return (celsius * 9) / 5 + 32;
  // }
  function kphToMph(kph: number): number {
    return kph * 0.621371;
  }
  function convertWindDirection(degree: number): string {
    const reversedDegree = (degree + 180) % 360;
    const directions = [
      "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
      "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"
    ];
    const index = Math.floor((reversedDegree + 11.25) / 22.5) % 16;
    return directions[index];
  }


  // const xData = sensorData.map(d => d.time.toLocaleTimeString());
  // const yData = sensorData.map(d => d.value);

  return (
    <>
      <Head>
        <title>TerraTek</title>
        <meta name="description" content="Tank Dashboard UI" />
      </Head>

      <main className="w-full h-full flex flex-col bg-slate-500 p-2">
        <div className="flex flex-col gap-2 min-h-screen">
          <section className="bg-white rounded-lg shadow p-2 text-black flex flex-col items-center">
            <h2 className="text-center text-lg font-semibold mb-4">Current Readings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
              <div>
                {windRoseData.length > 0 ? (
                  <PlotlyComponent
                    data={windRoseData}
                    layout={layout}
                    useResizeHandler = {true}
                    style={{ width: "600px", height: "500px" }}
                  />
                ) : (
                  <p>Loading wind rose...</p>
                )}
                <strong className="text-lg">Current:</strong>
                <div className="flex items-center gap-2">
                  <Image src={"/Weather_Images/9024034_wind_fill_icon.svg"} width={30} height={30} alt="Wind Speed" />
                  <p>Wind Speed: {windSpeedData ? kphToMph(windSpeedData).toFixed(2) : "Loading..."} mph</p>
                </div>
                <div className="flex items-center gap-2">
                  <Image src={"/Weather_Images/8875188_wind_direction_arrow_icon.svg"} width={30} height={30} alt="Wind Direction" />
                  <p>Wind Direction: {windDirData ? convertWindDirection(windDirData) : "Loading..."}</p>
                </div>
              </div>
              {renderGauge(humidity, "Humidity", [0, 100], "#0f0")}
              {renderGauge(atmosphericPressure, "Pressure", [950, 1050], "#f00")}
              {renderGauge(atmosphericTemperature, "Temperature", [-10, 50], "#ff6347")}
              {renderGauge(luminescence, "Luminescence", [0, 1000], "#add8e6")}
              {renderGauge(rainfall, "Rainfall", [0, 100], "#87cefa")}
            </div>
          </section>

          <section className=" bg-slate-100 flex flex-col rounded-lg shadow p-4 text-black">
            <h2 className="text-center text-xl font-semibold mb-3">Weather Forecast</h2>
            <div className="mb-4 flex justify-start">
              <select
                className=" flex flex-col p-2 border border-gray-300 rounded-md"
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

          <section className="w-full h-full flex-grow bg-slate-100 rounded-lg shadow p-4 text-black flex flex-col">
            <h2 className="text-center text-xl font-semibold mb-3">Historical Data</h2>
            <div className="mb-4 flex justify-start">
              <select
                className="p-2 border border-gray-300 rounded-md"
                value={selectedSensor}
                onChange={(e) => setSelectedSensor(e.target.value as SensorType)}
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
              {(() => {
                // Mapping of sensor names to their historical data states
                const historicalData = {
                  "Wind Speed": windSpeedHData,
                  "Wind Direction": windDirHData,
                  "Humidity": humidityHData,
                  "Pressure": pressureHData,
                  "Temperature": tempHData,
                  "Luminescence": luminHData,
                  "Rainfall": rainfallHData,
                };

                // Get the historical data for the selected sensor, default to empty array if not available
                const selectedData = historicalData[selectedSensor] || [];

                // Process the data into a format suitable for Plotly
                const processedData = selectedData.map(item => ({
                  time: new Date(item.Interval_Timestamp), // Convert string timestamp to Date object
                  value: parseFloat(item.Calculated_Reading + ""), // Ensure reading is a number
                }));

                // Extract x (time) and y (value) data for Plotly
                const xData = processedData.map(d => d.time); // Plotly can handle Date objects
                const yData = processedData.map(d => d.value);

                // Render the Plotly component with the processed data
                return (
                  <PlotlyComponent
                    data={[
                      {
                        x: xData,
                        y: yData,
                        type: "scatter",
                        mode: "lines+markers",
                        marker: { color: "red" },
                      },
                    ]}
                    layout={{
                      autosize: true,
                      title: `${selectedSensor} - Historical Data`,
                      margin: { t: 30, r: 10, l: 40, b: 30 },
                      xaxis: { title: "Time" }, // Label for x-axis
                      yaxis: { title: selectedSensor }, // Label for y-axis
                    }}
                    useResizeHandler
                    style={{ width: "100%", height: "100%" }}
                  />
                );
              })()}
            </div>
          </section>



        </div>
      </main>
    </>
  );
};


export default Weather;

