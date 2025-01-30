// import dynamic from 'next/dynamic';
import 'chart.js/auto';
// import { ChartData } from 'chart.js';
import { Button } from "@heroui/button";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    // DropdownSection,
    DropdownItem
} from "@heroui/dropdown";
import {DateRangePicker} from "@heroui/react";


// const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
//     ssr: false,
// });

// import { useEffect, useState } from 'react';


const LineChart = () => {


    // const [temperatureDataset, setTemperatureDataset] = useState<ChartData<'line'> | null>(null);
    // const [longTemperatureDataset, setLongTemperatureDataset] = useState<ChartData<'line'> | null>(null);
    // const [humidityDataset, setHumidityDataset] = useState<ChartData<'line'> | null>(null);
    // const [pressureDataset, setPressureDataset] = useState<ChartData<'line'> | null>(null);
    // const [illuminanceDataset, setIlluminanceDataset] = useState<ChartData<'line'> | null>(null);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const [temperatureResponse, longTemperatureResponse, humidityResponse, pressureResponse, illuminanceResponse] = await Promise.all([
    //                 fetch("/api/latest/2"),
    //                 fetch("/api/2"),
    //                 fetch("/api/latest/3"),
    //                 fetch("/api/latest/4"),
    //                 fetch("/api/latest/5")
    //             ]);

    //             const temperatureData = await temperatureResponse.json();
    //             const longTemperatureData = await longTemperatureResponse.json();
    //             const humidityData = await humidityResponse.json();
    //             const pressureData = await pressureResponse.json();
    //             const illuminanceData = await illuminanceResponse.json();

    //             temperatureData.reverse();
    //             longTemperatureData.reverse();
    //             humidityData.reverse();
    //             pressureData.reverse();
    //             illuminanceData.reverse();

    //             const temperatureLabels = temperatureData.map((data: { Sensor_Timestamp: string }) => new Date(data.Sensor_Timestamp).toLocaleTimeString("en-US", {
    //                     hour: "numeric",
    //                     minute: "numeric",
    //                     timeZone: "America/Chicago"
    //                 })
    //             );

    //             setTemperatureDataset({
    //                 labels: temperatureLabels,
    //                 datasets: [
    //                     {
    //                         label: 'Temperature',
    //                         data: temperatureData.map((data: { Sensor_Value: number }) => (data.Sensor_Value * 9 / 5) + 32),
    //                         fill: false,
    //                         borderColor: 'rgb(255, 0, 0)',
    //                         tension: 0.1,
    //                     },
    //                 ],
    //             });
    //             const longTemperatureLabels = longTemperatureData.map((data: { Sensor_Timestamp: string }) => new Date(data.Sensor_Timestamp).toLocaleString("en-US", {
    //                 dateStyle: "short",
    //                 timeStyle: "short",
    //                 timeZone: "America/Chicago"
    //             }));

    //             setLongTemperatureDataset({
    //                 labels: longTemperatureLabels,
    //                 datasets: [
    //                     {
    //                         label: 'Temperature',
    //                         data: longTemperatureData.map((data: { Sensor_Value: number }) => (data.Sensor_Value * 9 / 5) + 32),
    //                         fill: false,
    //                         borderColor: 'rgb(230, 0, 255)',
    //                         tension: 0.1,
    //                     },
    //                 ],
    //             });

    //             const humidityLabels = humidityData.map((data: { Sensor_Timestamp: string }) => new Date(data.Sensor_Timestamp).toLocaleTimeString("en-US", {
    //                 hour: "numeric",
    //                 minute: "numeric",
    //                 timeZone: "America/Chicago"
    //             }));

    //             setHumidityDataset({
    //                 labels: humidityLabels,
    //                 datasets: [
    //                     {
    //                         label: 'Humidity',
    //                         data: humidityData.map((data: { Sensor_Value: number }) => data.Sensor_Value),
    //                         fill: false,
    //                         borderColor: 'rgb(11, 173, 35)',
    //                         tension: 0.1,
    //                     },
    //                 ],
    //             });


    //             const pressureLabels = pressureData.map((data: { Sensor_Timestamp: string }) => new Date(data.Sensor_Timestamp).toLocaleTimeString("en-US", {
    //                 hour: "numeric",
    //                 minute: "numeric",
    //                 timeZone: "America/Chicago"
    //             }));

    //             setPressureDataset({
    //                 labels: pressureLabels,
    //                 datasets: [
    //                     {
    //                         label: 'Pressure',
    //                         data: pressureData.map((data: { Sensor_Value: number }) => data.Sensor_Value),
    //                         fill: false,
    //                         borderColor: 'rgb(0, 0, 255)',
    //                         tension: 0.1,
    //                     },
    //                 ],
    //             });


    //             const illuminanceLabels = illuminanceData.map((data: { Sensor_Timestamp: string }) => new Date(data.Sensor_Timestamp).toLocaleTimeString("en-US", {
    //                 hour: "numeric",
    //                 minute: "numeric",
    //                 timeZone: "America/Chicago"
    //             }));

    //             setIlluminanceDataset({
    //                 labels: illuminanceLabels,
    //                 datasets: [
    //                     {
    //                         label: 'Illuminance',
    //                         data: illuminanceData.map((data: { Sensor_Value: number }) => data.Sensor_Value),
    //                         fill: false,
    //                         borderColor: 'rgb(255, 140, 0)',
    //                         tension: 0.1,
    //                     },
    //                 ],
    //             });
    //         } catch (error) {
    //             console.error("Error fetching weather data:", error);
    //         }
    //     };

    //     fetchData();
    // }, []);

    return (
        <div className="w-full h-full grid gap-2 p-2 lg:grid-cols-4 md:grid-cols-2 lg:grid-rows-[0.75fr_2fr_0.25fr] md:grid-rows-[0.75fr_0.75fr_2fr_0.5fr]">
            <div className="h-full bg-slate-100 shadow-sm rounded-md">
                <div className="p-3">
                    <h1 className="text-center text-xl font-semibold font-mono">Time</h1>
                    <div className="grid grid-cols-3 gap-2">
                    <Button className="shadow-sm" color="primary" radius="sm">Today</Button>
                    <Button className="shadow-sm" color="primary" radius="sm">Last Week</Button>
                    <Button className="shadow-sm" color="primary" radius="sm">This Month</Button>
                    <div className="col-span-3">
                        <DateRangePicker className="flex items-center justify-center h-full" label="Custom" />
                    </div>
                    </div>
                </div>
            </div>
            <div className="p-4 h-full bg-slate-100 shadow-sm rounded-md flex-grow">
                <h1 className="text-center text-xl font-semibold font-mono">Tanks</h1>
                <Dropdown>
                        <DropdownTrigger>
                            <Button className="shadow-sm" radius="sm" variant="bordered">Tank Selection</Button>
                        </DropdownTrigger>
                        <DropdownMenu className="shadow-sm">
                            <DropdownItem key="PDF">PDF</DropdownItem>
                            <DropdownItem key="PNG">PNG</DropdownItem>
                            <DropdownItem key="CSV">CSV</DropdownItem>
                            <DropdownItem key="JSON">JSON</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
            </div>
            <div className="p-4 h-full bg-slate-100 shadow-sm rounded-md">
                <h1 className="text-center text-xl font-semibold font-mono">Sensors</h1>
            </div>
            <div className="p-4 h-full bg-slate-100 shadow-sm rounded-md">
                <h1 className="text-center text-xl font-semibold font-mono">Chart Type</h1>
            </div>
            <div className="row-span-2 col-span-1 p-4 h-full  bg-slate-100 shadow-sm rounded-md lg:col-span-3 md:col-span-2">
                <h1 className="text-center text-xl font-semibold font-mono">Chart</h1>
            </div>
            <div className="p-4 h-full bg-slate-100 shadow-sm rounded-md">
                <h1 className="text-center text-xl font-semibold font-mono">Stats</h1>
            </div>
            <div className="p-4 h-full bg-slate-100 shadow-sm rounded-md">
                <h1 className="text-center text-xl font-semibold font-mono">Downloads</h1>
                <div className="flex gap-4 p-4 justify-center">
                    <Button color="primary" radius="sm">Download</Button>
                    <Dropdown>
                        <DropdownTrigger>
                            <Button className="shadow-sm" radius="sm" variant="bordered">Download Format</Button>
                        </DropdownTrigger>
                        <DropdownMenu className="shadow-sm">
                            <DropdownItem key="PDF">PDF</DropdownItem>
                            <DropdownItem key="PNG">PNG</DropdownItem>
                            <DropdownItem key="CSV">CSV</DropdownItem>
                            <DropdownItem key="JSON">JSON</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>

        </div>
    );
}

export default LineChart;