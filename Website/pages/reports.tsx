import dynamic from 'next/dynamic';
export const PlotlyComponent = dynamic(() => import('react-plotly.js'), { ssr: false });


import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    DateRangePicker,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Button,
    useDisclosure,
} from "@heroui/react";

import { useEffect, useState } from 'react';
import { collect } from "collect.js";
import { CirclePicker } from 'react-color';


const Chart = () => {
    const { isOpen: isOpen, onOpen: onOpen, onClose: onClose } = useDisclosure();
    const { isOpen: isOpen2, onOpen: onOpen2, onClose: onClose2 } = useDisclosure();
    const { isOpen: isOpen3, onOpen: onOpen3, onClose: onClose3 } = useDisclosure();
    const { isOpen: isOpenHelp, onOpen: onOpenHelp, onClose: onCloseHelp } = useDisclosure();

    type DataSet = {
        dates: Array<Date>;
        values: Array<number>;
        days: Array<Date>;
        hours: Array<Date>;
    }

    type SensorList = {
        Sensor_ID: Array<number>;
        Sensor_Description: Array<string>;
        Units: Array<string>;
    }

    type BoardList = {
        Board_ID: Array<string>;
        Board_Description: Array<string>;
    }

    const [unitType, setUnitType] = useState(1);

    const [graphDiv, setGraphDiv] = useState<HTMLElement | null>(null);

    const [dataset, setDataset] = useState<DataSet>({
        dates: [],
        values: [],
        days: [],
        hours: [],
    });

    const [dataset2, setDataset2] = useState<DataSet>({
        dates: [],
        values: [],
        days: [],
        hours: [],
    });

    const [dataset3, setDataset3] = useState<DataSet>({
        dates: [],
        values: [],
        days: [],
        hours: [],
    });

    const [downloadType, setDownload] = useState("PNG");

    const [time, setTime] = useState("744");

    const [sensor, setSensor] = useState("2");
    const [board, setBoard] = useState("0xa8610a34362d800f");

    const [sensor2, setSensor2] = useState<string | null>(null);
    const [board2, setBoard2] = useState<string | null>(null);

    const [sensor3, setSensor3] = useState<string | null>(null);
    const [board3, setBoard3] = useState<string | null>(null);


    const [chartType, setChartType] = useState(1);

    const [color, setColor] = useState('#3f51b5');
    const [color2, setColor2] = useState('#f44336');
    const [color3, setColor3] = useState('#4caf50');

    const [sensorList, setSensorList] = useState<SensorList>({
        Sensor_ID: [],
        Sensor_Description: [],
        Units: []
    })

    const [boardList, setBoardList] = useState<BoardList>({
        Board_ID: [],
        Board_Description: [],
    })


    useEffect(() => {
        const fetchData = async () => {
            try {

                const [response, response2, response3, sensorResponse, boardResponse] = await Promise.all([
                    fetch(`/api/hourly/${time}/${sensor}`),
                    fetch(`/api/hourly/${time}/${sensor2}`),
                    fetch(`/api/hourly/${time}/${sensor3}`),
                    fetch(`/api/sensors`),
                    fetch(`/api/boards`)

                ]);
                const data = await response.json();
                const data2 = await response2.json();
                const data3 = await response3.json();
                const sensorsData = await sensorResponse.json();
                const boardsData = await boardResponse.json();

                setSensorList({
                    Sensor_ID: sensorsData.map((sensorsData: { Sensor_ID: number }) => sensorsData.Sensor_ID),
                    Sensor_Description: sensorsData.map((sensorsData: { Sensor_Description: number }) => sensorsData.Sensor_Description),
                    Units: sensorsData.map((sensorsData: { Units: number, Sensor_ID: number }) => (unitType && sensorsData.Sensor_ID == 2) ? "°F" : sensorsData.Units)
                });

                setBoardList({
                    Board_ID: boardsData.map((boardsData: { Board_ID: number }) => boardsData.Board_ID),
                    Board_Description: boardsData.map((boardsData: { Board_Description: number }) => boardsData.Board_Description),
                });

                const hours = data.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    timeZone: "America/Chicago"
                }));

                let values = data.map((data: { Average_Reading: number }) => data.Average_Reading);

                if (unitType) {
                    if (sensor == "2") {
                        values = data.map((data: { Average_Reading: number }) => data.Average_Reading ? data.Average_Reading * 9 / 5 + 32 : null);
                    }
                }

                const days = data.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp).toLocaleDateString("en-US", {
                    dateStyle: "short",
                    timeZone: "America/Chicago"
                }));

                const dates = data.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp));

                const hours2 = data2.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    timeZone: "America/Chicago"
                }));
                const values2 = data2.map((data: { Average_Reading: number }) => data.Average_Reading);
                const days2 = data2.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp).toLocaleDateString("en-US", {
                    dateStyle: "short",
                    timeZone: "America/Chicago"
                }));

                const dates2 = data2.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp));

                const hours3 = data3.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    timeZone: "America/Chicago"
                }));
                const values3 = data3.map((data: { Average_Reading: number }) => data.Average_Reading);
                const days3 = data3.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp).toLocaleDateString("en-US", {
                    dateStyle: "short",
                    timeZone: "America/Chicago"
                }));

                const dates3 = data3.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp));



                setDataset({
                    dates: dates,
                    values: values,
                    days: days,
                    hours: hours,
                });

                setDataset2({
                    dates: dates2,
                    values: values2,
                    days: days2,
                    hours: hours2,
                });

                setDataset3({
                    dates: dates3,
                    values: values3,
                    days: days3,
                    hours: hours3,
                });




            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [time, sensor, board, sensor2, board2, sensor3, board3, unitType]);

    const download = async function () {
        switch (downloadType) {
            case "CSV":
                try {
                    const csvRows = [];
                    const sensorName = sensorList.Sensor_Description[Number(sensor) - 1]
                    csvRows.push(`Date,${sensorName}`);

                    for (let i = 0; i < dataset.dates.length; i++) {
                        csvRows.push([dataset.dates[i], dataset.values[i] ? Number(dataset.values[i]).toFixed(4) : ""].join(','))
                    }

                    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'download.csv';
                    a.click();
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
                break;

            case "JSON":
                try {
                    const dataArray = [];
                    for (let i = 0; i < dataset.dates.length; i++) {
                        dataArray.push([dataset.dates[i], dataset.values[i] ? Number(dataset.values[i]).toFixed(4) : null])
                    }
                    const jsonData = JSON.stringify(dataArray);
                    const blob = new Blob([jsonData], { type: 'text/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'download.json';
                    a.click();
                } catch (error) {
                    console.error("Error fetching data:", error)
                }
                break;

            case "JPEG":
                if (graphDiv) {
                    try {
                        const Plotly = await import("plotly.js-dist");
                        const dataUrl = await Plotly.toImage(graphDiv, {
                            format: "jpeg",
                            height: 1080,
                            width: 1920,
                        });

                        const link = document.createElement("a");
                        link.href = dataUrl;
                        link.download = "chart.jpeg";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    } catch (error) {
                        console.error("Error fetching data:", error);
                    }
                }
                break;

            default:
                if (graphDiv) {
                    try {
                        const Plotly = await import("plotly.js-dist");
                        const dataUrl = await Plotly.toImage(graphDiv, {
                            format: "png",
                            height: 1080,
                            width: 1920,
                        });

                        const link = document.createElement("a");
                        link.href = dataUrl;
                        link.download = "chart.png";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    } catch (error) {
                        console.error("Error fetching data:", error);
                    }
                }
                break;

        }
    }


    function createCart() {
        switch (chartType) {
            case 1:
                return (
                    <PlotlyComponent
                        data={[{ x: dataset.dates, y: dataset.values, type: 'scatter', mode: 'lines+markers', marker: { color: color }, name: sensor ? sensorList.Sensor_Description[Number(sensor) - 1] : "", showlegend: sensor ? true : false, },
                        { x: dataset2.dates, y: dataset2.values, type: 'scatter', mode: 'lines+markers', marker: { color: color2 }, name: sensor2 ? sensorList.Sensor_Description[Number(sensor2) - 1] : "", showlegend: sensor2 ? true : false, yaxis: 'y2' },
                        { x: dataset3.dates, y: dataset3.values, type: 'scatter', mode: 'lines+markers', marker: { color: color3 }, name: sensor3 ? sensorList.Sensor_Description[Number(sensor3) - 1] : "", showlegend: sensor3 ? true : false, yaxis: 'y3' }
                        ]}
                        layout={{
                            autosize: true,
                            margin: { t: 20, l: 20, r: 20, b: 20 },
                            xaxis: { automargin: true },
                            yaxis: { color: color, side: "left", anchor: 'x', position: 0, automargin: true, title: { text: sensor ? sensorList.Units[Number(sensor) - 1] : "" } },
                            yaxis2: sensor2 ? { color: color2, side: "right", anchor: 'x', overlaying: "y", automargin: true, title: { text: sensor2 ? sensorList.Units[Number(sensor2) - 1] : "" } } : { side: "right", overlaying: "y", automargin: true, showticklabels: false, showline: false, showgrid: false, zeroline: false },
                            yaxis3: sensor3 ? { color: color3, side: "right", anchor: "free", overlaying: "y", position: 1.15, automargin: true, title: { text: sensorList.Units[Number(sensor3) - 1] } } : { side: "right", overlaying: "y", automargin: true, showticklabels: false, showline: false, showgrid: false, zeroline: false },
                            paper_bgcolor: '#f1f5f9',
                            plot_bgcolor: '#f1f5f9',
                            showlegend: true,
                            legend: {
                                x: 1,
                                xanchor: 'right',
                                y: 1
                            }

                        }}
                        config={{ displayModeBar: false, scrollZoom: true, responsive: true }}
                        onInitialized={(_, graphDiv) => setGraphDiv(graphDiv)}
                        useResizeHandler={true}
                        style={{ width: "100%", height: "100%" }}

                    />
                );

            case 2:
                return (
                    <PlotlyComponent
                        data={[{ x: dataset.dates, y: dataset.values, type: 'scatter', mode: 'markers', marker: { color: color }, name: sensor ? sensorList.Sensor_Description[Number(sensor) - 1] : "", showlegend: sensor ? true : false },
                        { x: dataset2.dates, y: dataset2.values, type: 'scatter', mode: 'markers', marker: { color: color2 }, name: sensor2 ? sensorList.Sensor_Description[Number(sensor2) - 1] : "", showlegend: sensor2 ? true : false, yaxis: 'y2' },
                        { x: dataset3.dates, y: dataset3.values, type: 'scatter', mode: 'markers', marker: { color: color3 }, name: sensor3 ? sensorList.Sensor_Description[Number(sensor3) - 1] : "", showlegend: sensor3 ? true : false, yaxis: 'y3' }
                        ]}
                        layout={{
                            autosize: true,
                            margin: { t: 20, l: 40, r: 20, b: 40 },
                            xaxis: { automargin: true },
                            yaxis: { color: color, side: "left", anchor: 'x', position: 0, automargin: true, title: { text: sensor ? sensorList.Units[Number(sensor) - 1] : "" } },
                            yaxis2: sensor2 ? { color: color2, side: "right", anchor: 'x', overlaying: "y", automargin: true, title: { text: sensor2 ? sensorList.Units[Number(sensor2) - 1] : "" } } : { side: "right", overlaying: "y", automargin: true, showticklabels: false, showline: false, showgrid: false, zeroline: false },
                            yaxis3: sensor3 ? { color: color3, side: "right", anchor: "free", overlaying: "y", position: 1.15, automargin: true, title: { text: sensorList.Units[Number(sensor3) - 1] } } : { side: "right", overlaying: "y", automargin: true, showticklabels: false, showline: false, showgrid: false, zeroline: false },
                            paper_bgcolor: '#f1f5f9',
                            plot_bgcolor: '#f1f5f9',
                            showlegend: true,
                            legend: {
                                x: 1,
                                xanchor: 'right',
                                y: 1
                            }

                        }}
                        config={{ displayModeBar: false, scrollZoom: true, responsive: true }}
                        onInitialized={(_, graphDiv) => setGraphDiv(graphDiv)}
                        useResizeHandler={true}
                        style={{ width: "100%", height: "100%" }}

                    />
                );

            case 3:
                return (
                    <PlotlyComponent
                        data={[{ x: dataset.dates, y: dataset.values, type: 'bar', marker: { color: color }, name: sensor ? sensorList.Sensor_Description[Number(sensor) - 1] : "", showlegend: sensor ? true : false },
                        { x: dataset2.dates, y: dataset2.values, type: 'bar', marker: { color: color2 }, name: sensor2 ? sensorList.Sensor_Description[Number(sensor2) - 1] : "", showlegend: sensor2 ? true : false, yaxis: 'y2' },
                        { x: dataset3.dates, y: dataset3.values, type: 'bar', marker: { color: color3 }, name: sensor3 ? sensorList.Sensor_Description[Number(sensor3) - 1] : "", showlegend: sensor3 ? true : false, yaxis: 'y3' }
                        ]}
                        layout={{
                            autosize: true,
                            margin: { t: 20, l: 40, r: 20, b: 40 },
                            xaxis: { automargin: true },
                            yaxis: { color: color, side: "left", anchor: 'x', position: 0, automargin: true, title: { text: sensor ? sensorList.Units[Number(sensor) - 1] : "" } },
                            yaxis2: sensor2 ? { color: color2, side: "right", anchor: 'x', overlaying: "y", automargin: true, title: { text: sensor2 ? sensorList.Units[Number(sensor2) - 1] : "" } } : { side: "right", overlaying: "y", automargin: true, showticklabels: false, showline: false, showgrid: false, zeroline: false },
                            yaxis3: sensor3 ? { color: color3, side: "right", anchor: "free", overlaying: "y", position: 1.15, automargin: true, title: { text: sensorList.Units[Number(sensor3) - 1] } } : { side: "right", overlaying: "y", automargin: true, showticklabels: false, showline: false, showgrid: false, zeroline: false },
                            paper_bgcolor: '#f1f5f9',
                            plot_bgcolor: '#f1f5f9',
                            showlegend: true,
                            legend: {
                                x: 1,
                                xanchor: 'right',
                                y: 1
                            }

                        }}
                        config={{ displayModeBar: false, scrollZoom: true, responsive: true }}
                        onInitialized={(_, graphDiv) => setGraphDiv(graphDiv)}
                        useResizeHandler={true}
                        style={{ width: "100%", height: "100%" }}

                    />
                );


            case 4:
                return (
                    <PlotlyComponent
                        data={[{ x: dataset.days, y: dataset.hours, z: dataset.values, type: 'heatmap', name: sensor ? sensorList.Sensor_Description[Number(sensor) - 1] : "" }]}
                        layout={{
                            autosize: true,
                            margin: { t: 20, l: 40, r: 20, b: 40 },
                            xaxis: { automargin: true },
                            yaxis: { automargin: true },
                            paper_bgcolor: '#f1f5f9',
                            plot_bgcolor: '#f1f5f9',
                            showlegend: true
                        }}
                        config={{ displayModeBar: false, scrollZoom: true, responsive: true }}
                        onInitialized={(_, graphDiv) => setGraphDiv(graphDiv)}
                        useResizeHandler={true}
                        style={{ width: "100%", height: "100%" }}
                    />
                );

            case 5:
                return (
                    <PlotlyComponent
                        data={[{ x: dataset.values, type: 'histogram', marker: { color: color }, name: sensor ? sensorList.Sensor_Description[Number(sensor) - 1] : "", showlegend: sensor ? true : false },
                        { x: dataset2.values, type: 'histogram', marker: { color: color2 }, name: sensor2 ? sensorList.Sensor_Description[Number(sensor2) - 1] : "", showlegend: sensor2 ? true : false },
                        { x: dataset3.values, type: 'histogram', marker: { color: color3 }, name: sensor3 ? sensorList.Sensor_Description[Number(sensor3) - 1] : "", showlegend: sensor3 ? true : false }
                        ]}
                        layout={{
                            autosize: true,
                            margin: { t: 20, l: 40, r: 20, b: 40 },
                            xaxis: { automargin: true },
                            yaxis: { automargin: true },
                            paper_bgcolor: '#f1f5f9',
                            plot_bgcolor: '#f1f5f9',
                            showlegend: true,
                            legend: {
                                x: 1,
                                xanchor: 'right',
                                y: 1
                            }

                        }}
                        config={{ displayModeBar: false, scrollZoom: true, responsive: true }}
                        onInitialized={(_, graphDiv) => setGraphDiv(graphDiv)}
                        useResizeHandler={true}
                        style={{ width: "100%", height: "100%" }}

                    />
                );

            case 6:
                return (
                    <PlotlyComponent
                        data={[{ x: sensor ? dataset.values : [], type: 'violin', marker: { color: color }, name: sensor ? sensorList.Sensor_Description[Number(sensor) - 1] : "", box: { visible: true }, meanline: { visible: true } },
                        { x: sensor2 ? dataset2.values : [], type: 'violin', marker: { color: color2 }, name: sensor2 ? sensorList.Sensor_Description[Number(sensor2) - 1] : "", box: { visible: true }, meanline: { visible: true } },
                        { x: sensor3 ? dataset3.values : [], type: 'violin', marker: { color: color3 }, name: sensor3 ? sensorList.Sensor_Description[Number(sensor3) - 1] : "", box: { visible: true }, meanline: { visible: true } }
                        ]}
                        layout={{
                            autosize: true,
                            margin: { t: 20, l: 40, r: 20, b: 40 },
                            xaxis: { automargin: true },
                            yaxis: { automargin: true },
                            paper_bgcolor: '#f1f5f9',
                            plot_bgcolor: '#f1f5f9',
                            showlegend: false,
                            legend: {
                                x: 1,
                                xanchor: 'right',
                                y: 1
                            }

                        }}
                        config={{ displayModeBar: false, scrollZoom: true, responsive: true }}
                        onInitialized={(_, graphDiv) => setGraphDiv(graphDiv)}
                        useResizeHandler={true}
                        style={{ width: "100%", height: "100%" }}

                    />
                );

            default:
                return (
                    <PlotlyComponent
                        data={[{ x: dataset.dates, y: dataset.values, type: 'scatter', mode: 'lines+markers', marker: { color: color }, name: sensor ? sensorList.Sensor_Description[Number(sensor) - 1] : "", showlegend: sensor ? true : false, },
                        { x: dataset2.dates, y: dataset2.values, type: 'scatter', mode: 'lines+markers', marker: { color: color2 }, name: sensor2 ? sensorList.Sensor_Description[Number(sensor2) - 1] : "", showlegend: sensor2 ? true : false, yaxis: 'y2' },
                        { x: dataset3.dates, y: dataset3.values, type: 'scatter', mode: 'lines+markers', marker: { color: color3 }, name: sensor3 ? sensorList.Sensor_Description[Number(sensor3) - 1] : "", showlegend: sensor3 ? true : false, yaxis: 'y3' }
                        ]}
                        layout={{
                            autosize: true,
                            margin: { t: 20, l: 20, r: 20, b: 20 },
                            xaxis: { automargin: true },
                            yaxis: { color: color, side: "left", anchor: 'x', position: 0, automargin: true, title: { text: sensor ? sensorList.Units[Number(sensor) - 1] : "" } },
                            yaxis2: sensor2 ? { color: color2, side: "right", anchor: 'x', overlaying: "y", automargin: true, title: { text: sensor2 ? sensorList.Units[Number(sensor2) - 1] : "" } } : { side: "right", overlaying: "y", automargin: true, showticklabels: false, showline: false, showgrid: false, zeroline: false },
                            yaxis3: sensor3 ? { color: color3, side: "right", anchor: "free", overlaying: "y", position: 1.15, automargin: true, title: { text: sensorList.Units[Number(sensor3) - 1] } } : { side: "right", overlaying: "y", automargin: true, showticklabels: false, showline: false, showgrid: false, zeroline: false },
                            paper_bgcolor: '#f1f5f9',
                            plot_bgcolor: '#f1f5f9',
                            showlegend: true,
                            legend: {
                                x: 1,
                                xanchor: 'right',
                                y: 1
                            }

                        }}
                        config={{ displayModeBar: false, scrollZoom: true, responsive: true }}
                        onInitialized={(_, graphDiv) => setGraphDiv(graphDiv)}
                        useResizeHandler={true}
                        style={{ width: "100%", height: "100%" }}

                    />
                );
        }
    }

    return (
        <div className="w-full h-full grid gap-2 p-2 grid-rows-[0.2fr_1fr_0.1fr] grid-cols-4">
            <div className="h-full bg-slate-100 shadow-sm rounded-md">
                <div className="p-3">
                    <h1 className="text-center text-xl font-semibold font-mono">Time</h1>
                    <div className="grid grid-cols-3 gap-2">
                        <Button onPress={() => setTime("24")} className="shadow-sm" color="primary" radius="sm">Past Day</Button>
                        <Button onPress={() => setTime("168")} className="shadow-sm" color="primary" radius="sm">Past Week</Button>
                        <Button onPress={() => setTime("744")} className="shadow-sm" color="primary" radius="sm">Past Month</Button>
                        <div className="col-span-3">
                            <DateRangePicker className="flex items-center justify-center h-full" label="Custom" />
                        </div>
                        <div className="col-span-2">
                            <Dropdown className=" w-full">
                                <DropdownTrigger>
                                    <Button className="shadow-sm w-full" radius="sm" variant="bordered" >
                                        Time Intervals
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu>
                                    <DropdownItem key={1}>No Aggregation</DropdownItem>
                                    <DropdownItem key={2}>Half Hourly</DropdownItem>
                                    <DropdownItem key={3}>Hourly</DropdownItem>
                                    <DropdownItem key={4}>Daily</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                        <div>
                            <Dropdown className=" w-full">
                                <DropdownTrigger>
                                    <Button className="shadow-sm w-full" radius="sm" variant="bordered">
                                        Units
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu onAction={(key) => setUnitType(Number(key))}>
                                    <DropdownItem key={1}>Imperial</DropdownItem>
                                    <DropdownItem key={0}>Metric</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4 h-full col-span-2 bg-slate-100 shadow-sm rounded-md flex-grow">
                <h1 className="text-center text-xl font-semibold font-mono">Sensors</h1>
                <div className=" grid flex-grow gap-2 grid-cols-[0.75fr_0.5fr_2fr_2fr_0.05fr_0.05fr]">
                    <div className="col-span-2"></div>
                    <p className="text-sm text-center">Cluster Location</p>
                    <p className="col-span-2 text-sm text-center">Sensor</p>
                    <div></div>
                    <h1>Sensor 1: </h1>
                    <div>
                        <Dropdown className=" w-full">
                            <DropdownTrigger>
                                <Button className="shadow-sm w-full" radius="sm" variant="bordered" size="sm">
                                    Aggregation type
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem key={1}>Average</DropdownItem>
                                <DropdownItem key={2}>Median</DropdownItem>
                                <DropdownItem key={3}>Minimum</DropdownItem>
                                <DropdownItem key={4}>Maximum</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div>
                        <Dropdown >
                            <DropdownTrigger>
                                <Button className="shadow-sm w-full" radius="sm" variant="bordered" size="sm">
                                    {board ? boardList.Board_Description[boardList.Board_ID.indexOf(board)] : "Cluster Selection"}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu onAction={(key) => setBoard(key.toString())}>
                                {boardList.Board_ID.map((id, index) => (
                                    <DropdownItem key={id.toString()}>{boardList.Board_Description[index]}</DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div className="col-span-2">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button className="shadow-sm w-full" radius="sm" variant="bordered" size="sm">
                                    {sensor ? sensorList.Sensor_Description[Number(sensor) - 1] : "Sensor Selection"}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu onAction={(key) => setSensor(key.toString())}>
                                {sensorList.Sensor_ID.map((id, index) => (
                                    <DropdownItem key={id.toString()}>{sensorList.Sensor_Description[index]}</DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div>
                        <Button size="sm" onPress={onOpen} >Select Color</Button>
                        <Modal isOpen={isOpen} onClose={onClose}>
                            <ModalContent>
                                <ModalHeader className="flex flex-col text-center text-xl font-semibold font-mono">
                                    Select Color
                                </ModalHeader>
                                <ModalBody className="flex justify-center items-center gap-3">
                                    <CirclePicker
                                        color={color}
                                        onChangeComplete={(color) => setColor(color.hex)}
                                    />
                                </ModalBody>
                            </ModalContent>
                        </Modal>

                    </div>


                    <h1>Sensor 2: </h1>
                    <div>
                        <Dropdown className=" w-full">
                            <DropdownTrigger>
                                <Button className="shadow-sm w-full" radius="sm" variant="bordered" size="sm">
                                    Aggregation type
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem key={1}>Average</DropdownItem>
                                <DropdownItem key={2}>Median</DropdownItem>
                                <DropdownItem key={3}>Minimum</DropdownItem>
                                <DropdownItem key={4}>Maximum</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div>
                        <Dropdown>
                            <DropdownTrigger>
                                <Button className="shadow-sm w-full" radius="sm" variant="bordered" size="sm">
                                    {board2 ? boardList.Board_Description[boardList.Board_ID.indexOf(board2)] : "Cluster Selection"}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu onAction={(key) => setBoard2(key.toString())}>
                                {boardList.Board_ID.map((id, index) => (
                                    <DropdownItem key={id.toString()}>{boardList.Board_Description[index]}</DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div>
                        <Dropdown>
                            <DropdownTrigger>
                                <Button className="shadow-sm w-full" radius="sm" variant="bordered" size="sm">
                                    {sensor2 && sensorList.Sensor_Description[Number(sensor2) - 1] ? sensorList.Sensor_Description[Number(sensor2) - 1] : "Sensor Selection"}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu onAction={(key) => setSensor2(key.toString())}>
                                {sensorList.Sensor_ID.map((id, index) => (
                                    <DropdownItem key={id.toString()}>{sensorList.Sensor_Description[index]}</DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </div>

                    <div>
                        <Button onPress={() => [setSensor2(null), setBoard2(null)]} className="shadow-sm" color="danger" radius="sm" size="sm">Clear</Button>
                    </div>

                    <div>
                        <Button size="sm" onPress={onOpen2}>Select Color</Button>
                        <Modal isOpen={isOpen2} onClose={onClose2}>
                            <ModalContent>
                                <ModalHeader className="flex flex-col text-center text-xl font-semibold font-mono">
                                    Select Color
                                </ModalHeader>
                                <ModalBody className="flex justify-center items-center gap-3">
                                    <CirclePicker
                                        color={color2}
                                        onChangeComplete={(color) => setColor2(color.hex)}
                                    />
                                </ModalBody>
                            </ModalContent>
                        </Modal>
                    </div>

                    <h1>Sensor 3: </h1>
                    <div>
                        <Dropdown className=" w-full">
                            <DropdownTrigger>
                                <Button className="shadow-sm w-full" radius="sm" variant="bordered" size="sm">
                                    Aggregation type
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem key={1}>Average</DropdownItem>
                                <DropdownItem key={2}>Median</DropdownItem>
                                <DropdownItem key={3}>Minimum</DropdownItem>
                                <DropdownItem key={4}>Maximum</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div>
                        <Dropdown>
                            <DropdownTrigger>
                                <Button className="shadow-sm w-full" radius="sm" variant="bordered" size="sm">
                                    {board3 ? boardList.Board_Description[boardList.Board_ID.indexOf(board3)] : "Cluster Selection"}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu onAction={(key) => setBoard3(key.toString())}>
                                {boardList.Board_ID.map((id, index) => (
                                    <DropdownItem key={id.toString()}>{boardList.Board_Description[index]}</DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div>
                        <Dropdown>
                            <DropdownTrigger>
                                <Button className="shadow-sm w-full" radius="sm" variant="bordered" size="sm">
                                    {sensor3 && sensorList.Sensor_Description[Number(sensor3) - 1] ? sensorList.Sensor_Description[Number(sensor3) - 1] : "Sensor Selection"}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu onAction={(key) => setSensor3(key.toString())}>
                                {sensorList.Sensor_ID.map((id, index) => (
                                    <DropdownItem key={id.toString()}>{sensorList.Sensor_Description[index]}</DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </div>

                    <div>
                        <Button onPress={() => [setSensor3(null), setBoard3(null)]} className="shadow-sm" color="danger" radius="sm" size="sm">Clear</Button>
                    </div>

                    <div>
                        <Button size="sm" onPress={onOpen3}>Select Color</Button>
                        <Modal isOpen={isOpen3} onClose={onClose3}>
                            <ModalContent>
                                <ModalHeader className="flex flex-col text-center text-xl font-semibold font-mono">
                                    Select Color
                                </ModalHeader>
                                <ModalBody className="flex justify-center items-center gap-3">
                                    <CirclePicker
                                        color={color3}
                                        onChangeComplete={(color) => setColor3(color.hex)}
                                    />
                                </ModalBody>
                            </ModalContent>
                        </Modal>
                    </div>

                </div>



            </div>
            <div className="p-4 h-full bg-slate-100 shadow-sm rounded-md">
                <h1 className="text-center text-xl font-semibold font-mono">Chart Type</h1>
                <div className="p-3">

                    <div className="grid grid-cols-2 gap-2">
                        <Button onPress={() => setChartType(1)} className="shadow-sm" color="primary" radius="sm">Line Chart</Button>
                        <Button onPress={() => setChartType(2)} className="shadow-sm" color="primary" radius="sm">Scatter Plot</Button>
                        <Button onPress={() => setChartType(3)} className="shadow-sm" color="primary" radius="sm">Bar Chart</Button>
                        <Button onPress={() => setChartType(4)} className="shadow-sm" color="primary" radius="sm">Heatmap</Button>
                        <Button onPress={() => setChartType(5)} className="shadow-sm" color="primary" radius="sm">Histogram</Button>
                        <Button onPress={() => setChartType(6)} className="shadow-sm" color="primary" radius="sm">Violin Chart</Button>
                    </div>
                </div>
            </div>

            <div className="row-span-2 col-span-1 p-4 h-full  bg-slate-100 shadow-sm rounded-md lg:col-span-3 md:col-span-2 flex flex-col">
                <h1 className="text-center text-xl font-semibold font-mono">Chart</h1>
                <div className="flex-grow w-full h-0" id="plotly-plot">

                    {createCart()}
                </div>
            </div>
            <div className="p-4 h-full bg-slate-100 shadow-sm rounded-md flex flex-col">
                <h1 className="text-center text-xl font-semibold font-mono">Stats</h1>

                <div className="grid grid-cols-3">
                    <div className="text-center">
                        <p className="text-sm">Average: {collect(dataset.values.filter(value => value !== null)).average().toFixed(2)} {sensor && sensorList.Units[Number(sensor) - 1]}</p>
                        <p className="text-sm">Min: {collect(dataset.values.filter(value => value !== null)).min().toFixed(2)} {sensor && sensorList.Units[Number(sensor) - 1]}</p>
                        <p className="text-sm">Max: {collect(dataset.values.filter(value => value !== null)).max().toFixed(2)} {sensor && sensorList.Units[Number(sensor) - 1]}</p>
                        <p className="text-sm">Median: {collect(dataset.values.filter(value => value !== null)).median().toFixed(2)} {sensor && sensorList.Units[Number(sensor) - 1]}</p>
                    </div>
                    {sensor2 && (<div className="text-center">
                        <p className="text-sm">Average: {collect(dataset2.values.filter(value => value !== null)).average().toFixed(2)} {sensor2 && sensorList.Units[Number(sensor2) - 1]}</p>
                        <p className="text-sm">Min: {collect(dataset2.values.filter(value => value !== null)).min().toFixed(2)} {sensor2 && sensorList.Units[Number(sensor2) - 1]}</p>
                        <p className="text-sm">Max: {collect(dataset2.values.filter(value => value !== null)).max().toFixed(2)} {sensor2 && sensorList.Units[Number(sensor2) - 1]}</p>
                        <p className="text-sm">Median: {collect(dataset2.values.filter(value => value !== null)).median().toFixed(2)} {sensor2 && sensorList.Units[Number(sensor2) - 1]}</p>
                    </div>)}

                    {sensor3 && (<div className="text-center">
                        <p className="text-sm">Average: {collect(dataset3.values.filter(value => value !== null)).average().toFixed(2)} {sensor3 && sensorList.Units[Number(sensor3) - 1]}</p>
                        <p className="text-sm">Min: {collect(dataset3.values.filter(value => value !== null)).min().toFixed(2)} {sensor3 && sensorList.Units[Number(sensor3) - 1]}</p>
                        <p className="text-sm">Max: {collect(dataset3.values.filter(value => value !== null)).max().toFixed(2)} {sensor3 && sensorList.Units[Number(sensor3) - 1]}</p>
                        <p className="text-sm">Median: {collect(dataset3.values.filter(value => value !== null)).median().toFixed(2)} {sensor3 && sensorList.Units[Number(sensor3) - 1]}</p>
                    </div>)}

                </div>
                <div className="flex-grow w-full h-0">

                    <PlotlyComponent
                        data={[{ y: dataset.values, type: 'box', marker: { color: color }, name: sensor ? sensorList.Sensor_Description[Number(sensor) - 1] : " " },
                        { y: dataset2.values, type: 'box', marker: { color: color2 }, name: sensor2 ? sensorList.Sensor_Description[Number(sensor2) - 1] : " " },
                        { y: dataset3.values, type: 'box', marker: { color: color3 }, name: sensor3 ? sensorList.Sensor_Description[Number(sensor3) - 1] : " " }
                        ]}
                        layout={{
                            autosize: true,
                            margin: { t: 20, l: 40, r: 20, b: 40 },
                            xaxis: { automargin: true },
                            yaxis: { automargin: true },
                            paper_bgcolor: '#f1f5f9',
                            plot_bgcolor: '#f1f5f9',
                            showlegend: false,
                        }}
                        config={{ scrollZoom: true, responsive: true, displayModeBar: false }}
                        useResizeHandler={true}
                        style={{ width: "100%", height: "100%" }}
                    />
                </div>

            </div>
            <div className="p-4 h-full bg-slate-100 shadow-sm rounded-md">
                <h1 className="text-center text-xl font-semibold font-mono">Downloads</h1>
                <div className="p-3">
                    <div className="grid grid-cols-5 gap-2">
                        <Button className="col-span-2" color="primary" radius="sm" onPress={download}>Download {downloadType}</Button>
                        <Dropdown>
                            <DropdownTrigger className="col-span-2">
                                <Button className="shadow-sm w-full" radius="sm" variant="bordered" >Download Format</Button>
                            </DropdownTrigger>
                            <DropdownMenu onAction={(key) => setDownload(key.toString())} className="shadow-sm">
                                <DropdownItem key="PNG">PNG</DropdownItem>
                                <DropdownItem key="JPEG">JPEG</DropdownItem>
                                <DropdownItem key="CSV">CSV</DropdownItem>
                                <DropdownItem key="JSON">JSON</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>

                        <Button onPress={onOpenHelp} radius="sm">Open Help</Button>
                        <Drawer isOpen={isOpenHelp} onClose={onCloseHelp}>
                            <DrawerContent>
                                {(onClose) => (
                                    <>
                                        <DrawerHeader className="flex flex-col gap-1 text-center text-xl font-semibold font-mono">Help</DrawerHeader>
                                        <DrawerBody>
                                            <h1 className="font-semibold font-mono">About the Project</h1>
                                            <p>The TerraTek project encapsulates a property consisting of rainwater harvesting tanks, garden areas, and a playa. 
                                                There are four tanks in total with three of them holding rainwater and the fourth containing gray water. Each tank contains a cluster of sensors with an additional cluster located at the playa. 
                                                The cluster in the playa provides weather data in addition to playa conditions.</p>
                                            <h1 className="font-semibold font-mono">About this Page</h1>
                                            <p>The purpose of this page is to allow users to create custom reports, personalized plots, and to download data in the format of their choice.</p>
                                        </DrawerBody>
                                        <DrawerFooter>
                                            <Button color="danger" variant="light" onPress={onClose}>
                                                Close
                                            </Button>
                                        </DrawerFooter>
                                    </>
                                )}
                            </DrawerContent>
                        </Drawer>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Chart;