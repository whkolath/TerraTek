import dynamic from "next/dynamic";
// import Image from "next/image";
import {  useEffect, useState } from "react";
// import { ReactNode} from "react";
// import LiquidFillGauge from "react-liquid-gauge";
// import { color } from "d3-color";
// import { interpolateRgb } from "d3-interpolate";

export const PlotlyComponent = dynamic(() => import("react-plotly.js"), { ssr: false });

const Dashboard = () => {
    interface SensorReading {
        Sensor_Timestamp: string;
        Sensor_Value: number;
    }

    type Weather = {
        weathercode: number | undefined;
        sunrise: string;
        sunset: string;
        precipitation_probability_max: number;
    };

    const [weather, setWeather] = useState<Weather | null>(null);
    const [waterLevelData, setWaterLevelData] = useState<SensorReading[] | null>(null);
    const [TempData, setTempData] = useState<SensorReading[] | null>(null);
    const [WSData, setWSData] = useState<SensorReading[] | null>(null);
    const [WDData, setWDData] = useState<SensorReading[] | null>(null);
    const [HumdityData, setHumdityData] = useState<SensorReading[] | null>(null);
    const [PressureData, setPressureData] = useState<SensorReading[] | null>(null);

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
                // Log the fetched data for debugging
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
                    "https://api.open-meteo.com/v1/forecast?latitude=34.5442&longitude=-102.1027&daily=weathercode,sunrise,sunset,precipitation_probability_max&current_weather=true"
                );
                const data = await response.json();
                console.log("Fetched weather data:", data);
                const daily = data.daily;
                if (daily) {
                    // Check for both possible property names
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
                    // Fallback if daily data is not provided
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

    const waterLevel = Math.round(latestValue(waterLevelData));
    const predictedWaterLevel = Math.min(waterLevel + 10, 100);

    // // Liquid gauge color logic
    // const startColor = "#6495ed";
    // const endColor = "#dc143c";
    // const interpolate = interpolateRgb(startColor, endColor);

    //   function renderLiquidGauge(value: number, forcedColor?: string) {
    //     const fillColor = forcedColor ? forcedColor : interpolate(value / 100);
    //     const gradientStops = [
    //       {
    //         key: "0%",
    //         stopColor: color(fillColor)?.darker(0.5).toString(),
    //         stopOpacity: 1,
    //         offset: "0%",
    //       },
    //       {
    //         key: "50%",
    //         stopColor: fillColor,
    //         stopOpacity: 0.75,
    //         offset: "50%",
    //       },
    //       {
    //         key: "100%",
    //         stopColor: color(fillColor)?.brighter(0.5).toString(),
    //         stopOpacity: 0.5,
    //         offset: "100%",
    //       },
    //     ];

    //     return (
    //       <LiquidFillGauge
    //         style={{ margin: "0 auto" }}
    //         width={200}
    //         height={200}
    //         value={value}
    //         percent="%"
    //         textSize={1}
    //         textOffsetX={0}
    //         textOffsetY={0}
    //         riseAnimation
    //         waveAnimation
    //         waveFrequency={2}
    //         waveAmplitude={1}
    //         gradient
    //         gradientStops={gradientStops}
    //         circleStyle={{
    //           fill: fillColor,
    //         }}
    //         waveStyle={{
    //           fill: fillColor,
    //         }}
    //         textStyle={{
    //           fill: color("#444")?.toString(),
    //           fontFamily: "Arial",
    //         }}
    //         waveTextStyle={{
    //           fill: color("#fff")?.toString(),
    //           fontFamily: "Arial",
    //         }}
    //       />
    //     );
    //   }


    // // Fresh Water scatter plot using raw sensor data
    // function renderFreshWaterScatterPlot() {
    //     if (!waterLevelData) return <div>Loading sensor data...</div>;
    //     if (waterLevelData.length === 0) return <div>No Fresh Water data available.</div>;
    //     const xValues = waterLevelData.map((reading) => reading.Sensor_Timestamp);
    //     const yValues = waterLevelData.map((reading) => reading.Sensor_Value);
    //     return (
    //         <PlotlyComponent
    //             data={[
    //                 {
    //                     type: "scatter",
    //                     mode: "markers",
    //                     x: xValues,
    //                     y: yValues,
    //                     marker: { color: "blue" },
    //                 },
    //             ]}
    //             layout={{
    //                 autosize: true,
    //                 margin: { t: 20, r: 20, l: 40, b: 40 },
    //                 xaxis: { title: "Timestamp" },
    //                 yaxis: { title: "Fresh Water Level" },
    //             }}
    //             useResizeHandler
    //             style={{ width: "100%", height: "200px" }}
    //         />
    //     );
    // }

    // Grey Water scatter plot applying a +10 transformation (capped at 100)
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
                }}
                useResizeHandler
                style={{ width: "100%", height: "200px" }}
            />
        );
    }

    return (
        <div className="w-full h-full flex">
            <div className="flex-grow p-6 grid grid-cols-2 gap-3">
                {/* Fresh Water Section */}
                <div className="bg-slate-100 shadow-lg rounded-lg p-4 flex flex-col items-center w-full h-full">
                    <h2 className="text-lg font-bold">Fresh Water</h2>
                    {/* {renderLiquidGauge(waterLevel)} */}
                    <div className="w-full mt-4">
                        <h3 className="text-md font-bold mb-2">Fresh Water Scatter Plot</h3>
                        <div className="bg-slate-300 shadow-sm rounded-md p-4">
                            {/* {renderFreshWaterScatterPlot()} */}
                        </div>
                    </div>
                </div>

                {/* Grey Water Section */}
                <div className="bg-slate-100 shadow-lg rounded-lg p-4 flex flex-col items-center w-full h-full">
                    <h2 className="text-lg font-bold">Grey Water</h2>
                    {/* {renderLiquidGauge(predictedWaterLevel)} */}
                    <div className="w-full mt-4 h-[400px]">
                        <h3 className="text-md font-bold mb-2">Grey Water Scatter Plot</h3>
                        <div className="bg-slate-300 shadow-sm rounded-md p-4">
                            {renderGreyWaterScatterPlot()}
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <div className="col-span-2 bg-slate-100 shadow-lg rounded-lg p-4">
                    <h2 className="text-lg font-bold">About</h2>
                    <p className="mt-2 text-gray-600">
                        Description about the system and its functionalities.
                    </p>
                </div>

                {/* Purpose Section */}
                <div className="col-span-2 bg-slate-100 shadow-lg rounded-lg p-4">
                    <h2 className="text-lg font-bold">Purpose</h2>
                    <p className="mt-2 text-gray-600">
                        Explanation of the purpose and objectives of the system.
                    </p>
                </div>
            </div>

            {/* Weather Plug-in */}
            <div className="w-1/6 h-screen p-4 bg-slate-100 shadow-sm rounded-md flex flex-col">
                <h2 className="text-lg font-bold">Weather Plug-in</h2>
                <div className="w-full h-full mt-4 bg-gray-300 p-4 flex flex-col items-center justify-center text-center">
                    {weather ? (
                        <div>
                            <p>Weather Condition: {weather.weathercode}</p>
                            <p>Sunrise: {weather.sunrise}</p>
                            <p>Sunset: {weather.sunset}</p>
                            <p>Precipitation: {weather.precipitation_probability_max}</p>
                            <p>Temperature: {TempData ? latestValue(TempData) : "Loading..."}</p>
                            <p>Wind Speed: {WSData ? latestValue(WSData) : "Loading..."}</p>
                            <p>Wind Direction: {WDData ? latestValue(WDData) : "Loading..."}</p>
                            <p>Humidity: {HumdityData ? latestValue(HumdityData) : "Loading..."}</p>
                            <p>Pressure: {PressureData ? latestValue(PressureData) : "Loading..."}</p>
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