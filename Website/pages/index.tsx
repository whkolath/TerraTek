import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import LiquidFillGauge from "react-liquid-gauge";
import { color } from "d3-color";
import { interpolateRgb } from "d3-interpolate";
import Image from "next/image";

export const PlotlyComponent = dynamic(() => import("react-plotly.js"), { ssr: false });

const Dashboard = () => {
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


    type Weather = {
        weathercode: number | undefined;
        sunrise: string;
        sunset: string;
        precipitation_probability_max: number;
    };

    const weatherImages: { [key: number]: string } = {
        0: "/Weather_Images/110805_sun_icon.svg",
        1: "/Weather_Images/9044965_partly_cloudy_icon.svg",
        2: "/Weather_Images/9044965_partly_cloudy_icon.svg",
        3: "/Weather_Images/198562_partly cloud_sun_sunny_grey_clody_icon.svg",
        45: "/Weather_Images/390496_cloud_fog_sun_icon.svg",
        48: "/Weather_Images/390496_cloud_fog_sun_icon.svg",
        51: "/Weather_Images/5719164_cloud_drizzle_rain_icon.svg",
        53: "/Weather_Images/5719156_cloud_rain_icon.svg",
        55: "/Weather_Images/5719160_cloud_heavy_rain_icon.svg",
        61: "/Weather_Images/5719164_cloud_drizzle_rain_icon.svg",
        63: "/Weather_Images/5719156_cloud_rain_icon.svg",
        65: "/Weather_Images/5719160_cloud_heavy_rain_icon.svg",
        71: "/Weather_Images/8520293_snowflake_icon.svg",
        73: "/Weather_Images/8520293_snowflake_icon.svg",
        75: "/Weather_Images/8520293_snowflake_icon.svg",
        80: "/Weather_Images/5719164_cloud_drizzle_rain_icon.svg",
        81: "/Weather_Images/5719156_cloud_rain_icon.svg",
        82: "/Weather_Images/5719160_cloud_heavy_rain_icon.svg",
        95: "/Weather_Images/9045272_thunderstorm_icon.svg",
        96: "/Weather_Images/9045272_thunderstorm_icon.svg",
        99: "/Weather_Images/9045272_thunderstorm_icon.svg",
    };

    const getWeatherImage = (code: number | undefined): string => {
        const codeNumber = Number(code); // Ensure it's a number
        return codeNumber in weatherImages ? weatherImages[codeNumber] : "/Weather_Images/2849810_cross_multimedia_error_delite_icon.svg";
    };


    const weatherDescriptions: { [key: number]: string } = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Drizzle: Light intensity",
        53: "Drizzle: Moderate intensity",
        55: "Drizzle: Dense intensity",
        56: "Freezing Drizzle: Light intensity",
        57: "Freezing Drizzle: Dense intensity",
        61: "Rain: Slight intensity",
        63: "Rain: Moderate intensity",
        65: "Rain: Heavy intensity",
        66: "Freezing Rain: Light intensity",
        67: "Freezing Rain: Heavy intensity",
        71: "Snow fall: Slight intensity",
        73: "Snow fall: Moderate intensity",
        75: "Snow fall: Heavy intensity",
        77: "Snow grains",
        80: "Rain showers: Slight",
        81: "Rain showers: Moderate",
        82: "Rain showers: Violent",
        85: "Snow showers: Slight",
        86: "Snow showers: Heavy",
        95: "Thunderstorm: Slight or moderate",
        96: "Thunderstorm with slight hail",
        99: "Thunderstorm with heavy hail"
    };

    const getWeatherDescription = (code: number | undefined): string => {
        return code !== undefined && weatherDescriptions[code] ? weatherDescriptions[code] : "Unknown";
    };

    const [weather, setWeather] = useState<Weather | null>(null);
    const [waterLevelData, setWaterLevelData] = useState<number | null>(null);
    const [TempData, setTempData] = useState<number | null>(null);
    const [WSData, setWSData] = useState<number | null>(null);
    const [WDData, setWDData] = useState<number | null>(null);
    const [HumdityData, setHumdityData] = useState<number | null>(null);
    const [PressureData, setPressureData] = useState<number | null>(null);

    // Helper: Format a time string to Nazareth, TX local time ("America/Chicago")
    function formatTimeToNazareth(timeString: string): string {
        const date = new Date(timeString);
        return date.toLocaleTimeString("en-US", {
            timeZone: "America/Chicago",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    const [time] = useState<DateRange>({
        start: new Date(new Date().setMonth(new Date().getMonth() - 1)), // One month ago
        end: new Date(), // Current date
    });

    const [freshWaterData, setFreshWaterData] = useState<SensorReading[] | null>(null);
    const [greyWaterData, setGreyWaterData] = useState<SensorReading[] | null>(null);
    //    const board_greywater = ""
    const board_weatherstation = "0xa8610a34362d800f";
    const board_freshwater = "0xa8610a3436268316";
    const board_greywater = "0xa8610a3436268316";
    const sensor_WaterLevel = "10"; // Replace with actual sensor ID
    const sensor_Temp = "1"
    const sensor_WindS = "6"
    const sensor_WindD = "7"
    const sensor_Humidity = "3"
    const sensor_Pressure = "4"
    const aggregation = "AVG"; // AVG, MIN, MAX, MEDIAN, SUM
    const interval = "hourly"; // Options: "halfhour", "hourly", "daily"

    useEffect(() => {
        const fetchFreshWaterData = async () => {
            try {
                const response = await fetch(
                    `/api/fetchdata/sensor-data?board=${board_freshwater}&sensor=${sensor_WaterLevel}&calc=${aggregation}&start=${time.start.toISOString()}&end=${time.end.toISOString()}&timeinterval=${interval}`
                );

                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.statusText}`);
                }

                const data: SensorReading[] = await response.json();
                setFreshWaterData(data);
            } catch (error) {
                console.error("Error fetching fresh water data:", error);
            }
        };

        fetchFreshWaterData();
    }, [time]);

    useEffect(() => {
        const fetchGreyWaterData = async () => {
            try {
                const response = await fetch(
                    `/api/fetchdata/sensor-data?board=${board_greywater}&sensor=${sensor_WaterLevel}&calc=${aggregation}&start=${time.start.toISOString()}&end=${time.end.toISOString()}&timeinterval=${interval}`
                );

                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.statusText}`);
                }

                const data: SensorReading[] = await response.json();
                setGreyWaterData(data);
            } catch (error) {
                console.error("Error fetching fresh water data:", error);
            }
        };

        fetchGreyWaterData();
    }, [time]);

    useEffect(() => {
        const fetchData = async () => {
            const [reading2, reading3, reading4, reading5, reading6, reading7] = await Promise.all([
                    fetch(`/api/fetchdata/sensor-data?board=${board_freshwater}&sensor=${sensor_WaterLevel}&calc=${aggregation}&timeframe=1`), // Water Level
                    fetch(`/api/fetchdata/sensor-data?board=${board_weatherstation}&sensor=${sensor_Temp}&calc=${aggregation}&timeframe=1`),  // Temp
                    fetch(`/api/fetchdata/sensor-data?board=${board_weatherstation}&sensor=${sensor_WindS}&calc=${aggregation}&timeframe=1`),  // Wind Speed
                    fetch(`/api/fetchdata/sensor-data?board=${board_weatherstation}&sensor=${sensor_WindD}&calc=${aggregation}&timeframe=1`),  // Wind Direction
                    fetch(`/api/fetchdata/sensor-data?board=${board_weatherstation}&sensor=${sensor_Humidity}&calc=${aggregation}&timeframe=1`),  // Humidity
                    fetch(`/api/fetchdata/sensor-data?board=${board_freshwater}&sensor=${sensor_Pressure}&calc=${aggregation}&timeframe=1`), //Pressure
                ]);

            // Parse the JSON

            const data2 = await reading2.json();
            const data3 = await reading3.json();
            const data4 = await reading4.json();
            const data5 = await reading5.json();
            const data6 = await reading6.json();
            const data7 = await reading7.json();

            console.log(data7);            
            console.log(data7 ? data2[0].Calculated_Reading : null);

            setWaterLevelData(data2 ? data2[0].Calculated_Reading : null);
            setTempData(data3 ? data3[0].Calculated_Reading : null);
            setWSData(data4 ? data4[0].Calculated_Reading : null);
            setWDData(data5 ? data5[0].Calculated_Reading : null);
            setHumdityData(data6 ? data6[0].Calculated_Reading : null);
            setPressureData(data7?.length > 0 ? parseFloat(data7[0].Calculated_Reading) : null);
              
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=34.5442&longitude=-102.1027&daily=weathercode,sunrise,sunset,precipitation_probability_max&current_weather=true&timezone=America%2FChicago");
                const data = await response.json();
                console.log("Fetched weather data:", data); // Debugging
                if (data.daily) {
                    setWeather({
                        weathercode: data.daily.weathercode?.[0] ?? data.current_weather?.weathercode,
                        sunrise: data.daily.sunrise?.[0] ?? "N/A",
                        sunset: data.daily.sunset?.[0] ?? "N/A",
                        precipitation_probability_max: data.daily.precipitation_probability_max?.[0] ?? 0,
                    });
                }
            } catch (error) {
                console.error("Error fetching weather data:", error);
            }
        };
        fetchWeather();
    }, []);



    

    // Conversion helper functions
    function celsiusToFahrenheit(celsius: number): number {
        return (celsius * 9) / 5 + 32;
    }
    function kphToMph(kph: number): number {
        return kph * 0.621371;
    }
    // Reverse wind direction by adding 180° before converting to cardinal direction.
    function convertWindDirection(degree: number): string {
        const reversedDegree = (degree + 180) % 360;
        const directions = [
            "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
            "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"
        ];
        const index = Math.floor((reversedDegree + 11.25) / 22.5) % 16;
        return directions[index];
    }

    const waterLevel = Math.round(waterLevelData ?? 0);
    const predictedWaterLevel = Math.min(waterLevel + 10, 100);

    // Liquid gauge color logic
    const startColor = "#6495ed";
    const endColor = "#dc143c";
    const interpolate = interpolateRgb(startColor, endColor);

    function renderLiquidGauge(value: number, forcedColor?: string) {
        const fillColor = forcedColor ? forcedColor : interpolate(value / 100);
        const gradientStops = [
            {
                key: "0%",
                stopColor: color(fillColor)?.darker(0.5).toString(),
                stopOpacity: 1,
                offset: "0%",
            },
            {
                key: "50%",
                stopColor: fillColor,
                stopOpacity: 0.75,
                offset: "50%",
            },
            {
                key: "100%",
                stopColor: color(fillColor)?.brighter(0.5).toString(),
                stopOpacity: 0.5,
                offset: "100%",
            },
        ];

        return (
            <LiquidFillGauge
                style={{ margin: "0 auto" }}
                width={300}
                height={300}
                value={value}
                percent="%"
                textSize={1}
                textOffsetX={0}
                textOffsetY={0}
                riseAnimation
                waveAnimation
                waveFrequency={2}
                waveAmplitude={1}
                gradient
                gradientStops={gradientStops}
                circleStyle={{
                    fill: fillColor,
                }}
                waveStyle={{
                    fill: fillColor,
                }}
                textStyle={{
                    fill: color("#444")?.toString(),
                    fontFamily: "Arial",
                }}
                waveTextStyle={{
                    fill: color("#fff")?.toString(),
                    fontFamily: "Arial",
                }}
            />
        );
    }

    function renderFreshWaterScatterPlot() {
        if (!freshWaterData) return <div>Loading sensor data...</div>;
        if (freshWaterData.length === 0) return <div>No Fresh Water data available.</div>;

        const xValues = freshWaterData.map((reading) => reading.Interval_Timestamp); // Updated field
        const yValues = freshWaterData.map((reading) => reading.Calculated_Reading); // Updated field

        return (
            <PlotlyComponent
                data={[
                    {
                        type: "scatter",
                        mode: "lines+markers", // Use lines for better trend visualization
                        x: xValues,
                        y: yValues,
                        marker: { color: "blue" },
                        line: { shape: "spline" }, // Smooth the line
                    },
                ]}
                layout={{
                    autosize: true,
                    margin: { t: 20, r: 20, l: 40, b: 40 },
                    xaxis: { title: "Timestamp", type: "date" }, // Format x-axis as date
                    yaxis: { title: "Fresh Water Level (AVG)" },
                    paper_bgcolor: '#f1f5f9',
                    plot_bgcolor: '#f1f5f9',
                }}
                config={{ displayModeBar: false, responsive: true }}
                useResizeHandler
                style={{ width: "100%", height: "700px" }} // Increased height for better visibility
            />
        );
    }

    function renderGreyWaterScatterPlot() {
        if (!greyWaterData) return <div>Loading sensor data...</div>;
        if (greyWaterData.length === 0) return <div>No Fresh Water data available.</div>;

        const xValues = greyWaterData.map((reading) => reading.Interval_Timestamp); // Updated field
        const yValues = greyWaterData.map((reading) => reading.Calculated_Reading); // Updated field

        return (
            <PlotlyComponent
                data={[
                    {
                        type: "scatter",
                        mode: "lines+markers", // Use lines for better trend visualization
                        x: xValues,
                        y: yValues,
                        marker: { color: "blue" },
                        line: { shape: "spline" }, // Smooth the line
                    },
                ]}
                layout={{
                    autosize: true,
                    margin: { t: 20, r: 20, l: 40, b: 40 },
                    xaxis: { title: "Timestamp", type: "date" }, // Format x-axis as date
                    yaxis: { title: "Fresh Water Level (AVG)" },
                    paper_bgcolor: '#f1f5f9',
                    plot_bgcolor: '#f1f5f9',
                }}
                config={{ displayModeBar: false, responsive: true }}
                useResizeHandler
                style={{ width: "100%", height: "700px" }} // Increased height for better visibility
            />
        );
    }


    return (
        <div className="w-full min-h-screen flex flex-col md:flex-row overflow-hidden">
          {/* Main Sensor Grid */}
          <div className="flex-grow p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Fresh Water Section */}
            <div className="bg-slate-100 shadow-lg rounded-lg p-4 flex flex-col items-center">
              <h2 className="text-center text-xl font-semibold font-mono">Fresh Water</h2>
              {renderLiquidGauge(waterLevel, "blue")}
              
              <div className="w-full mt-4">
                <h3 className="text-md font-semibold font-mono">Fresh Water Scatter Plot</h3>
                <div className="bg-slate-300 shadow-md rounded-md p-3">
                  {renderFreshWaterScatterPlot()}
                </div>
              </div>
            </div>
      
            {/* Grey Water Section */}
            <div className="bg-slate-100 shadow-lg rounded-lg p-4 flex flex-col items-center">
              <h2 className="text-center text-xl font-semibold font-mono">Grey Water</h2>
              {renderLiquidGauge(predictedWaterLevel, "grey")}
              
              <div className="w-full mt-4">
                <h3 className="text-md font-semibold font-mono">Grey Water Scatter Plot</h3>
                <div className="bg-slate-300 shadow-md rounded-md p-3">
                  {renderGreyWaterScatterPlot()}
                </div>
              </div>
            </div>
      
          </div>
      
          {/* Weather Plug-in Section */}
<div className="w-full md:w-1/6 h-full flex items-center justify-center">
  <div className="w-full max-w-md bg-slate-100 shadow-lg p-6 rounded-lg flex flex-col overflow-y-auto">
    <h2 className="text-center text-xl font-semibold font-mono">Weather</h2>

    <div className="w-full h-screen mt-4 bg-gray-300 p-4 rounded-lg shadow-md flex flex-col items-center text-center justify-center flew-grow">
      {weather ? (
        <div className="flex flex-col flew-grow items-center space-y-4">
          
          {/* Daily Weather */}
          <div className="flex flex-col items-center">
            <strong className="text-lg">Daily:</strong>
            <Image
              src={getWeatherImage(weather.weathercode)}
              width={50}
              height={50}
              className="mb-2"
              alt="Weather Condition"
            />
            <p>{getWeatherDescription(weather.weathercode)}</p>

            <div className="flex items-center gap-2">
              <Image src={"/Weather_Images/9040596_sunrise_icon.svg"} width={30} height={30} alt="Sunrise" />
              <p>Sunrise: {formatTimeToNazareth(weather.sunrise)}</p>
            </div>

            <div className="flex items-center gap-2">
              <Image src={"/Weather_Images/8666700_sunset_icon.svg"} width={30} height={30} alt="Sunset" />
              <p>Sunset: {formatTimeToNazareth(weather.sunset)}</p>
            </div>

            <div className="flex items-center gap-2">
              <Image src={"/Weather_Images/727683_rain_water_cloud_drop_forecast_icon.svg"} width={30} height={30} alt="Precipitation" />
              <p>Precipitation: {weather.precipitation_probability_max}%</p>
            </div>
          </div>

          {/* Current Weather */}
          <div className="flex flex-col items-center">
            <strong className="text-lg">Current:</strong>

            <div className="flex items-center gap-2">
              <Image src={"/Weather_Images/8665892_temperature_half_icon.svg"} width={25} height={25} alt="Temperature" />
              <p>Temperature: {TempData ? celsiusToFahrenheit(TempData).toFixed(2) : "Loading..."} °F</p>
            </div>

            <div className="flex items-center gap-2">
              <Image src={"/Weather_Images/9024034_wind_fill_icon.svg"} width={30} height={30} alt="Wind Speed" />
              <p>Wind Speed: {WSData ? kphToMph(WSData).toFixed(2) : "Loading..."} mph</p>
            </div>

            <div className="flex items-center gap-2">
              <Image src={"/Weather_Images/8875188_wind_direction_arrow_icon.svg"} width={30} height={30} alt="Wind Direction" />
              <p>Wind Direction: {WDData ? convertWindDirection(WDData) : "Loading..."}</p>
            </div>

            <div className="flex items-center gap-2">
              <Image src={"/Weather_Images/9132537_humidity_air conditining_ac_conditioner_split ac_icon.svg"} width={30} height={30} alt="Humidity" />
              <p>Humidity: {HumdityData ? HumdityData.toFixed(2) : "Loading..."}</p>
            </div>

            <div className="flex items-center gap-2">
              <Image src={"/Weather_Images/809411_gauge_indication_indicator_miscellaneous_pressure_icon.svg"} width={30} height={30} alt="Pressure" />
              <p>Pressure: {PressureData ? PressureData.toFixed(2) : "Loading..."}</p>
            </div>
          </div>
        </div>
      ) : (
        "Loading weather..."
      )}
    </div>
  </div>
</div>

          </div>
      );
      
};

export default Dashboard;
