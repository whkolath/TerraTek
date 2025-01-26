import React from "react";
import dynamic from 'next/dynamic';
import 'chart.js/auto';
import { ChartData } from 'chart.js';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";


const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
    ssr: false,
});

import { useEffect, useState } from 'react';


const LineChart = () => {


    const [temperatureDataset, setTemperatureDataset] = useState<ChartData<'line'> | null>(null);
    const [longTemperatureDataset, setLongTemperatureDataset] = useState<ChartData<'line'> | null>(null);
    const [humidityDataset, setHumidityDataset] = useState<ChartData<'line'> | null>(null);
    const [pressureDataset, setPressureDataset] = useState<ChartData<'line'> | null>(null);
    const [illuminanceDataset, setIlluminanceDataset] = useState<ChartData<'line'> | null>(null);

    interface Sensor {
        Sensor_ID: number;
        Sensor_Description: string;
    }

    const [sensorData, setSensorData] = useState<Sensor[]>([]);

    const [value, setValue] = useState("24");
    const [sensor, setSensor] = useState("2");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [temperatureResponse, longTemperatureResponse, humidityResponse, pressureResponse, illuminanceResponse, sensorResponse] = await Promise.all([
                    fetch("/api/hourly/24/2"),
                    fetch(`/api/hourly/${value}/${sensor}`),
                    fetch("/api/hourly/24/3"),
                    fetch("/api/hourly/24/4"),
                    fetch("/api/hourly/24/5"),
                    fetch("/api/sensors")
                ]);

                const temperatureData = await temperatureResponse.json();
                const longTemperatureData = await longTemperatureResponse.json();
                const humidityData = await humidityResponse.json();
                const pressureData = await pressureResponse.json();
                const illuminanceData = await illuminanceResponse.json();
                const sensors = await sensorResponse.json();

                temperatureData.reverse();
                longTemperatureData.reverse();
                humidityData.reverse();
                pressureData.reverse();
                illuminanceData.reverse();

                setSensorData(sensors);

                const temperatureLabels = temperatureData.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp).toLocaleTimeString("en-US", {
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
                            data: temperatureData.map((data: { Average_Reading: number }) => {
                                if (data.Average_Reading != null)
                                {
                                    return data.Average_Reading * 9 / 5 + 32;
                                }
                                else
                                    return null;
                            }),
                            fill: false,
                            borderColor: 'rgb(255, 0, 0)',
                            tension: 0.1,
                        },
                    ],
                });
                const longTemperatureLabels = longTemperatureData.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp).toLocaleString("en-US", {
                    dateStyle: "short",
                    timeStyle: "short",
                    timeZone: "America/Chicago"
                }));

                setLongTemperatureDataset({
                    labels: longTemperatureLabels,
                    datasets: [
                        {
                            label: 'Value',
                            data: longTemperatureData.map((data: { Average_Reading: number }) => data.Average_Reading),
                            fill: false,
                            borderColor: 'rgb(230, 0, 255)',
                            tension: 0.1,
                        },
                    ],
                });

                const humidityLabels = humidityData.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    timeZone: "America/Chicago"
                }));

                setHumidityDataset({
                    labels: humidityLabels,
                    datasets: [
                        {
                            label: 'Humidity',
                            data: humidityData.map((data: { Average_Reading: number }) => data.Average_Reading),
                            fill: false,
                            borderColor: 'rgb(11, 173, 35)',
                            tension: 0.1,
                        },
                    ],
                });


                const pressureLabels = pressureData.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    timeZone: "America/Chicago"
                }));

                setPressureDataset({
                    labels: pressureLabels,
                    datasets: [
                        {
                            label: 'Pressure',
                            data: pressureData.map((data: { Average_Reading: number }) => data.Average_Reading),
                            fill: false,
                            borderColor: 'rgb(0, 0, 255)',
                            tension: 0.1,
                        },
                    ],
                });


                const illuminanceLabels = illuminanceData.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    timeZone: "America/Chicago"
                }));

                setIlluminanceDataset({
                    labels: illuminanceLabels,
                    datasets: [
                        {
                            label: 'Illuminance',
                            data: illuminanceData.map((data: { Average_Reading: number }) => data.Average_Reading),
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
    }, [value, sensor]);
    
    function downloadChart() {
        const canvas = document.querySelector('#Chart canvas');
        if (canvas) {
            (canvas as HTMLCanvasElement).toBlob((blob: Blob | null) => {
                if (blob) {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = 'Chart.png';
                    link.click();
                }
            });
        }
    }

    return (
        <div className="w-full grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 p-4 box-border">
            <div className="p-6 bg-white border border-gray-300 shadow-md rounded-lg">
                <h2 className="text-lg font-bold">Temperature</h2>

                {temperatureDataset && <Line data={temperatureDataset} options={{ scales: { y: { title: { display: true, text: '°F' } } }, plugins: { legend: { display: false } } }} />}
                <p>Current Value: {temperatureDataset && typeof temperatureDataset.datasets[0].data.slice(-1)[0] === 'number' && (Math.round((temperatureDataset.datasets[0].data.slice(-1)[0] as number) * 100) / 100).toString()}°F</p>
                <p className="text-xs">Last reading: {temperatureDataset && temperatureDataset.labels && temperatureDataset.labels.slice(-1)[0] as string}</p>

            </div>
            <div className="p-6 bg-white border border-gray-300 shadow-md rounded-lg">
                <h2 className="text-lg font-bold">Humidity</h2>
                {humidityDataset && <Line data={humidityDataset} options={{ scales: { y: { title: { display: true, text: '%' } } }, plugins: { legend: { display: false } } }} />}
                <p>Current Value: {humidityDataset && typeof humidityDataset.datasets[0].data.slice(-1)[0] === 'number' && (Math.round((humidityDataset.datasets[0].data.slice(-1)[0] as number) * 100) / 100).toString()}%</p>
                <p className="text-xs">Last reading: {humidityDataset && humidityDataset.labels && humidityDataset.labels.slice(-1)[0] as string}</p>
            </div>
            <div className="p-6 bg-white border border-gray-300 shadow-md rounded-lg">
                <h2 className="text-lg font-bold">Pressure</h2>
                {pressureDataset && <Line data={pressureDataset} options={{ scales: { y: { title: { display: true, text: 'kPa' } } }, plugins: { legend: { display: false } } }} />}
                <p>Current Value: {pressureDataset && typeof pressureDataset.datasets[0].data.slice(-1)[0] === 'number' && (Math.round((pressureDataset.datasets[0].data.slice(-1)[0] as number) * 100) / 100).toString()} kPa</p>
                <p className="text-xs">Last reading: {pressureDataset && pressureDataset.labels && pressureDataset.labels.slice(-1)[0] as string}</p>
            </div>
            <div className="p-6 bg-white border border-gray-300 shadow-md rounded-lg">
                <h2 className="text-lg font-bold">Illuminance</h2>
                {illuminanceDataset && <Line data={illuminanceDataset} options={{ scales: { y: { title: { display: true, text: 'lux' } } }, plugins: { legend: { display: false } } }} />}
                <p>Current Value: {illuminanceDataset && typeof illuminanceDataset.datasets[0].data.slice(-1)[0] === 'number' && (Math.round((illuminanceDataset.datasets[0].data.slice(-1)[0] as number) * 100) / 100).toString()} lux</p>
                <p className="text-xs">Last reading: {illuminanceDataset && illuminanceDataset.labels && illuminanceDataset.labels.slice(-1)[0] as string}</p>
            </div>
            <div className="lg:col-span-4 md:col-span-2 col-span-1 p-6 bg-white border border-gray-300 shadow-md rounded-lg">
                <h2 className="text-lg font-bold">{Number(value)/24} Day {sensorData.length > 0 && sensorData[Number(sensor)-1] ? sensorData[Number(sensor)-1].Sensor_Description : 'MKR_Environmental_Shield_Temperature'} History</h2>
                {/* <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                    <Input label="Time Span" value={value} onValueChange={setValue}/>
                </div> */}

                <Dropdown>
                    <DropdownTrigger>
                        <Button variant="bordered">Select Time Span</Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions" onAction={(key) => setValue(key.toString())}>
                        <DropdownItem key="24">1 day</DropdownItem>
                        <DropdownItem key="48">2 days</DropdownItem>
                        <DropdownItem key="72">3 days</DropdownItem>
                        <DropdownItem key="96">4 days</DropdownItem>
                        <DropdownItem key="120">5 days</DropdownItem>
                        <DropdownItem key="144">6 days</DropdownItem>
                        <DropdownItem key="168">7 days</DropdownItem>
                        <DropdownItem key="192">8 days</DropdownItem>
                        <DropdownItem key="216">9 days</DropdownItem>
                        <DropdownItem key="240">10 days</DropdownItem>
                        <DropdownItem key="264">11 days</DropdownItem>
                        <DropdownItem key="288">12 days</DropdownItem>
                    </DropdownMenu>
                </Dropdown>


                <Dropdown>
                    <DropdownTrigger>
                        <Button variant="bordered">Select Sensor</Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions" onAction={(key) => setSensor(key.toString())}>
                    {sensorData.map((sensor: Sensor) => (
                                            <DropdownItem key={sensor.Sensor_ID.toString()}>{sensor.Sensor_Description}</DropdownItem>
                                        ))}
                    </DropdownMenu>
                </Dropdown>
             
                <Button color="primary" onPress={downloadChart}>Download</Button>
                <div id="Chart">
                    {longTemperatureDataset && <Line data={longTemperatureDataset} options={{ scales: { y: { title: { display: true, text: '°F' } } }, plugins: { legend: { display: false } } }} />}
                    <p className="text-xs">Last reading: {temperatureDataset && temperatureDataset.labels && temperatureDataset.labels.slice(-1)[0] as string}</p>
                </div>
            </div>
        </div>
    );
}

export default LineChart;