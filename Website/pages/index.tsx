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
        0: "/Weather_Images/sun_icon.svg",
        1: "/Weather_Images/partly_cloudy_icon.svg",
        2: "/Weather_Images/partly_cloudy_icon.svg",
        3: "/Weather_Images/partly_cloud_icon.svg",
        45: "/Weather_Images/fog_sun_weather_icon.svg",
        48: "/Weather_Images/fog_sun_weather_icon.svg",
        51: "/Weather_Images/drizzle_rain_icon.svg",
        53: "/Weather_Images/cloud_rain_icon.svg",
        55: "/Weather_Images/heavy_rain_icon.svg",
        61: "/Weather_Images/drizzle_rain_icon.svg",
        63: "/Weather_Images/cloud_rain_icon.svg",
        65: "/Weather_Images/heavy_rain_icon.svg",
        71: "/Weather_Images/snowflake_icon.svg",
        73: "/Weather_Images/snowflake_icon.svg",
        75: "/Weather_Images/snowflake_icon.svg",
        80: "/Weather_Images/drizzle_rain_icon.svg",
        81: "/Weather_Images/cloud_rain_icon.svg",
        82: "/Weather_Images/heavy_rain_icon.svg",
        95: "/Weather_Images/thunderstorm_icon.svg",
        96: "/Weather_Images/thunderstorm_icon.svg",
        99: "/Weather_Images/thunderstorm_icon.svg",
    };

    const getWeatherImage = (code: number | undefined): string => {
        const codeNumber = Number(code); // Ensure it's a number
        return codeNumber in weatherImages ? weatherImages[codeNumber] : "/Weather_Images/error_icon.svg";
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
    const [waterLevel2Data, setWaterLevel2Data] = useState<number | null>(null);
    const [waterLevel3Data, setWaterLevel3Data] = useState<number | null>(null);
    const [greyLevelData, setGreyWaterLevelData] = useState<number | null>(null);
    const [TempData, setTempData] = useState<number | null>(null);
    const [WSData, setWSData] = useState<number | null>(null);
    const [WDData, setWDData] = useState<number | null>(null);
    // const [HumdityData, setHumdityData] = useState<number | null>(null);
    const [PressureData, setPressureData] = useState<number | null>(null);
    const [RainData, setRainData] = useState<number | null>(null);

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

    const [freshWater1Data, setFreshWater1Data] = useState<SensorReading[] | null>(null);
    const [freshWater2Data, setFreshWater2Data] = useState<SensorReading[] | null>(null);
    const [freshWater3Data, setFreshWater3Data] = useState<SensorReading[] | null>(null);
    const [greyWaterData, setGreyWaterData] = useState<SensorReading[] | null>(null);

    const board_weatherstation = "0xa8610a34362d800f";
    const board_freshwater1 = "0xa8610a3436268316";
    const board_freshwater2 = "0xa8610a33382d9411";
    const board_freshwater3 = "0xa8610a3339188011";
    const board_greywater = "0xa8610a343235910e";

    const sensor_WaterLevel = "10"; // Replace with actual sensor ID
    const sensor_Temp = "1"
    const sensor_WindS = "6"
    const sensor_WindD = "7"
    const sensor_Humidity = "3"
    const sensor_Pressure = "4"
    const sensor_Rain = "8"

    const aggregation = "AVG"; // AVG, MIN, MAX, MEDIAN, SUM
    const interval = "Hourly"; // Options: "All", "Hourly", "Daily"
    const units = 1;

    useEffect(() => {
        const fetchAllWaterData = async () => {
            try {
                const [
                    freshWater1Response,
                    freshWater2Response,
                    freshWater3Response,
                    greyWaterResponse,
                ] = await Promise.all([
                    fetch(`/api/fetchdata/sensor-data?board=${board_freshwater1}&sensor=${sensor_WaterLevel}&calc=${aggregation}&timeinterval=${interval}&unit_conversion=${units}`),
                    fetch(`/api/fetchdata/sensor-data?board=${board_freshwater2}&sensor=${sensor_WaterLevel}&calc=${aggregation}&timeinterval=${interval}&unit_conversion=${units}`),
                    fetch(`/api/fetchdata/sensor-data?board=${board_freshwater3}&sensor=${sensor_WaterLevel}&calc=${aggregation}&timeinterval=${interval}&unit_conversion=${units}`),
                    fetch(`/api/fetchdata/sensor-data?board=${board_greywater}&sensor=${sensor_WaterLevel}&calc=${aggregation}&timeinterval=${interval}&unit_conversion=${units}`),
                ]);

                if (!freshWater1Response.ok || !freshWater2Response.ok || !freshWater3Response.ok || !greyWaterResponse.ok) {
                    throw new Error("Failed to fetch one or more water data sets.");
                }

                const [
                    freshWater1Data,
                    freshWater2Data,
                    freshWater3Data,
                    greyWaterData,
                ] = await Promise.all([
                    freshWater1Response.json(),
                    freshWater2Response.json(),
                    freshWater3Response.json(),
                    greyWaterResponse.json(),
                ]);

                setFreshWater1Data(freshWater1Data);
                setFreshWater2Data(freshWater2Data);
                setFreshWater3Data(freshWater3Data);
                setGreyWaterData(greyWaterData);
            } catch (error) {
                console.error("Error fetching water data:", error);
            }
        };

        fetchAllWaterData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const [tempReading, speedReading, directionReading, humidityReading, pressureReading, rainReading, freshWater1Reading, freshWater2Reading, freshWater3Reading, greyWaterReading] = await Promise.all([

                fetch(`/api/fetchdata/sensor-data?board=${board_weatherstation}&sensor=${sensor_Temp}&calc=${aggregation}&timeframe=1&unit_conversion=${units}`),  // Temp
                fetch(`/api/fetchdata/sensor-data?board=${board_weatherstation}&sensor=${sensor_WindS}&calc=${aggregation}&timeframe=1&unit_conversion=${units}`),  // Wind Speed
                fetch(`/api/fetchdata/sensor-data?board=${board_weatherstation}&sensor=${sensor_WindD}&calc=${aggregation}&timeframe=1&unit_conversion=${units}`),  // Wind Direction
                fetch(`/api/fetchdata/sensor-data?board=${board_weatherstation}&sensor=${sensor_Humidity}&calc=${aggregation}&timeframe=1&unit_conversion=${units}`),  // Humidity
                fetch(`/api/fetchdata/sensor-data?board=${board_weatherstation}&sensor=${sensor_Pressure}&calc=${aggregation}&timeframe=1&unit_conversion=${units}`), // Pressure
                fetch(`/api/fetchdata/sensor-data?board=${board_weatherstation}&sensor=${sensor_Rain}&calc=SUM&start=${time.start}&end=${time.end}&timeinterval=Daily&unit_conversion=${units}`), // Pressure

                fetch(`/api/fetchdata/sensor-data?board=${board_freshwater1}&sensor=10&calc=AVG&timeinterval=Daily`), // Water Level1
                fetch(`/api/fetchdata/sensor-data?board=${board_freshwater2}&sensor=10&calc=AVG&timeinterval=Daily`), // Water Level 2
                fetch(`/api/fetchdata/sensor-data?board=${board_freshwater3}&sensor=10&calc=AVG&timeinterval=Daily`), // Water Level 3
                fetch(`/api/fetchdata/sensor-data?board=${board_greywater}&sensor=10&calc=AVG&timeinterval=Daily`), // Water Level 3
            ]);

            // Parse the JSON from each response
            const temp = await tempReading.json();
            const speed = await speedReading.json();
            const direction = await directionReading.json();
            const humidity = await humidityReading.json();
            const pressure = await pressureReading.json();
            const rain = await rainReading.json();

            const freshWater1 = await freshWater1Reading.json();
            const freshWater2 = await freshWater2Reading.json();
            const freshWater3 = await freshWater3Reading.json();
            const greyWater = await greyWaterReading.json();


            setTempData(temp?.length > 0 ? parseFloat(temp[0].Calculated_Reading) : null);
            setWSData(speed?.length > 0 ? parseFloat(speed[0].Calculated_Reading) : null);
            setWDData(direction?.length > 0 ? parseFloat(direction[0].Calculated_Reading) : null);
            console.log(humidity)
            setPressureData(pressure?.length > 0 ? parseFloat(pressure[0].Calculated_Reading) : null);

            setRainData(rain?.length > 0 ? rain.reduce((acc: number, curr: { Calculated_Reading: string }) => acc + parseFloat(curr.Calculated_Reading), 0) : null);

            setWaterLevelData(freshWater1?.length > 0 ? parseFloat(freshWater1[0].Calculated_Reading) : null);
            setWaterLevel2Data(freshWater2?.length > 0 ? parseFloat(freshWater2[0].Calculated_Reading) : null);
            setWaterLevel3Data(freshWater3?.length > 0 ? parseFloat(freshWater3[0].Calculated_Reading) : null);
            setGreyWaterLevelData(greyWater?.length > 0 ? parseFloat(greyWater[0].Calculated_Reading) : null);
        };

        fetchData();
    }, [time.end, time.start]);


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





    function convertWindDirection(degree: number): string {
        const directions = [
            "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
            "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"
        ];
        const index = Math.floor((degree + 11.25) / 22.5) % 16;
        return directions[index];
    }

    const waterLevel1 = Math.round(waterLevelData ?? 0);
    const waterLevel2 = Math.round(waterLevel2Data ?? 0);
    const waterLevel3 = Math.round(waterLevel3Data ?? 0);
    const greyWaterLevel = Math.min(greyLevelData ?? 0);

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

    function renderFreshWater1ScatterPlot() {
        if (!freshWater1Data) return <div>Loading sensor data...</div>;
        if (freshWater1Data.length === 0) return <div>No Fresh Water data available.</div>;

        const xValues = freshWater1Data.map((reading) =>
            new Date(reading.Interval_Timestamp).toLocaleString("en-US", { timeZone: "America/Chicago" })
        ); // Updated field
        const yValues = freshWater1Data.map((reading) => reading.Calculated_Reading); // Updated field

        return (
            <PlotlyComponent
                data={[
                    {
                        type: "scatter",
                        fill: 'tozeroy',
                        mode: "lines+markers", // Use lines for better trend visualization
                        x: xValues,
                        y: yValues,
                        marker: { color: "blue" },
                        line: { shape: "spline" }, // Smooth the line
                    },
                ]}
                layout={{
                    autosize: true,
                    margin: { t: 20, r: 40, l: 40, b: 150 },
                    xaxis: { title: "Timestamp", tickformat: '%m/%d %I:%M %p',tickangle: -60 }, // Format x-axis as date
                    yaxis: { title: "Fresh Water Level (AVG)" },
                    paper_bgcolor: '#f1f5f9',
                    plot_bgcolor: '#f1f5f9',
                }}
                config={{ displayModeBar: false, responsive: true }}
                useResizeHandler
                style={{ width: "100%", height: "300px" }} // Increased height for better visibility
            />
        );
    }

    function renderFreshWater2ScatterPlot() {
        if (!freshWater2Data) return <div>Loading sensor data...</div>;
        if (freshWater2Data.length === 0) return <div>No Fresh Water data available.</div>;

        const xValues = freshWater2Data.map((reading) =>
            new Date(reading.Interval_Timestamp).toLocaleString("en-US", { timeZone: "America/Chicago" })
        ); // Updated field
        const yValues = freshWater2Data.map((reading) => reading.Calculated_Reading); // Updated field

        return (
            <PlotlyComponent
                data={[
                    {
                        type: "scatter",
                        fill: 'tozeroy',
                        mode: "lines+markers", // Use lines for better trend visualization
                        x: xValues,
                        y: yValues,
                        marker: { color: "blue" },
                        line: { shape: "spline" }, // Smooth the line
                    },
                ]}
                layout={{
                    autosize: true,
                    margin: { t: 20, r: 40, l: 40, b: 150 },
                    xaxis: { title: "Timestamp", tickformat: '%m/%d %I:%M %p',tickangle: -60 }, // Format x-axis as date
                    yaxis: { title: "Fresh Water Level (AVG)" },
                    paper_bgcolor: '#f1f5f9',
                    plot_bgcolor: '#f1f5f9',
                }}
                config={{ displayModeBar: false, responsive: true }}
                useResizeHandler
                style={{ width: "100%", height: "300px" }} // Increased height for better visibility
            />
        );
    }

    function renderFreshWater3ScatterPlot() {
        if (!freshWater3Data) return <div>Loading sensor data...</div>;
        if (freshWater3Data.length === 0) return <div>No Fresh Water data available.</div>;

        const xValues = freshWater3Data.map((reading) =>
            new Date(reading.Interval_Timestamp).toLocaleString("en-US", { timeZone: "America/Chicago" })
        ); // Updated field
        const yValues = freshWater3Data.map((reading) => reading.Calculated_Reading); // Updated field

        return (
            <PlotlyComponent
                data={[
                    {
                        type: "scatter",
                        fill: 'tozeroy',
                        mode: "lines+markers", // Use lines for better trend visualization
                        x: xValues,
                        y: yValues,
                        marker: { color: "blue" },
                        line: { shape: "spline" }, // Smooth the line
                    },
                ]}
                layout={{
                    autosize: true,
                    margin: { t: 20, r: 40, l: 40, b: 150 },
                    xaxis: { title: "Timestamp", tickformat: '%m/%d %I:%M %p',tickangle: -60 }, // Format x-axis as date
                    yaxis: { title: "Fresh Water Level (AVG)" },
                    paper_bgcolor: '#f1f5f9',
                    plot_bgcolor: '#f1f5f9',
                }}
                config={{ displayModeBar: false, responsive: true }}
                useResizeHandler
                style={{ width: "100%", height: "300px" }} // Increased height for better visibility
            />
        );
    }

    function renderGreyWaterScatterPlot() {
        if (!greyWaterData) return <div>Loading sensor data...</div>;
        if (greyWaterData.length === 0) return <div>No Fresh Water data available.</div>;

        const xValues = greyWaterData.map((reading) =>
            new Date(reading.Interval_Timestamp).toLocaleString("en-US", { timeZone: "America/Chicago" })
        ); // Updated field
        const yValues = greyWaterData.map((reading) => reading.Calculated_Reading); // Updated field

        return (
            <PlotlyComponent
                data={[
                    {
                        type: "scatter",
                        fill: 'tozeroy',
                        mode: "lines+markers", // Use lines for better trend visualization
                        x: xValues,
                        y: yValues,
                        marker: { color: "blue" },
                        line: { shape: "spline" }, // Smooth the line
                    },
                ]}
                layout={{
                    autosize: true,
                    margin: { t: 20, r: 40, l: 40, b: 150 },
                    xaxis: { title: "Timestamp", tickformat: '%m/%d %I:%M %p',tickangle: -60 }, // Format x-axis as date
                    yaxis: { title: "Fresh Water Level (AVG)" },
                    paper_bgcolor: '#f1f5f9',
                    plot_bgcolor: '#f1f5f9',
                }}
                config={{ displayModeBar: false, responsive: true }}
                useResizeHandler
                style={{ width: "100%", height: "300px" }} // Increased height for better visibility
            />
        );
    }

    function calculateGallons(){
        return greyWaterLevel/100 * 3750 + waterLevel1/100 * 3750 + waterLevel2/100 * 1250 + waterLevel3/100 * 1250;
    }


    return (
        <div className="w-full min-h-[calc(100vh-50px)] md:h-[calc(100vh-50px)] flex flex-col md:flex-row overflow-hidden">
            {/* Main Sensor Grid */}
            <div className="flex-grow p-2 grid grid-cols-1 md:grid-cols-2 gap-2 overflow-scroll">

                {/* Fresh Water 1 Section */}
                <div className="bg-slate-100 shadow-lg rounded-lg p-4 flex flex-col items-center">
                    <h2 className="text-center text-xl font-semibold font-mono">Fresh Water 1</h2>
                    {renderLiquidGauge(waterLevel1, "blue")}

                    <div className="w-full mt-4">
                        <h3 className="text-md font-semibold font-mono">Fresh Water 1 Scatter Plot</h3>
                        <div className="bg-slate-300 shadow-md rounded-md p-3">
                            {renderFreshWater1ScatterPlot()}
                        </div>
                    </div>
                </div>

                {/* Grey Water Section */}
                <div className="bg-slate-100 shadow-lg rounded-lg p-4 flex flex-col items-center">
                    <h2 className="text-center text-xl font-semibold font-mono">Grey Water</h2>
                    {renderLiquidGauge(greyWaterLevel, "grey")}

                    <div className="w-full mt-4">
                        <h3 className="text-md font-semibold font-mono">Grey Water Scatter Plot</h3>
                        <div className="bg-slate-300 shadow-md rounded-md p-3">
                            {renderGreyWaterScatterPlot()}
                        </div>
                    </div>
                </div>

                {/* Fresh Water 2 Section */}
                <div className="bg-slate-100 shadow-lg rounded-lg p-4 flex flex-col items-center">
                    <h2 className="text-center text-xl font-semibold font-mono">Fresh Water 2</h2>
                    {renderLiquidGauge(waterLevel2, "blue")}

                    <div className="w-full mt-4">
                        <h3 className="text-md font-semibold font-mono">Fresh Water 2 Scatter Plot</h3>
                        <div className="bg-slate-300 shadow-md rounded-md p-3">
                            {renderFreshWater2ScatterPlot()}
                        </div>
                    </div>
                </div>

                {/* Fresh Water 3 Section */}
                <div className="bg-slate-100 shadow-lg rounded-lg p-4 flex flex-col items-center">
                    <h2 className="text-center text-xl font-semibold font-mono">Fresh Water 3</h2>
                    {renderLiquidGauge(waterLevel3, "blue")}

                    <div className="w-full mt-4">
                        <h3 className="text-md font-semibold font-mono">Fresh Water 3 Scatter Plot</h3>
                        <div className="bg-slate-300 shadow-md rounded-md p-3">
                            {renderFreshWater3ScatterPlot()}
                        </div>
                    </div>
                </div>

            </div>

            {/* Weather Plug-in Section */}
            <div className="w-full md:w-1/6 h-fit flex items-center justify-center">
                <div className="w-full max-w-md min-h-[calc(100vh-50px)] md:h-[calc(100vh-50px)] bg-slate-100 shadow-lg p-4 md:rounded-none rounded-sm flex-grow flex-col overflow-y-auto">
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
                                        <Image src={"/Weather_Images/sunrise_icon.svg"} width={30} height={30} alt="Sunrise" />
                                        <p>Sunrise: {formatTimeToNazareth(weather.sunrise)}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Image src={"/Weather_Images/sunset_icon.svg"} width={30} height={30} alt="Sunset" />
                                        <p>Sunset: {formatTimeToNazareth(weather.sunset)}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Image src={"/Weather_Images/rain_water_cloud_icon.svg"} width={30} height={30} alt="Precipitation" />
                                        <p>Precipitation: {weather.precipitation_probability_max}%</p>
                                    </div>
                                </div>

                                {/* Current Weather */}
                                <div className="flex flex-col items-center">
                                    <strong className="text-lg">Current conditions using on-site sensors:</strong>

                                    <div className="flex items-center gap-2">
                                        <Image src={"/Weather_Images/temperature_icon.svg"} width={25} height={25} alt="Temperature" />
                                        <p>Temperature: {TempData ? TempData.toFixed(2) : "Loading..."} °F</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Image src={"/Weather_Images/wind_fill_icon.svg"} width={30} height={30} alt="Wind Speed" />
                                        <p>Wind Speed: {WSData ? WSData.toFixed(2) : "Loading..."} mph</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Image src={"/Weather_Images/wind_arrow_icon.svg"} width={30} height={30} alt="Wind Direction" />
                                        <p>Wind Direction: {WDData ? convertWindDirection(WDData) : "Loading..."}</p>
                                    </div>


                                    <div className="flex items-center gap-2">
                                        <Image src={"/Weather_Images/gauge_pressure_icon.svg"} width={30} height={30} alt="Pressure" />
                                        <p>Pressure: {PressureData ? PressureData.toFixed(2) : "Loading..."} inHg</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Image src={"/Weather_Images/rain_water_cloud_icon.svg"} width={30} height={30} alt="Rain" />
                                        <p>Total rainfall past 30 days: {RainData ? RainData.toFixed(2) : "Loading..."} in</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {/* <Image src={"/Weather_Images/rain_water_cloud_icon.svg"} width={30} height={30} alt="Rain" /> */}
                                        <p>Total water in system (approximate): {calculateGallons().toFixed(2)} gallons</p>
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
