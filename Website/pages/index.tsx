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
        3: "/Weather_Images/198562_partly_cloudy_sun_icon.svg",
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
        return code !== undefined && code in weatherImages ? weatherImages[code] : "/Weather_Images/110805_sun_icon.svg";
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
    const [waterLevelData, setWaterLevelData] = useState<SensorReading[] | null>(null);
    const [TempData, setTempData] = useState<SensorReading[] | null>(null);
    const [WSData, setWSData] = useState<SensorReading[] | null>(null);
    const [WDData, setWDData] = useState<SensorReading[] | null>(null);
    const [HumdityData, setHumdityData] = useState<SensorReading[] | null>(null);
    const [PressureData, setPressureData] = useState<SensorReading[] | null>(null);

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

    const board = "0xa8610a3436268316";
    const sensor = "10"; // Replace with actual sensor ID
    const aggregation = "AVG"; // AVG, MIN, MAX, MEDIAN, SUM
    const interval = "hourly"; // Options: "halfhour", "hourly", "daily"

    useEffect(() => {
        const fetchFreshWaterData = async () => {
            try {
                const response = await fetch(
                    `/api/fetchdata/sensor-data?board=${board}&sensor=${sensor}&calc=${aggregation}&start=${time.start.toISOString()}&end=${time.end.toISOString()}&timeinterval=${interval}`
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
        Promise.all([
            fetch("/api/latest/10"), // Water Level
            fetch("/api/latest/1"),  // Temp
            fetch("/api/latest/6"),  // Wind Speed
            fetch("/api/latest/7"),  // Wind Direction
            fetch("/api/latest/3"),  // Humidity
            fetch("/api/latest/4"),  // Pressure
        ])
            .then((responses) => Promise.all(responses.map((r) => r.json())))
            .then(([data2, data3, data4, data5, data6, data7]) => {
                console.log("Fetched sensor data:", { data2, data3, data4, data5, data6, data7 });

                data2.reverse();
                data3.reverse();
                data4.reverse();
                data5.reverse();
                data6.reverse();
                data7.reverse();

                setWaterLevelData(data2);
                setTempData(data3);
                setWSData(data4);
                setWDData(data5);
                setHumdityData(data6);
                setPressureData(data7);
            })
            .catch((err) => console.error("Error fetching sensor data:", err));
    }, []);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await fetch(
                    "https://api.open-meteo.com/v1/forecast?latitude=34.5442&longitude=-102.1027&daily=weathercode,sunrise,sunset,precipitation_probability_max&current_weather=true&timezone=America%2FChicago"
                );
                const data = await response.json();
                console.log("Fetched weather data:", data);
                const daily = data.daily;
                if (daily) {
                    const weatherCode = daily.weathercode
                        ? daily.weathercode[0]
                        : daily.weather_code
                            ? daily.weather_code[0]
                            : undefined;
                    setWeather({
                        weathercode: weatherCode,
                        sunrise: daily.sunrise[0],
                        sunset: daily.sunset[0],
                        precipitation_probability_max: daily.precipitation_probability_max[0],
                    });
                } else if (data.current_weather) {
                    setWeather({
                        weathercode: data.current_weather.weathercode,
                        sunrise: "N/A",
                        sunset: "N/A",
                        precipitation_probability_max: 0,
                    });
                } else {
                    console.error("No daily weather data available:", data);
                }
            } catch (error) {
                console.error("Error fetching weather data:", error);
            }
        };
        fetchWeather();
    }, []);
    

    function latestValue(data: SensorReading[] | null): number {
        if (!data || data.length === 0) return 0;
        return data[data.length - 1].Sensor_Value;
    }

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

    const waterLevel = Math.round(latestValue(waterLevelData));
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
                width={200}
                height={200}
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
                useResizeHandler
                style={{ width: "100%", height: "300px" }} // Increased height for better visibility
            />
        );
    }

    function renderGreyWaterScatterPlot() {
        if (!waterLevelData) return <div>Loading sensor data...</div>;
        if (waterLevelData.length === 0) return <div>No Grey Water data available.</div>;
        const xValues = waterLevelData.map((reading) => reading.Sensor_Timestamp);
        const yValues = waterLevelData.map((reading) => Math.min(reading.Sensor_Value + 10, 100));
        return (
            <PlotlyComponent
                data={[
                    {
                        type: "scatter",
                        mode: "markers",
                        x: xValues,
                        y: yValues,
                        marker: { color: "grey" },
                    },
                ]}
                layout={{
                    autosize: true,
                    margin: { t: 20, r: 20, l: 40, b: 40 },
                    xaxis: { title: "Timestamp" },
                    yaxis: { title: "Grey Water Level" },
                    paper_bgcolor: '#f1f5f9',
                    plot_bgcolor: '#f1f5f9',
                }}
                useResizeHandler
                style={{ width: "100%", height: "200px" }}
            />
        );
    }

    return (
        <div className="w-full min-h-[calc(100vh-50px)] lg:h-[calc(100vh-50px)] flex flex-col md:flex-row overflow-hidden">
            {/* Main Sensor Grid */}
            <div className="flex-grow p-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* Fresh Water Section */}
                <div className="bg-slate-100 shadow-sm rounded-md p-4 flex flex-col items-center">
                    <h2 className="text-center text-xl font-semibold font-mono">Fresh Water</h2>
                    {renderLiquidGauge(waterLevel, "blue")}
                    <div className="w-full mt-4">
                        <h3 className="text-md font-semibold font-mono">Fresh Water Scatter Plot</h3>
                        <div className="bg-slate-300 shadow-sm rounded-md p-2">
                            {renderFreshWaterScatterPlot()}
                        </div>
                    </div>
                </div>

                {/* Grey Water Section */}
                <div className="bg-slate-100 shadow-sm rounded-md p-4 flex flex-col items-center">
                    <h2 className="text-center text-xl font-semibold font-mono">Grey Water</h2>
                    {renderLiquidGauge(predictedWaterLevel, "grey")}
                    <div className="w-full mt-4">
                        <h3 className="text-md font-semibold font-mono">Grey Water Scatter Plot</h3>
                        <div className="bg-slate-300 shadow-sm rounded-md p-2">
                            {renderGreyWaterScatterPlot()}
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <div className="col-span-1 md:col-span-2 bg-slate-100 shadow-sm rounded-md p-2">
                    <h2 className="text-xl font-semibold font-mono">About</h2>
                    <p className="mt-2 text-gray-600">
                        Description about the system and its functionalities.
                    </p>
                </div>

                {/* Purpose Section */}
                <div className="col-span-1 md:col-span-2 bg-slate-100 shadow-sm rounded-md p-2">
                    <h2 className="text-xl font-semibold font-mono">Purpose</h2>
                    <p className="mt-2 text-gray-600">
                        Explanation of the purpose and objectives of the system.
                    </p>
                </div>
            </div>

            {/* Weather Plug-in Section */}
            <div className="w-full md:w-1/6 md:h-screen p-2 bg-slate-100 shadow-sm rounded-none flex flex-col">
                <h2 className="text-center text-xl font-semibold font-mono">Weather</h2>
                <div className="w-full h-full mt-4 bg-gray-300 p-2 flex flex-col items-center justify-evenly text-center">
                    {weather ? (
                        <div>
                            <div>
                                <strong>Daily:</strong>
                                <Image
                                src={getWeatherImage(weather.weathercode)}
                                width={40} // Adjust as needed
                                height={40} // Adjust as needed
                                className="object-contain mb-4"
                                alt="Weather Condition"
                                />
                                <p className="text-xl font-semibold">{getWeatherDescription(weather.weathercode)}</p>
                                <p>Sunrise: {formatTimeToNazareth(weather.sunrise)}</p>
                                <p>Sunset: {formatTimeToNazareth(weather.sunset)}</p>
                                <p>Precipitation: {weather.precipitation_probability_max}%</p>
                            </div>
                            <div>
                                <strong>Current:</strong>
                                <p>
                                    Temperature:{" "}
                                    {TempData
                                        ? celsiusToFahrenheit(latestValue(TempData)).toFixed(2)
                                        : "Loading..."} °F
                                </p>
                                <p>
                                    Wind Speed:{" "}
                                    {WSData
                                        ? kphToMph(latestValue(WSData)).toFixed(2)
                                        : "Loading..."} mph
                                </p>
                                <p>
                                    Wind Direction:{" "}
                                    {WDData
                                        ? convertWindDirection(latestValue(WDData))
                                        : "Loading..."}
                                </p>
                                <p>
                                    Humidity:{" "}
                                    {HumdityData
                                        ? latestValue(HumdityData).toFixed(2)
                                        : "Loading..."}
                                </p>
                                <p>
                                    Pressure:{" "}
                                    {PressureData
                                        ? latestValue(PressureData).toFixed(2)
                                        : "Loading..."}
                                </p>
                            </div>
                        </div>
                    ) : (
                        "Loading weather..."
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
