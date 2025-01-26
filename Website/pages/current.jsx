"use client";
import dynamic from 'next/dynamic';
import 'chart.js/auto';
const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
    ssr: false,
});

import { useEffect, useState } from 'react';

const LineChart = () => {
    const [temperature, setTemperature] = useState(null);
    const [humidity, setHumidity] = useState(null);
    const [pressure, setPressure] = useState(null);
    const [illuminance, setIlluminance] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
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

                temperatureData.reverse();
                humidityData.reverse();
                pressureData.reverse();
                illuminanceData.reverse();


                setTemperature(temperatureData[0].Sensor_Value.toString());
                setHumidity(humidityData[0].Sensor_Value.toString());
                setPressure(pressureData[0].Sensor_Value.toString());
                setIlluminance(illuminanceData[0].Sensor_Value.toString());

            } catch (error) {
                console.error("Error fetching weather data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>
                The temperature is {temperature}, the humidity is {humidity}, the pressure is {pressure}, the illuminance is {illuminance}
            </h1>
        </div>
    );
};
export default LineChart;
