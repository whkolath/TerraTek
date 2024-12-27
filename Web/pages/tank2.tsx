import dynamic from 'next/dynamic';
import 'chart.js/auto';
import { ChartData } from 'chart.js';
const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
    ssr: false,
});

import { useEffect, useState } from 'react';


const LineChart = () => {


    const [temperatureDataset, setTemperatureDataset] = useState<ChartData<'line'> | null>(null);
    const [humidityDataset, setHumidityDataset] = useState<ChartData<'line'> | null>(null);
    const [pressureDataset, setPressureDataset] = useState<ChartData<'line'> | null>(null);
    const [illuminanceDataset, setIlluminanceDataset] = useState<ChartData<'line'> | null>(null);

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

                const temperatureLabels = temperatureData.map((data: { Sensor_Timestamp: string }) => new Date(data.Sensor_Timestamp).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    timeZone: "America/Chicago"
                })
                );

                setTemperatureDataset({
                    labels: temperatureLabels,
                    datasets: [
                        {
                            label: 'Temperature',
                            data: temperatureData.map((data: { Sensor_Value: number }) => (data.Sensor_Value * 9 / 5) + 32),
                            fill: false,
                            borderColor: 'rgb(255, 0, 0)',
                            tension: 0.1,
                        },
                    ],
                });
                


                const humidityLabels = humidityData.map((data: { Sensor_Timestamp: string }) => new Date(data.Sensor_Timestamp).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    timeZone: "America/Chicago"
                }));

                setHumidityDataset({
                    labels: humidityLabels,
                    datasets: [
                        {
                            label: 'Humidity',
                            data: humidityData.map((data: { Sensor_Value: number }) => data.Sensor_Value),
                            fill: false,
                            borderColor: 'rgb(11, 173, 35)',
                            tension: 0.1,
                        },
                    ],
                });


                const pressureLabels = pressureData.map((data: { Sensor_Timestamp: string }) => new Date(data.Sensor_Timestamp).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    timeZone: "America/Chicago"
                }));

                setPressureDataset({
                    labels: pressureLabels,
                    datasets: [
                        {
                            label: 'Pressure',
                            data: pressureData.map((data: { Sensor_Value: number }) => data.Sensor_Value),
                            fill: false,
                            borderColor: 'rgb(0, 0, 255)',
                            tension: 0.1,
                        },
                    ],
                });


                const illuminanceLabels = illuminanceData.map((data: { Sensor_Timestamp: string }) => new Date(data.Sensor_Timestamp).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    timeZone: "America/Chicago"
                }));

                setIlluminanceDataset({
                    labels: illuminanceLabels,
                    datasets: [
                        {
                            label: 'Illuminance',
                            data: illuminanceData.map((data: { Sensor_Value: number }) => data.Sensor_Value),
                            fill: false,
                            borderColor: 'rgb(255, 140, 0)',
                            tension: 0.1,
                        },
                    ],
                });
            } catch (error) {
                console.error("Error fetching weather data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="w-full grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 p-4 box-border">
            <div className="lg:col-span-4 md:col-span-2 col-span-1 p-6 bg-white border border-gray-300 shadow-md rounded-lg">

                <div className="flex flex-wrap justify-between">
                    <div className="p-6">
                        <div className="flex justify-center">
                            <h2 className="text-lg">Tank Level</h2>
                        </div>
                        {temperatureDataset && <Line data={temperatureDataset} options={{ scales: { y: { title: { display: true, text: '°F' } } }, plugins: { legend: { display: false } } }} />}
                        <p>Current Value: {temperatureDataset && typeof temperatureDataset.datasets[0].data.slice(-1)[0] === 'number' && (Math.round((temperatureDataset.datasets[0].data.slice(-1)[0] as number) * 100) / 100).toString()}°F</p>
                        <p className="text-xs">Last reading: {temperatureDataset && temperatureDataset.labels && temperatureDataset.labels.slice(-1)[0] as string}</p>
                    </div>
                    <div className="p-6">
                        <div className="flex justify-center">
                            <h2 className="text-lg">Water Temperature</h2>
                        </div>
                        {humidityDataset && <Line data={humidityDataset} options={{ scales: { y: { title: { display: true, text: '%' } } }, plugins: { legend: { display: false } } }} />}
                        <p>Current Value: {humidityDataset && typeof humidityDataset.datasets[0].data.slice(-1)[0] === 'number' && (Math.round((humidityDataset.datasets[0].data.slice(-1)[0] as number) * 100) / 100).toString()}%</p>
                        <p className="text-xs">Last reading: {humidityDataset && humidityDataset.labels && humidityDataset.labels.slice(-1)[0] as string}</p>
                    </div>
                    <div className="p-6">
                        <div className="flex justify-center">
                            <h2 className="text-lg">PH</h2>
                        </div>
                        {pressureDataset && <Line data={pressureDataset} options={{ scales: { y: { title: { display: true, text: 'kPa' } } }, plugins: { legend: { display: false } } }} />}
                        <p>Current Value: {pressureDataset && typeof pressureDataset.datasets[0].data.slice(-1)[0] === 'number' && (Math.round((pressureDataset.datasets[0].data.slice(-1)[0] as number) * 100) / 100).toString()} kPa</p>
                        <p className="text-xs">Last reading: {pressureDataset && pressureDataset.labels && pressureDataset.labels.slice(-1)[0] as string}</p>
                    </div>
                    <div className="p-6">
                        <div className="flex justify-center">

                            <h2 className="text-lg">TDC</h2>
                        </div>
                        {illuminanceDataset && <Line data={illuminanceDataset} options={{ scales: { y: { title: { display: true, text: 'lux' } } }, plugins: { legend: { display: false } } }} />}
                        <p>Current Value: {illuminanceDataset && typeof illuminanceDataset.datasets[0].data.slice(-1)[0] === 'number' && (Math.round((illuminanceDataset.datasets[0].data.slice(-1)[0] as number) * 100) / 100).toString()} lux</p>
                        <p className="text-xs">Last reading: {illuminanceDataset && illuminanceDataset.labels && illuminanceDataset.labels.slice(-1)[0] as string}</p>
                    </div>
                </div>
                </div>
            </div>
            );
}

            export default LineChart;