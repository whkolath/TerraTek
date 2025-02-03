import dynamic from 'next/dynamic';
export const Plotly = dynamic(() => import('react-plotly.js'), { ssr: false });
import { Button } from "@heroui/button";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem
} from "@heroui/dropdown";
import { DateRangePicker } from "@heroui/react";
import { useEffect, useState } from 'react';
import { collect } from "collect.js"; 

const Chart = () => {
    type DataSet = {
        dates: Array<Date>;
        values: Array<number>;
        days: Array<Date>;
        hours: Array<Date>;
    }

    type SensorList = {
        Sensor_ID: Array<number>;
        Sensor_Description: Array<string>;
    }

    type BoardList = {
        Board_ID: Array<number>;
        Board_Description: Array<string>;
    }



    const [dataset, setDataset] = useState<DataSet>({
        dates: [],
        values: [],
        days: [],
        hours: [],
    });

    const [value, setValue] = useState("500");
    const [sensor, setSensor] = useState("2");
    const [board, setBoard] = useState("0xa8610a34362d800f");
    const [chartType, setChartType] = useState(1);

    console.log(board);
    const [sensorList, setSensorList] = useState<SensorList>({
        Sensor_ID: [],
        Sensor_Description: [],
    })

    const [boardList, setBoardList] = useState<BoardList>({
        Board_ID: [],
        Board_Description: [],
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [response, sensorResponse, boardResponse] = await Promise.all([
                    fetch(`/api/hourly/${value}/${sensor}`),
                    fetch(`/api/sensors`),
                    fetch(`/api/boards`)

                ]);
                const data = await response.json();
                const sensorsData = await sensorResponse.json();
                const boardsData = await boardResponse.json();

                data.reverse();

                console.log(data);
                const hours = data.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    timeZone: "America/Chicago"
                }));
                const values = data.map((data: { Average_Reading: number }) => data.Average_Reading);
                const days = data.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp).toLocaleDateString("en-US", {
                    dateStyle: "short",
                    timeZone: "America/Chicago"
                }));

                const dates = data.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp));
                console.log(hours);
                console.log(values);
                console.log(dates);

                setDataset({
                    dates: dates,
                    values: values,
                    days: days,
                    hours: hours,
                });


                setSensorList({
                    Sensor_ID: sensorsData.map((sensorsData: { Sensor_ID: number }) => sensorsData.Sensor_ID),
                    Sensor_Description: sensorsData.map((sensorsData: { Sensor_Description: number }) => sensorsData.Sensor_Description),
                });
                setBoardList({
                    Board_ID: boardsData.map((boardsData: { Board_ID: number }) => boardsData.Board_ID),
                    Board_Description: boardsData.map((boardsData: { Board_Description: number }) => boardsData.Board_Description),
                });

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [value, sensor]);

    function createCart() {
        switch (chartType) {
            case 1:
                return (
                    <Plotly
                        data={[{ x: dataset.dates, y: dataset.values, type: 'scatter', mode: 'lines+markers' }]}
                        layout={{
                            autosize: true,
                            // responsive: true,
                            margin: { t: 20, l: 40, r: 20, b: 40 },
                            xaxis: { automargin: true },
                            yaxis: { automargin: true },
                            paper_bgcolor: '#f1f5f9',
                            plot_bgcolor: '#f1f5f9',
                            // text: 'Scroll and Zoom'
                        }}
                        useResizeHandler={true}
                        style={{ width: "100%", height: "100%" }}
                    />
                );

            case 2:
                return (
                    <Plotly
                        data={[{ x: dataset.dates, y: dataset.values, type: 'scatter', mode: 'markers' }]}
                        layout={{
                            autosize: true,
                            // responsive: true,
                            margin: { t: 20, l: 40, r: 20, b: 40 },
                            xaxis: { automargin: true },
                            yaxis: { automargin: true },
                            paper_bgcolor: '#f1f5f9',
                            plot_bgcolor: '#f1f5f9',
                            // text: 'Scroll and Zoom'
                        }}
                        useResizeHandler={true}
                        style={{ width: "100%", height: "100%" }}
                    />
                );

            case 3:
                return (
                    <Plotly
                        data={[{ x: dataset.dates, y: dataset.values, type: 'bar'}]}
                        layout={{
                            autosize: true,
                            // responsive: true,
                            margin: { t: 20, l: 40, r: 20, b: 40 },
                            xaxis: { automargin: true },
                            yaxis: { automargin: true },
                            paper_bgcolor: '#f1f5f9',
                            plot_bgcolor: '#f1f5f9',
                            // text: 'Scroll and Zoom'
                        }}
                        useResizeHandler={true}
                        style={{ width: "100%", height: "100%" }}
                    />
                );


            case 4:
                return (
                    <Plotly
                        data={[{ x: dataset.days, y: dataset.hours, z: dataset.values, type: 'heatmap' }]}
                        layout={{
                            autosize: true,
                            // responsive: true,
                            margin: { t: 20, l: 40, r: 20, b: 40 },
                            xaxis: { automargin: true },
                            yaxis: { automargin: true },
                            paper_bgcolor: '#f1f5f9',
                            plot_bgcolor: '#f1f5f9',
                            // text: 'Scroll and Zoom'
                        }}
                        useResizeHandler={true}
                        style={{ width: "100%", height: "100%" }}
                    />
                );
            default:
                return (
                    <Plotly
                        data={[{ x: dataset.dates, y: dataset.values, type: 'scatter', mode: 'lines+markers' }]}
                        layout={{
                            autosize: true,
                            // responsive: true,
                            margin: { t: 20, l: 40, r: 20, b: 40 },
                            xaxis: { automargin: true },
                            yaxis: { automargin: true },
                            paper_bgcolor: '#f1f5f9',
                            plot_bgcolor: '#f1f5f9',
                            // text: 'Scroll and Zoom'
                        }}
                        useResizeHandler={true}
                        style={{ width: "100%", height: "100%" }}
                    />
                );
        }
    }

    return (
        <div className="w-full h-full grid gap-2 p-2 lg:grid-cols-4 md:grid-cols-2 lg:grid-rows-[0.75fr_2fr_0.25fr] md:grid-rows-[0.75fr_0.75fr_2fr_0.5fr]">
            <div className="h-full bg-slate-100 shadow-sm rounded-md">
                <div className="p-3">
                    <h1 className="text-center text-xl font-semibold font-mono">Time</h1>
                    <div className="grid grid-cols-3 gap-2">
                        <Button onPress={() => setValue("24")} className="shadow-sm" color="primary" radius="sm">Past Day</Button>
                        <Button onPress={() => setValue("168")} className="shadow-sm" color="primary" radius="sm">Past Week</Button>
                        <Button onPress={() => setValue("744")} className="shadow-sm" color="primary" radius="sm">Past Month</Button>
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
                        <Button className="shadow-sm" radius="sm" variant="bordered">
                            Tank Selection
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu onAction={(key) => setBoard(key.toString())}>
                        {boardList.Board_ID.map((id, index) => (
                            <DropdownItem key={id.toString()}>{boardList.Board_Description[index]}</DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>
            </div>
            <div className="p-4 h-full bg-slate-100 shadow-sm rounded-md">
                <h1 className="text-center text-xl font-semibold font-mono">Sensors</h1>
                <Dropdown>
                    <DropdownTrigger>
                        <Button className="shadow-sm" radius="sm" variant="bordered">
                            Sensor Selection
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu onAction={(key) => setSensor(key.toString())}>
                        {sensorList.Sensor_ID.map((id, index) => (
                            <DropdownItem key={id.toString()}>{sensorList.Sensor_Description[index]}</DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>

            </div>
            <div className="p-4 h-full bg-slate-100 shadow-sm rounded-md">
                <h1 className="text-center text-xl font-semibold font-mono">Chart Type</h1>
                <div className="p-3">

                    <div className="grid grid-cols-2 gap-2">
                        <Button onPress={() => setChartType(1)} className="shadow-sm" color="primary" radius="sm">Line Chart</Button>
                        <Button onPress={() => setChartType(2)} className="shadow-sm" color="primary" radius="sm">Scatter Plot</Button>
                        <Button onPress={() => setChartType(3)} className="shadow-sm" color="primary" radius="sm">Bar Chart</Button>
                        <Button onPress={() => setChartType(4)} className="shadow-sm" color="primary" radius="sm">Heatmap</Button>
                    </div>
                </div>
            </div>

            <div className="row-span-2 col-span-1 p-4 h-full  bg-slate-100 shadow-sm rounded-md lg:col-span-3 md:col-span-2 flex flex-col">
                <h1 className="text-center text-xl font-semibold font-mono">Chart</h1>
                <div className="flex-grow w-full h-0">

                    {createCart()}
                </div>
            </div>
            <div className="p-4 h-full bg-slate-100 shadow-sm rounded-md flex flex-col">
                <h1 className="text-center text-xl font-semibold font-mono">Stats</h1>
                <h1>Average: {collect(dataset.values.filter(value => value !== null)).average().toFixed(2)}</h1>
                <h1>Min: {collect(dataset.values.filter(value => value !== null)).min().toFixed(2)}</h1>
                <h1>Max: {collect(dataset.values.filter(value => value !== null)).max().toFixed(2)}</h1>
                <h1>Median: {collect(dataset.values.filter(value => value !== null)).median().toFixed(2)}</h1>
                <div className="flex-grow w-full h-0">

                    <Plotly
                        data={[{ y: dataset.values, type: 'box', name: "" }]}
                        layout={{
                            autosize: true,
                            // responsive: true,
                            margin: { t: 20, l: 40, r: 20, b: 40 },
                            xaxis: { automargin: true },
                            yaxis: { automargin: true },
                            paper_bgcolor: '#f1f5f9',
                            plot_bgcolor: '#f1f5f9',
                            // text: 'Scroll and Zoom'
                        }}
                        useResizeHandler={true}
                        style={{ width: "100%", height: "100%" }}
                    />
                </div>

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

export default Chart;