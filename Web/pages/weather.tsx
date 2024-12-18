import type { NextPage } from "next";
import React, { useState, useEffect } from "react";

const WeatherComponent: NextPage = () => {
    const [temperature, setTemperature] = useState<string>("");
    const [humidity, setHumidity] = useState<string>("");
    const [pressure, setPressure] = useState<string>("");
    const [illuminance, setIlluminance] = useState<string>("");

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const [temperatureResponse, humidityResponse, pressureResponse, illuminanceResponse] = await Promise.all([
                    fetch("/api/latest/2"),
                    fetch("/api/latest/3"),
                    fetch("/api/latest/4"),
                    fetch("/api/latest/5")
                ]);

                const temperatureData = await temperatureResponse.json();
                const humidityData = await humidityResponse.json();
                const pressureData = await pressureResponse.json();
                const illuminanceData = await illuminanceResponse.json();

                setTemperature(temperatureData[0].Sensor_Value);
                setHumidity(humidityData[0].Sensor_Value);
                setPressure(pressureData[0].Sensor_Value);
                setIlluminance(illuminanceData[0].Sensor_Value);
            } catch (error) {
                console.error("Error fetching weather data:", error);
            }
        };

        fetchWeather();
    }, []);

    return (
        <h1>
            The temperature is {temperature}, the humidity is {humidity}, the pressure is {pressure}, the illuminance is {illuminance}
        </h1>
    );
};

const PageComponentWeather: NextPage = () => {
    return (<WeatherComponent />);
};

export default PageComponentWeather;