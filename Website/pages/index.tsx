import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";

export const PlotlyComponent = dynamic(() => import("react-plotly.js"), { ssr: false });

const Dashboard = () => {

    type Weather = {
        temperature: number;
        windspeed: number;
        weathercode: number;
    };

    const [weather, setWeather] = useState<null | Weather>(null);

    useEffect(() => {
        // const fetchData = async () => {
        //     try {
        //         const [response, sensorResponse, boardResponse] = await Promise.all([
        //             fetch("/api/latest/0x0A"),
        //             fetch(`/api/boards`),
        //         ]);

        //         const textResponse = await response.text();
        //         const textSensors = await sensorResponse.text();
        //         const textBoards = await boardResponse.text();

        //         let data, sensorsData, boardsData;

        //         try {
        //             data = JSON.parse(textResponse);
        //             sensorsData = JSON.parse(textSensors);
        //             boardsData = JSON.parse(textBoards);
        //         } catch (error) {
        //             console.error("Invalid JSON received:", { textResponse, textSensors, textBoards });
        //             return;
        //         }

        //         setSensorList({
        //             Sensor_ID: sensorsData.map((s: { Sensor_ID: number }) => s.Sensor_ID),
        //             Sensor_Description: sensorsData.map((s: { Sensor_Description: string }) => s.Sensor_Description),
        //             Units: sensorsData.map((s: { Units: string; Sensor_ID: number }) => (unitType && s.Sensor_ID == 2 ? "°F" : s.Units)),
        //         });

        //         setBoardList({
        //             Board_ID: boardsData.map((b: { Board_ID: string }) => b.Board_ID),
        //             Board_Description: boardsData.map((b: { Board_Description: string }) => b.Board_Description),
        //         });

        //         setDataset({
        //             dates: data.map((d: { Hourly_Timestamp: string }) => new Date(d.Hourly_Timestamp)),
        //             values: data.map((d: { Average_Reading: number }) => (unitType && sensor == "2" ? d.Average_Reading * 9 / 5 + 32 : d.Average_Reading)),
        //             days: data.map((d: { Hourly_Timestamp: string }) =>
        //                 new Date(d.Hourly_Timestamp).toLocaleDateString("en-US", { dateStyle: "short", timeZone: "America/Chicago" })
        //             ),
        //             hours: data.map((d: { Hourly_Timestamp: string }) =>
        //                 new Date(d.Hourly_Timestamp).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", timeZone: "America/Chicago" })
        //             ),
        //         });
        //     } catch (error) {
        //         console.error("Error fetching data:", error);
        //     }
        // };
        


        const fetchWeather = async () => {
            try {
                const response = await fetch(
                    "https://api.open-meteo.com/v1/forecast?latitude=34.5442&longitude=-102.1027&current_weather=true"
                    //https://api.open-meteo.com/v1/forecast?latitude=34.5442&longitude=-102.1027&hourly=temperature_2m,dew_point_2m,rain,wind_speed_180m,wind_direction_180m,wind_gusts_10m&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&wind_speed_unit=ms&timezone=America%2FChicago
                );
                 const text = await response.text();

            //     try {
                     const data = JSON.parse(text);
                     setWeather(data.current_weather);
            //     } catch (error) {
            //         console.error("Invalid weather JSON:", text);
            //     }
             } catch (error) {
                 console.error("Error fetching weather data:", error);
            }
        };

        //fetchData();
        fetchWeather();
    }, //[time, sensor, unitType]
);

    return (
        <div className="w-full h-screen flex">
            {/* Main Content */}
            <div className="flex-grow p-6 grid grid-cols-2 gap-3">
                {/* Fresh Water Section */}
                <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center w-full h-full">
                    <h2 className="text-lg font-bold">Fresh Water</h2>
                    <div className="w-6 h-6 bg-blue-300 rounded-full mt-4"></div>
                    <div className="mt-2">Level Percentage</div>
                    <Image src="/tank_UI.svg" alt="Tank" width={250} height={250} />
                    <div className="w-full h-[400px] bg-slate-100 shadow-sm rounded-md flex flex-col items-center">
                        <PlotlyComponent
                            data={[
                                {
                                    //x: dataset.dates,
                                    //y: dataset.values,
                                    type: "scatter",
                                    mode: "lines+markers",
                                    marker: { color: "blue" },
                                    name: "Fresh Water Level"
                                }
                            ]}
                            layout={{
                                title: "Daily Water Level",
                                autosize: true,
                                margin: { t: 40, l: 50, r: 20, b: 40 }
                            }}
                            useResizeHandler={true}
                            className="w-full h-full"
                        />
                    </div>
                </div>

                {/* Grey Water Section */}
                <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center w-full h-full">
                    <h2 className="text-lg font-bold">Grey Water</h2>
                    <div className="w-6 h-6 bg-gray-400 rounded-full mt-4"></div>
                    <div className="mt-2">Level Percentage</div>
                    <Image src="/tank_UI.svg" alt="Tank" width={250} height={250} />
                    <div className="w-full h-[400px] bg-slate-300 shadow-sm rounded-md flex flex-col items-center">
                        <PlotlyComponent
                            data={[
                                {
                                    //x: dataset.dates,
                                    //y: dataset.values,
                                    type: "scatter",
                                    mode: "lines+markers",
                                    marker: { color: "gray" },
                                    name: "Grey Water Level"
                                }
                            ]}
                            layout={{
                                title: "Daily Water Level",
                                autosize: true,
                                margin: { t: 40, l: 50, r: 20, b: 40 }
                            }}
                            useResizeHandler={true}
                            className="w-full h-full"
                        />
                    </div>
                </div>

                {/* About Section */}
                <div className="col-span-2 bg-white shadow-lg rounded-lg p-4">
                    <h2 className="text-lg font-bold">About</h2>
                    <p className="mt-2 text-gray-600">Description about the system and its functionalities.</p>
                </div>

                {/* Purpose Section */}
                <div className="col-span-2 bg-white shadow-lg rounded-lg p-4">
                    <h2 className="text-lg font-bold">Purpose</h2>
                    <p className="mt-2 text-gray-600">Explanation of the purpose and objectives of the system.</p>
                </div>
            </div>

            {/* Weather Plugin */}
            <div className="w-1/6 h-screen p-4 bg-slate-100 shadow-sm rounded-md flex flex-col">
                <h2 className="text-lg font-bold">Weather Plug-in</h2>
                <div className="w-full h-full mt-4 bg-gray-300 flex items-center justify-center text-center p-2">
                    {weather ? (
                        <div>
                            <p>Temperature: {weather.temperature}°C</p>
                            <p>Wind Speed: {weather.windspeed} km/h</p>
                            <p>Condition: {weather.weathercode}</p>
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
