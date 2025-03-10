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
import { parseZonedDateTime } from "@internationalized/date";
import { CirclePicker } from 'react-color';
import { DateTime } from 'luxon';


const Reports = () => {

    // Custom data types
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

    type DateRange = {
        start: Date;
        end: Date;
    }

    const [unitType, setUnitType] = useState(1);
    const [graphDiv, setGraphDiv] = useState<HTMLElement | null>(null);

    // States of the color modals and help drawer
    const { isOpen: isOpen, onOpen: onOpen, onClose: onClose } = useDisclosure();
    const { isOpen: isOpen2, onOpen: onOpen2, onClose: onClose2 } = useDisclosure();
    const { isOpen: isOpen3, onOpen: onOpen3, onClose: onClose3 } = useDisclosure();
    const { isOpen: isOpenHelp, onOpen: onOpenHelp, onClose: onCloseHelp } = useDisclosure();

    // States of the datasets
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

    // Download type state
    const [downloadType, setDownload] = useState("PNG");

    const [interval, setInterval] = useState("hourly");

    // Selected time span
    const [time, setTime] = useState<DateRange>({
        start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        end: new Date()
    });

    // Sensor and board selection states
    const [sensor, setSensor] = useState("1");
    const [board, setBoard] = useState("0xa8610a34362d800f");
    const [aggregation, setAggregation] = useState("AVG");

    const [sensor2, setSensor2] = useState<string | null>(null);
    const [board2, setBoard2] = useState<string | null>(null);
    const [aggregation2, setAggregation2] = useState("AVG");

    const [sensor3, setSensor3] = useState<string | null>(null);
    const [board3, setBoard3] = useState<string | null>(null);
    const [aggregation3, setAggregation3] = useState("AVG");


    // Chart type
    const [chartType, setChartType] = useState(1);

    // Default colors
    const [color, setColor] = useState('#3f51b5');
    const [color2, setColor2] = useState('#f44336');
    const [color3, setColor3] = useState('#4caf50');

    // List of sensors, will be populated from database
    const [sensorList, setSensorList] = useState<SensorList>({
        Sensor_ID: [],
        Sensor_Description: [],
        Units: []
    })

    // lists of boards, will be populated from database
    const [boardList, setBoardList] = useState<BoardList>({
        Board_ID: [],
        Board_Description: [],
    })


    // This is where the website will react to changes the user makes. Ie. a different sensor is selected
    useEffect(() => {
        const fetchData = async () => {
            try {

                // Fetch the data from the API
                const [response, response2, response3, sensorResponse, boardResponse] = await Promise.all([
                    fetch(`/api/fetchdata/sensor-data?board=${board}&sensor=${sensor}&calc=${aggregation}&start=${time.start}&end=${time.end}&timeinterval=${interval}`),
                    board2 && sensor2 ? fetch(`/api/fetchdata/sensor-data?board=${board2}&sensor=${sensor2}&calc=${aggregation2}&start=${time.start}&end=${time.end}&timeinterval=${interval}`) : Promise.resolve({ json: () => [] }),
                    board3 && sensor3 ? fetch(`/api/fetchdata/sensor-data?board=${board3}&sensor=${sensor3}&calc=${aggregation3}&start=${time.start}&end=${time.end}&timeinterval=${interval}`) : Promise.resolve({ json: () => [] }),
                    fetch(`/api/sensors`),
                    fetch(`/api/boards`)
                ]);

                // Parse the JSON
                const data = await response.json();
                const data2 = await response2.json();
                const data3 = await response3.json();
                const sensorsData = await sensorResponse.json();
                const boardsData = await boardResponse.json();

                // Use the JSON data to populate all of our useState variables
                setSensorList({
                    Sensor_ID: sensorsData.map((sensorsData: { Sensor_ID: number }) => sensorsData.Sensor_ID),
                    Sensor_Description: sensorsData.map((sensorsData: { Sensor_Description: number }) => sensorsData.Sensor_Description),
                    Units: sensorsData.map((sensorsData: { Units: number, Sensor_ID: number }) => (unitType && sensorsData.Sensor_ID == 2) ? "°F" : sensorsData.Units)
                });

                setBoardList({
                    Board_ID: boardsData.map((boardsData: { Board_ID: number }) => boardsData.Board_ID),
                    Board_Description: boardsData.map((boardsData: { Board_Description: number }) => boardsData.Board_Description),
                });

                const hours = data.map((data: { Interval_Timestamp: string }) => new Date(data.Interval_Timestamp).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    timeZone: "America/Chicago"
                }));

                let values = data.map((data: { Calculated_Reading: number }) => data.Calculated_Reading);

                if (unitType) {
                    if (sensor == "2") {
                        values = data.map((data: { Calculated_Reading: number }) => data.Calculated_Reading ? data.Calculated_Reading * 9 / 5 + 32 : null);
                    }
                }

                const days = data.map((data: { Interval_Timestamp: string }) => new Date(data.Interval_Timestamp).toLocaleDateString("en-US", {
                    dateStyle: "short",
                    timeZone: "America/Chicago"
                }));

                const dates = data.map((data: { Interval_Timestamp: string }) => new Date(data.Interval_Timestamp));

                const hours2 = data2.map((data: { Interval_Timestamp: string }) => new Date(data.Interval_Timestamp).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    timeZone: "America/Chicago"
                }));
                const values2 = data2.map((data: { Calculated_Reading: number }) => data.Calculated_Reading);
                const days2 = data2.map((data: { Interval_Timestamp: string }) => new Date(data.Interval_Timestamp).toLocaleDateString("en-US", {
                    dateStyle: "short",
                    timeZone: "America/Chicago"
                }));

                const dates2 = data2.map((data: { Interval_Timestamp: string }) => new Date(data.Interval_Timestamp));

                const hours3 = data3.map((data: { Interval_Timestamp: string }) => new Date(data.Interval_Timestamp).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    timeZone: "America/Chicago"
                }));
                const values3 = data3.map((data: { Calculated_Reading: number }) => data.Calculated_Reading);
                const days3 = data3.map((data: { Interval_Timestamp: string }) => new Date(data.Interval_Timestamp).toLocaleDateString("en-US", {
                    dateStyle: "short",
                    timeZone: "America/Chicago"
                }));

                const dates3 = data3.map((data: { Interval_Timestamp: string }) => new Date(data.Interval_Timestamp));



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


                // Handle potential API errors
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [time, sensor, board, sensor2, board2, sensor3, board3, unitType, interval, aggregation, aggregation2, aggregation3]); // These are the dependant variables


    // This function handles download functionality
    const download = async function () {

        // Switch case to download data in the selected format
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

            // Default is PNG
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


    // This function creates the charts
    function createChart() {
        switch (chartType) {

            // Line Chart
            case 1:
                return (
                    <PlotlyComponent
                        data={[{ x: dataset.dates, y: dataset.values, type: 'scatter', mode: 'lines+markers', marker: { color: color }, name: sensor && board ? sensorList.Sensor_Description[Number(sensor) - 1] : "", showlegend: sensor ? true : false, },
                        { x: dataset2.dates, y: dataset2.values, type: 'scatter', mode: 'lines+markers', marker: { color: color2 }, name: sensor2 && board2 ? sensorList.Sensor_Description[Number(sensor2) - 1] : "", showlegend: sensor2 ? true : false, yaxis: 'y2' },
                        { x: dataset3.dates, y: dataset3.values, type: 'scatter', mode: 'lines+markers', marker: { color: color3 }, name: sensor3 && board3 ? sensorList.Sensor_Description[Number(sensor3) - 1] : "", showlegend: sensor3 ? true : false, yaxis: 'y3' }
                        ]}
                        layout={{
                            autosize: true,
                            margin: { t: 20, l: 20, r: 20, b: 20 },
                            xaxis: { automargin: true, tickformat: '%m/%d/%Y %I:%M %p' },
                            yaxis: { color: color, side: "left", anchor: 'x', position: 0, automargin: true, title: { text: sensor && board ? sensorList.Units[Number(sensor) - 1] : "" } },
                            yaxis2: sensor2 ? { color: color2, side: "right", anchor: 'x', overlaying: "y", automargin: true, title: { text: sensor2 && board2 ? sensorList.Units[Number(sensor2) - 1] : "" } } : { side: "right", overlaying: "y", automargin: true, showticklabels: false, showline: false, showgrid: false, zeroline: false },
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

            // Scatter Plot
            case 2:
                return (
                    <PlotlyComponent
                        data={[{ x: dataset.dates, y: dataset.values, type: 'scatter', mode: 'markers', marker: { color: color }, name: sensor && board ? sensorList.Sensor_Description[Number(sensor) - 1] : "", showlegend: sensor ? true : false },
                        { x: dataset2.dates, y: dataset2.values, type: 'scatter', mode: 'markers', marker: { color: color2 }, name: sensor2 && board2 ? sensorList.Sensor_Description[Number(sensor2) - 1] : "", showlegend: sensor2 ? true : false, yaxis: 'y2' },
                        { x: dataset3.dates, y: dataset3.values, type: 'scatter', mode: 'markers', marker: { color: color3 }, name: sensor3 && board3 ? sensorList.Sensor_Description[Number(sensor3) - 1] : "", showlegend: sensor3 ? true : false, yaxis: 'y3' }
                        ]}
                        layout={{
                            autosize: true,
                            margin: { t: 20, l: 40, r: 20, b: 40 },
                            xaxis: { automargin: true, tickformat: '%m/%d/%Y %I:%M %p' },
                            yaxis: { color: color, side: "left", anchor: 'x', position: 0, automargin: true, title: { text: sensor && board ? sensorList.Units[Number(sensor) - 1] : "" } },
                            yaxis2: sensor2 ? { color: color2, side: "right", anchor: 'x', overlaying: "y", automargin: true, title: { text: sensor2 && board2 ? sensorList.Units[Number(sensor2) - 1] : "" } } : { side: "right", overlaying: "y", automargin: true, showticklabels: false, showline: false, showgrid: false, zeroline: false },
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

            // Bar Chart
            case 3:
                return (
                    <PlotlyComponent
                        data={[{ x: dataset.dates, y: dataset.values, type: 'bar', marker: { color: color }, name: sensor && board ? sensorList.Sensor_Description[Number(sensor) - 1] : "", showlegend: sensor ? true : false },
                        { x: dataset2.dates, y: dataset2.values, type: 'bar', marker: { color: color2 }, name: sensor2 && board2 ? sensorList.Sensor_Description[Number(sensor2) - 1] : "", showlegend: sensor2 ? true : false, yaxis: 'y2' },
                        { x: dataset3.dates, y: dataset3.values, type: 'bar', marker: { color: color3 }, name: sensor3 && board3 ? sensorList.Sensor_Description[Number(sensor3) - 1] : "", showlegend: sensor3 ? true : false, yaxis: 'y3' }
                        ]}
                        layout={{
                            autosize: true,
                            margin: { t: 20, l: 40, r: 20, b: 40 },
                            xaxis: { automargin: true, tickformat: '%m/%d/%Y %I:%M %p' },
                            yaxis: { color: color, side: "left", anchor: 'x', position: 0, automargin: true, title: { text: sensor && board ? sensorList.Units[Number(sensor) - 1] : "" } },
                            yaxis2: sensor2 ? { color: color2, side: "right", anchor: 'x', overlaying: "y", automargin: true, title: { text: sensor2 && board2 ? sensorList.Units[Number(sensor2) - 1] : "" } } : { side: "right", overlaying: "y", automargin: true, showticklabels: false, showline: false, showgrid: false, zeroline: false },
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

            // Heatmap
            case 4:
                return (
                    <PlotlyComponent
                        data={[{ x: [...dataset.days].reverse(), y: dataset.hours, z: dataset.values, type: 'heatmap', name: sensor && board ? sensorList.Sensor_Description[Number(sensor) - 1] : "" }]}
                        layout={{
                            autosize: true,
                            margin: { t: 20, l: 40, r: 20, b: 40 },
                            xaxis: { automargin: true, tickformat: '%m/%d/%Y %I:%M %p' },
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

            // Histogram
            case 5:
                return (
                    <PlotlyComponent
                        data={[{ x: dataset.values, type: 'histogram', marker: { color: color }, name: sensor && board ? sensorList.Sensor_Description[Number(sensor) - 1] : "", showlegend: sensor ? true : false },
                        { x: dataset2.values, type: 'histogram', marker: { color: color2 }, name: sensor2 && board2 ? sensorList.Sensor_Description[Number(sensor2) - 1] : "", showlegend: sensor2 ? true : false },
                        { x: dataset3.values, type: 'histogram', marker: { color: color3 }, name: sensor3 && board3 ? sensorList.Sensor_Description[Number(sensor3) - 1] : "", showlegend: sensor3 ? true : false }
                        ]}
                        layout={{
                            autosize: true,
                            margin: { t: 20, l: 40, r: 20, b: 40 },
                            xaxis: { automargin: true, tickformat: '%m/%d/%Y %I:%M %p' },
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

            // Violin
            case 6:
                return (
                    <PlotlyComponent
                        data={[{ x: sensor ? dataset.values : [], type: 'violin', marker: { color: color }, name: sensor && board ? sensorList.Sensor_Description[Number(sensor) - 1] : "", box: { visible: true }, meanline: { visible: true } },
                        { x: sensor2 ? dataset2.values : [], type: 'violin', marker: { color: color2 }, name: sensor2 && board2 ? sensorList.Sensor_Description[Number(sensor2) - 1] : "", box: { visible: true }, meanline: { visible: true } },
                        { x: sensor3 ? dataset3.values : [], type: 'violin', marker: { color: color3 }, name: sensor3 && board3 ? sensorList.Sensor_Description[Number(sensor3) - 1] : "", box: { visible: true }, meanline: { visible: true } }
                        ]}
                        layout={{
                            autosize: true,
                            margin: { t: 20, l: 40, r: 20, b: 40 },
                            xaxis: { automargin: true, tickformat: '%m/%d/%Y %I:%M %p' },
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

            // Default is line
            default:
                return (
                    <PlotlyComponent
                        data={[{ x: dataset.dates, y: dataset.values, type: 'scatter', mode: 'lines+markers', marker: { color: color }, name: sensor && board ? sensorList.Sensor_Description[Number(sensor) - 1] : "", showlegend: sensor ? true : false, },
                        { x: dataset2.dates, y: dataset2.values, type: 'scatter', mode: 'lines+markers', marker: { color: color2 }, name: sensor2 && board2 ? sensorList.Sensor_Description[Number(sensor2) - 1] : "", showlegend: sensor2 ? true : false, yaxis: 'y2' },
                        { x: dataset3.dates, y: dataset3.values, type: 'scatter', mode: 'lines+markers', marker: { color: color3 }, name: sensor3 && board3 ? sensorList.Sensor_Description[Number(sensor3) - 1] : "", showlegend: sensor3 ? true : false, yaxis: 'y3' }
                        ]}
                        layout={{
                            autosize: true,
                            margin: { t: 20, l: 20, r: 20, b: 20 },
                            xaxis: { automargin: true, tickformat: '%m/%d/%Y %I:%M %p' },
                            yaxis: { color: color, side: "left", anchor: 'x', position: 0, automargin: true, title: { text: sensor && board ? sensorList.Units[Number(sensor) - 1] : "" } },
                            yaxis2: sensor2 ? { color: color2, side: "right", anchor: 'x', overlaying: "y", automargin: true, title: { text: sensor2 && board3 ? sensorList.Units[Number(sensor2) - 1] : "" } } : { side: "right", overlaying: "y", automargin: true, showticklabels: false, showline: false, showgrid: false, zeroline: false },
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
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-50px)] lg:h-[calc(100vh-50px)] gap-2">
            <div className="w-full h-full grid gap-2 p-2 lg:grid-rows-[0.2fr_1fr_0.1fr] lg:grid-cols-4 md:grid-cols-2 grid-cols-1">

                {/* Time Section */}
                <div className="h-full w-full bg-slate-100 shadow-sm rounded-md">
                    <div className="p-3">
                        <h1 className="text-center text-xl font-semibold font-mono hidden md:block">Time</h1>
                        <h1 className="text-center text-xl font-semibold font-mono md:hidden block">Settings</h1>
                        <div className="grid md:grid-cols-3 grid-cols-2 gap-2">

                            {/* Chart type dropdown */}
                            <Dropdown className="md:hidden block w-full">
                                <DropdownTrigger>
                                    <Button className="shadow-sm w-full md:hidden block" radius="sm" variant="bordered" >
                                        Chart Type
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu onAction={(key) => setChartType(Number(key))}>

                                    <DropdownItem key={1}>Line Chart</DropdownItem>
                                    <DropdownItem key={2}>Scatter Plot</DropdownItem>
                                    <DropdownItem key={3}>Bar Chart</DropdownItem>
                                    <DropdownItem key={4}>Heatmap</DropdownItem>
                                    <DropdownItem key={5}>Histogram</DropdownItem>
                                    <DropdownItem key={6}>Violin Chart</DropdownItem>

                                </DropdownMenu>
                            </Dropdown>

                            {/* Quick time selection buttons */}
                            <Button onPress={() => setTime({
                                start: new Date(new Date().setDate(new Date().getDate() - 1)),
                                end: new Date()
                            })} className="shadow-sm hidden md:block" color="primary" radius="sm">Past Day</Button>
                            <Button onPress={() => setTime({
                                start: new Date(new Date().setDate(new Date().getDay() - 7)),
                                end: new Date()
                            })} className="shadow-sm hidden md:block" color="primary" radius="sm">Past Week</Button>
                            <Button onPress={() => setTime({
                                start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
                                end: new Date()
                            })} className="shadow-sm hidden md:block" color="primary" radius="sm">Past Month</Button>

                            {/* Quick time selection dropdown */}

                            <Dropdown className="md:hidden block w-full">
                                <DropdownTrigger>
                                    <Button className="shadow-sm md:hidden block w-full" radius="sm" variant="bordered" >
                                        Quick Time Range
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu>
                                    <DropdownItem onAction={() => setTime({
                                        start: new Date(new Date().setDate(new Date().getDate() - 1)),
                                        end: new Date()
                                    })} key={1}>Past Day</DropdownItem>
                                    <DropdownItem onAction={() => setTime({
                                        start: new Date(new Date().setDate(new Date().getDay() - 7)),
                                        end: new Date()
                                    })} key={2}>Past Week</DropdownItem>
                                    <DropdownItem onAction={() => setTime({
                                        start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
                                        end: new Date()
                                    })} key={3}>Past Month</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>

                            {/* Date picker */}
                            <div className="md:col-span-3 col-span-2">
                                <DateRangePicker
                                    className="flex items-center justify-center h-full"
                                    hideTimeZone
                                    label="Custom"
                                    defaultValue={{
                                        start: parseZonedDateTime(DateTime.fromJSDate(time.start).setZone('America/Chicago').toString().replace(/-[0-9]{2}:[0-9]{2}.*$/, "[UTC]")),
                                        end: parseZonedDateTime(DateTime.fromJSDate(time.end).setZone('America/Chicago').toString().replace(/-[0-9]{2}:[0-9]{2}.*$/, "[UTC]")),
                                    }}
                                    onChange={(range) => {
                                        if (range !== null) {
                                            setTime({
                                                start: range.start.toDate(),
                                                end: range.end.toDate(),
                                            });
                                        }
                                    }}
                                />
                            </div>
                            <div className="md:col-span-2">

                                {/* Time intervals */}
                                <Dropdown className=" w-full">
                                    <DropdownTrigger>
                                        <Button className="shadow-sm w-full" radius="sm" variant="bordered" >
                                            Time Intervals
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu onAction={(key) => setInterval(key.toString())}>
                                        <DropdownItem key={"none"}>No Aggregation</DropdownItem>
                                        <DropdownItem key={"halfhour"}>Half Hourly</DropdownItem>
                                        <DropdownItem key={"hourly"}>Hourly</DropdownItem>
                                        <DropdownItem key={"daily"}>Daily</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                            <div>

                                {/* Unit selection */}
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

                {/* Sensor Selection Section */}
                <div className="p-4 h-full md:col-span-2 bg-slate-100 shadow-sm rounded-md flex-grow lg:block hidden">
                    <h1 className="text-center text-xl font-semibold font-mono">Sensors</h1>
                    {/* Desktop Version */}
                    <div className="gap-2 grid-cols-6 lg:grid hidden w-full">
                        <div className="text-sm text-center"></div>
                        <div className="text-sm text-center">Aggregation Type</div>
                        <p className="text-sm text-center">Cluster Location</p>
                        <p className="text-sm text-center">Sensor</p>
                        <div></div>
                        <div></div>


                        <h1 className="text-right w-full">Sensor 1:   </h1>
                        <div>
                            <Dropdown className=" w-full">
                                <DropdownTrigger>
                                    <Button className="shadow-sm w-full" radius="sm" variant="bordered" size="sm">
                                        Aggregation type
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu onAction={(key) => setAggregation(key.toString())}>
                                    <DropdownItem key={"AVG"}>Average</DropdownItem>
                                    <DropdownItem key={"MEDIAN"}>Median</DropdownItem>
                                    <DropdownItem key={"MIN"}>Minimum</DropdownItem>
                                    <DropdownItem key={"MAX"}>Maximum</DropdownItem>
                                    <DropdownItem key={"SUM"}>Sum</DropdownItem>
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
                        <div>
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
                            <Button className="shadow-sm w-full" size="sm" onPress={onOpen} >Select Color</Button>
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
                        <div>
                            <Button onPress={() => [setSensor("1"), setBoard("0xa8610a34362d800f")]} className="shadow-sm" color="danger" radius="sm" size="sm">Reset</Button>
                        </div>


                        <h1 className="text-right w-full">Sensor 2:   </h1>
                        <div>
                            <Dropdown className=" w-full">
                                <DropdownTrigger>
                                    <Button className="shadow-sm w-full" radius="sm" variant="bordered" size="sm">
                                        Aggregation type
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu onAction={(key) => setAggregation2(key.toString())}>
                                    <DropdownItem key={"AVG"}>Average</DropdownItem>
                                    <DropdownItem key={"MEDIAN"}>Median</DropdownItem>
                                    <DropdownItem key={"MIN"}>Minimum</DropdownItem>
                                    <DropdownItem key={"MAX"}>Maximum</DropdownItem>
                                    <DropdownItem key={"SUM"}>Sum</DropdownItem>
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
                            <Button className="shadow-sm w-full" size="sm" onPress={onOpen2}>Select Color</Button>
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
                        <div>
                            <Button onPress={() => [setSensor2(null), setBoard2(null)]} className="shadow-sm" color="danger" radius="sm" size="sm">Clear</Button>
                        </div>


                        <h1 className="text-right w-full">Sensor 3:   </h1>
                        <div>
                            <Dropdown className=" w-full">
                                <DropdownTrigger>
                                    <Button className="shadow-sm w-full" radius="sm" variant="bordered" size="sm">
                                        Aggregation type
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu onAction={(key) => setAggregation3(key.toString())}>
                                    <DropdownItem key={"AVG"}>Average</DropdownItem>
                                    <DropdownItem key={"MEDIAN"}>Median</DropdownItem>
                                    <DropdownItem key={"MIN"}>Minimum</DropdownItem>
                                    <DropdownItem key={"MAX"}>Maximum</DropdownItem>
                                    <DropdownItem key={"SUM"}>Sum</DropdownItem>
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
                            <Button className="shadow-sm w-full" size="sm" onPress={onOpen3}>Select Color</Button>
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
                        <div>
                            <Button onPress={() => [setSensor3(null), setBoard3(null)]} className="shadow-sm" color="danger" radius="sm" size="sm">Clear</Button>
                        </div>

                    </div>



                </div>

                {/* Chart Type Section*/}
                <div className="p-4 h-full bg-slate-100 shadow-sm rounded-md hidden md:block">
                    <h1 className="text-center text-xl font-semibold font-mono">Chart Type</h1>
                    <div className="p-3">

                        <div className="grid lg:grid-cols-2 grid-cols-3 gap-2">
                            <Button onPress={() => setChartType(1)} className="shadow-sm" color="primary" radius="sm">Line Chart</Button>
                            <Button onPress={() => setChartType(2)} className="shadow-sm" color="primary" radius="sm">Scatter Plot</Button>
                            <Button onPress={() => setChartType(3)} className="shadow-sm" color="primary" radius="sm">Bar Chart</Button>
                            <Button onPress={() => setChartType(4)} className="shadow-sm" color="primary" radius="sm">Heatmap</Button>
                            <Button onPress={() => setChartType(5)} className="shadow-sm" color="primary" radius="sm">Histogram</Button>
                            <Button onPress={() => setChartType(6)} className="shadow-sm" color="primary" radius="sm">Violin Chart</Button>
                        </div>
                    </div>
                </div>

                <div className="p-4 h-full md:col-span-2 col-span-1 bg-slate-100 shadow-sm rounded-md flex-grow block lg:hidden">
                    <h1 className="text-center text-xl font-semibold font-mono">Sensors</h1>
                    {/* Mobile Version */}
                    <div className=" grid flex-grow gap-2 grid-cols-4 lg:hidden w-full">


                        <div></div>
                        <h1 className="text-center w-full">Sensor 1</h1>
                        <h1 className="text-center w-full">Sensor 2</h1>
                        <h1 className="text-center w-full">Sensor 3</h1>


                        <div className="text-sm text-right">Aggregation Type:   </div>

                        <div>
                            <Dropdown className=" w-full">
                                <DropdownTrigger>
                                    <Button className="shadow-sm w-full" radius="sm" variant="bordered" size="sm">
                                        Aggregation type
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu onAction={(key) => setAggregation(key.toString())}>
                                    <DropdownItem key={"AVG"}>Average</DropdownItem>
                                    <DropdownItem key={"MEDIAN"}>Median</DropdownItem>
                                    <DropdownItem key={"MIN"}>Minimum</DropdownItem>
                                    <DropdownItem key={"MAX"}>Maximum</DropdownItem>
                                    <DropdownItem key={"SUM"}>Sum</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>

                        <div>
                            <Dropdown className=" w-full">
                                <DropdownTrigger>
                                    <Button className="shadow-sm w-full" radius="sm" variant="bordered" size="sm">
                                        Aggregation type
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu onAction={(key) => setAggregation2(key.toString())}>
                                    <DropdownItem key={"AVG"}>Average</DropdownItem>
                                    <DropdownItem key={"MEDIAN"}>Median</DropdownItem>
                                    <DropdownItem key={"MIN"}>Minimum</DropdownItem>
                                    <DropdownItem key={"MAX"}>Maximum</DropdownItem>
                                    <DropdownItem key={"SUM"}>Sum</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>

                        <div>
                            <Dropdown className=" w-full">
                                <DropdownTrigger>
                                    <Button className="shadow-sm w-full" radius="sm" variant="bordered" size="sm">
                                        Aggregation type
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu onAction={(key) => setAggregation3(key.toString())}>
                                    <DropdownItem key={"AVG"}>Average</DropdownItem>
                                    <DropdownItem key={"MEDIAN"}>Median</DropdownItem>
                                    <DropdownItem key={"MIN"}>Minimum</DropdownItem>
                                    <DropdownItem key={"MAX"}>Maximum</DropdownItem>
                                    <DropdownItem key={"SUM"}>Sum</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>


                        <p className="text-sm text-right">Cluster Location:   </p>
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

                        <p className="text-sm text-right">Sensor:   </p>

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

                        <div></div>
                        <div>
                            <Button className="shadow-sm w-full" size="sm" onPress={onOpen} >Select Color</Button>
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

                        <div>
                            <Button className="shadow-sm w-full" size="sm" onPress={onOpen2}>Select Color</Button>
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

                        <div>
                            <Button className="shadow-sm w-full" size="sm" onPress={onOpen3}>Select Color</Button>
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
                        <div></div>
                        <div>
                            <Button onPress={() => [setSensor("1"), setBoard("0xa8610a34362d800f")]} className="shadow-sm w-full" color="danger" radius="sm" size="sm">Reset</Button>
                        </div>

                        <div>
                            <Button onPress={() => [setSensor2(null), setBoard2(null)]} className="shadow-sm w-full" color="danger" radius="sm" size="sm">Clear</Button>
                        </div>


                        <div>
                            <Button onPress={() => [setSensor3(null), setBoard3(null)]} className="shadow-sm w-full" color="danger" radius="sm" size="sm">Clear</Button>
                        </div>


                    </div>
                </div>

                {/* Chart Display Area */}
                <div className="md:row-span-2 col-span-1 p-4 h-full  bg-slate-100 shadow-sm rounded-md lg:col-span-3 md:col-span-2 flex flex-col">
                    <h1 className="text-center text-xl font-semibold font-mono">Chart</h1>
                    <div className="flex-grow h-full w-full min-h-[400px]" id="plotly-plot">

                        {/* Call the chart creation function */}
                        {createChart()}
                    </div>
                </div>

                {/* Statistics Section */}
                <div className="p-4 h-full bg-slate-100 shadow-sm rounded-md flex-col hidden lg:flex">
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

                        {/* Box Plot */}
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

                {/* Downloads Section */}
                <div className="p-4 h-full bg-slate-100 shadow-sm rounded-md lg:col-span-1 md:col-span-2 sm:col-span-1">
                    <h1 className="text-center text-xl font-semibold font-mono">Downloads</h1>
                    <div className="p-3">
                        <div className="grid grid-cols-5 gap-2">
                            <Button className="col-span-2" color="primary" radius="sm" onPress={download}>Download {downloadType}</Button>

                            {/* Download format selection */}
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

                            {/* Help drawer */}
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
        </div>
    );
}

export default Reports;