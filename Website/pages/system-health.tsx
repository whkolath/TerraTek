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


const HealthPage  = () => {

    // // Custom data types
    // type DataSet = {
    //     dates: Array<Date>;
    //     values: Array<number>;
    //     days: Array<Date>;
    //     hours: Array<Date>;
    // }

    // type SensorList = {
    //     Sensor_ID: Array<number>;
    //     Sensor_Description: Array<string>;
    //     Units: Array<string>;
    // }

    // type BoardList = {
    //     Board_ID: Array<string>;
    //     Board_Description: Array<string>;
    // }

    // const [unitType, setUnitType] = useState(1);
    // const [graphDiv, setGraphDiv] = useState<HTMLElement | null>(null);

    // // States of the color modals and help drawer
    // const { isOpen: isOpen, onOpen: onOpen, onClose: onClose } = useDisclosure();
    // const { isOpen: isOpen2, onOpen: onOpen2, onClose: onClose2 } = useDisclosure();
    // const { isOpen: isOpen3, onOpen: onOpen3, onClose: onClose3 } = useDisclosure();
    // const { isOpen: isOpenHelp, onOpen: onOpenHelp, onClose: onCloseHelp } = useDisclosure();

    // // States of the datasets
    // const [dataset, setDataset] = useState<DataSet>({
    //     dates: [],
    //     values: [],
    //     days: [],
    //     hours: [],
    // });

    // const [dataset2, setDataset2] = useState<DataSet>({
    //     dates: [],
    //     values: [],
    //     days: [],
    //     hours: [],
    // });

    // const [dataset3, setDataset3] = useState<DataSet>({
    //     dates: [],
    //     values: [],
    //     days: [],
    //     hours: [],
    // });

    // // Download type state
    // const [downloadType, setDownload] = useState("PNG");

    // // Selected time span
    // const [time, setTime] = useState("744");

    // // Sensor and board selection states
    // const [sensor, setSensor] = useState("2");
    // const [board, setBoard] = useState("0xa8610a34362d800f");

    // const [sensor2, setSensor2] = useState<string | null>(null);
    // const [board2, setBoard2] = useState<string | null>(null);

    // const [sensor3, setSensor3] = useState<string | null>(null);
    // const [board3, setBoard3] = useState<string | null>(null);


    // // Chart type
    // const [chartType, setChartType] = useState(1);

    // // Default colors
    // const [color, setColor] = useState('#3f51b5');
    // const [color2, setColor2] = useState('#f44336');
    // const [color3, setColor3] = useState('#4caf50');

    // // List of sensors, will be populated from database
    // const [sensorList, setSensorList] = useState<SensorList>({
    //     Sensor_ID: [],
    //     Sensor_Description: [],
    //     Units: []
    // })

    // // lists of boards, will be populated from database
    // const [boardList, setBoardList] = useState<BoardList>({
    //     Board_ID: [],
    //     Board_Description: [],
    // })


    // // This is where the website will react to changes the user makes. Ie. a different sensor is selected
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {

    //             // Fetch the data from the API
    //             const [response, response2, response3, sensorResponse, boardResponse] = await Promise.all([
    //                 fetch(`/api/hourly/${time}/${sensor}`),
    //                 fetch(`/api/hourly/${time}/${sensor2}`),
    //                 fetch(`/api/hourly/${time}/${sensor3}`),
    //                 fetch(`/api/sensors`),
    //                 fetch(`/api/boards`)

    //             ]);

    //             // Parse the JSON
    //             const data = await response.json();
    //             const data2 = await response2.json();
    //             const data3 = await response3.json();
    //             const sensorsData = await sensorResponse.json();
    //             const boardsData = await boardResponse.json();

    //             // Use the JSON data to populate all of our useState variables
    //             setSensorList({
    //                 Sensor_ID: sensorsData.map((sensorsData: { Sensor_ID: number }) => sensorsData.Sensor_ID),
    //                 Sensor_Description: sensorsData.map((sensorsData: { Sensor_Description: number }) => sensorsData.Sensor_Description),
    //                 Units: sensorsData.map((sensorsData: { Units: number, Sensor_ID: number }) => (unitType && sensorsData.Sensor_ID == 2) ? "°F" : sensorsData.Units)
    //             });

    //             setBoardList({
    //                 Board_ID: boardsData.map((boardsData: { Board_ID: number }) => boardsData.Board_ID),
    //                 Board_Description: boardsData.map((boardsData: { Board_Description: number }) => boardsData.Board_Description),
    //             });

    //             const hours = data.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp).toLocaleTimeString("en-US", {
    //                 hour: "numeric",
    //                 minute: "numeric",
    //                 timeZone: "America/Chicago"
    //             }));

    //             let values = data.map((data: { Average_Reading: number }) => data.Average_Reading);

    //             if (unitType) {
    //                 if (sensor == "2") {
    //                     values = data.map((data: { Average_Reading: number }) => data.Average_Reading ? data.Average_Reading * 9 / 5 + 32 : null);
    //                 }
    //             }

    //             const days = data.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp).toLocaleDateString("en-US", {
    //                 dateStyle: "short",
    //                 timeZone: "America/Chicago"
    //             }));

    //             const dates = data.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp));

    //             const hours2 = data2.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp).toLocaleTimeString("en-US", {
    //                 hour: "numeric",
    //                 minute: "numeric",
    //                 timeZone: "America/Chicago"
    //             }));
    //             const values2 = data2.map((data: { Average_Reading: number }) => data.Average_Reading);
    //             const days2 = data2.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp).toLocaleDateString("en-US", {
    //                 dateStyle: "short",
    //                 timeZone: "America/Chicago"
    //             }));

    //             const dates2 = data2.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp));

    //             const hours3 = data3.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp).toLocaleTimeString("en-US", {
    //                 hour: "numeric",
    //                 minute: "numeric",
    //                 timeZone: "America/Chicago"
    //             }));
    //             const values3 = data3.map((data: { Average_Reading: number }) => data.Average_Reading);
    //             const days3 = data3.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp).toLocaleDateString("en-US", {
    //                 dateStyle: "short",
    //                 timeZone: "America/Chicago"
    //             }));

    //             const dates3 = data3.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp));



    //             setDataset({
    //                 dates: dates,
    //                 values: values,
    //                 days: days,
    //                 hours: hours,
    //             });

    //             setDataset2({
    //                 dates: dates2,
    //                 values: values2,
    //                 days: days2,
    //                 hours: hours2,
    //             });

    //             setDataset3({
    //                 dates: dates3,
    //                 values: values3,
    //                 days: days3,
    //                 hours: hours3,
    //             });


    //             // Handle potential API errors
    //         } catch (error) {
    //             console.error("Error fetching data:", error);
    //         }
    //     };

    //     fetchData();
    // }, [time, sensor, board, sensor2, board2, sensor3, board3, unitType]); // These are the dependant variables


    // // This function handles download functionality
    // const download = async function () {

    //     // Switch case to download data in the selected format
    //     switch (downloadType) {
    //         case "CSV":
    //             try {
    //                 const csvRows = [];
    //                 const sensorName = sensorList.Sensor_Description[Number(sensor) - 1]
    //                 csvRows.push(`Date,${sensorName}`);

    //                 for (let i = 0; i < dataset.dates.length; i++) {
    //                     csvRows.push([dataset.dates[i], dataset.values[i] ? Number(dataset.values[i]).toFixed(4) : ""].join(','))
    //                 }

    //                 const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    //                 const url = URL.createObjectURL(blob);
    //                 const a = document.createElement('a');
    //                 a.href = url;
    //                 a.download = 'download.csv';
    //                 a.click();
    //             } catch (error) {
    //                 console.error("Error fetching data:", error);
    //             }
    //             break;

    //         case "JSON":
    //             try {
    //                 const dataArray = [];
    //                 for (let i = 0; i < dataset.dates.length; i++) {
    //                     dataArray.push([dataset.dates[i], dataset.values[i] ? Number(dataset.values[i]).toFixed(4) : null])
    //                 }
    //                 const jsonData = JSON.stringify(dataArray);
    //                 const blob = new Blob([jsonData], { type: 'text/json' });
    //                 const url = URL.createObjectURL(blob);
    //                 const a = document.createElement('a');
    //                 a.href = url;
    //                 a.download = 'download.json';
    //                 a.click();
    //             } catch (error) {
    //                 console.error("Error fetching data:", error)
    //             }
    //             break;

    //         case "JPEG":
    //             if (graphDiv) {
    //                 try {
    //                     const Plotly = await import("plotly.js-dist");
    //                     const dataUrl = await Plotly.toImage(graphDiv, {
    //                         format: "jpeg",
    //                         height: 1080,
    //                         width: 1920,
    //                     });

    //                     const link = document.createElement("a");
    //                     link.href = dataUrl;
    //                     link.download = "chart.jpeg";
    //                     document.body.appendChild(link);
    //                     link.click();
    //                     document.body.removeChild(link);
    //                 } catch (error) {
    //                     console.error("Error fetching data:", error);
    //                 }
    //             }
    //             break;

    //         // Default is PNG
    //         default:
    //             if (graphDiv) {
    //                 try {
    //                     const Plotly = await import("plotly.js-dist");
    //                     const dataUrl = await Plotly.toImage(graphDiv, {
    //                         format: "png",
    //                         height: 1080,
    //                         width: 1920,
    //                     });

    //                     const link = document.createElement("a");
    //                     link.href = dataUrl;
    //                     link.download = "chart.png";
    //                     document.body.appendChild(link);
    //                     link.click();
    //                     document.body.removeChild(link);
    //                 } catch (error) {
    //                     console.error("Error fetching data:", error);
    //                 }
    //             }
    //             break;

    //     }
    // }


    // // This function creates the charts
    // function createCart() {
    //     switch (chartType) {

    //         // Line Chart
    //         case 1:
    //             return (
    //                 <PlotlyComponent
    //                     data={[{ x: dataset.dates, y: dataset.values, type: 'scatter', mode: 'lines+markers', marker: { color: color }, name: sensor ? sensorList.Sensor_Description[Number(sensor) - 1] : "", showlegend: sensor ? true : false, },
    //                     { x: dataset2.dates, y: dataset2.values, type: 'scatter', mode: 'lines+markers', marker: { color: color2 }, name: sensor2 ? sensorList.Sensor_Description[Number(sensor2) - 1] : "", showlegend: sensor2 ? true : false, yaxis: 'y2' },
    //                     { x: dataset3.dates, y: dataset3.values, type: 'scatter', mode: 'lines+markers', marker: { color: color3 }, name: sensor3 ? sensorList.Sensor_Description[Number(sensor3) - 1] : "", showlegend: sensor3 ? true : false, yaxis: 'y3' }
    //                     ]}
    //                     layout={{
    //                         autosize: true,
    //                         margin: { t: 20, l: 20, r: 20, b: 20 },
    //                         xaxis: { automargin: true },
    //                         yaxis: { color: color, side: "left", anchor: 'x', position: 0, automargin: true, title: { text: sensor ? sensorList.Units[Number(sensor) - 1] : "" } },
    //                         yaxis2: sensor2 ? { color: color2, side: "right", anchor: 'x', overlaying: "y", automargin: true, title: { text: sensor2 ? sensorList.Units[Number(sensor2) - 1] : "" } } : { side: "right", overlaying: "y", automargin: true, showticklabels: false, showline: false, showgrid: false, zeroline: false },
    //                         yaxis3: sensor3 ? { color: color3, side: "right", anchor: "free", overlaying: "y", position: 1.15, automargin: true, title: { text: sensorList.Units[Number(sensor3) - 1] } } : { side: "right", overlaying: "y", automargin: true, showticklabels: false, showline: false, showgrid: false, zeroline: false },
    //                         paper_bgcolor: '#f1f5f9',
    //                         plot_bgcolor: '#f1f5f9',
    //                         showlegend: true,
    //                         legend: {
    //                             x: 1,
    //                             xanchor: 'right',
    //                             y: 1
    //                         }

    //                     }}
    //                     config={{ displayModeBar: false, scrollZoom: true, responsive: true }}
    //                     onInitialized={(_, graphDiv) => setGraphDiv(graphDiv)}
    //                     useResizeHandler={true}
    //                     style={{ width: "100%", height: "100%" }}

    //                 />
    //             );

    //         // Scatter Plot
    //         case 2:
    //             return (
    //                 <PlotlyComponent
    //                     data={[{ x: dataset.dates, y: dataset.values, type: 'scatter', mode: 'markers', marker: { color: color }, name: sensor ? sensorList.Sensor_Description[Number(sensor) - 1] : "", showlegend: sensor ? true : false },
    //                     { x: dataset2.dates, y: dataset2.values, type: 'scatter', mode: 'markers', marker: { color: color2 }, name: sensor2 ? sensorList.Sensor_Description[Number(sensor2) - 1] : "", showlegend: sensor2 ? true : false, yaxis: 'y2' },
    //                     { x: dataset3.dates, y: dataset3.values, type: 'scatter', mode: 'markers', marker: { color: color3 }, name: sensor3 ? sensorList.Sensor_Description[Number(sensor3) - 1] : "", showlegend: sensor3 ? true : false, yaxis: 'y3' }
    //                     ]}
    //                     layout={{
    //                         autosize: true,
    //                         margin: { t: 20, l: 40, r: 20, b: 40 },
    //                         xaxis: { automargin: true },
    //                         yaxis: { color: color, side: "left", anchor: 'x', position: 0, automargin: true, title: { text: sensor ? sensorList.Units[Number(sensor) - 1] : "" } },
    //                         yaxis2: sensor2 ? { color: color2, side: "right", anchor: 'x', overlaying: "y", automargin: true, title: { text: sensor2 ? sensorList.Units[Number(sensor2) - 1] : "" } } : { side: "right", overlaying: "y", automargin: true, showticklabels: false, showline: false, showgrid: false, zeroline: false },
    //                         yaxis3: sensor3 ? { color: color3, side: "right", anchor: "free", overlaying: "y", position: 1.15, automargin: true, title: { text: sensorList.Units[Number(sensor3) - 1] } } : { side: "right", overlaying: "y", automargin: true, showticklabels: false, showline: false, showgrid: false, zeroline: false },
    //                         paper_bgcolor: '#f1f5f9',
    //                         plot_bgcolor: '#f1f5f9',
    //                         showlegend: true,
    //                         legend: {
    //                             x: 1,
    //                             xanchor: 'right',
    //                             y: 1
    //                         }

    //                     }}
    //                     config={{ displayModeBar: false, scrollZoom: true, responsive: true }}
    //                     onInitialized={(_, graphDiv) => setGraphDiv(graphDiv)}
    //                     useResizeHandler={true}
    //                     style={{ width: "100%", height: "100%" }}

    //                 />
    //             );

    //         // Bar Chart
    //         case 3:
    //             return (
    //                 <PlotlyComponent
    //                     data={[{ x: dataset.dates, y: dataset.values, type: 'bar', marker: { color: color }, name: sensor ? sensorList.Sensor_Description[Number(sensor) - 1] : "", showlegend: sensor ? true : false },
    //                     { x: dataset2.dates, y: dataset2.values, type: 'bar', marker: { color: color2 }, name: sensor2 ? sensorList.Sensor_Description[Number(sensor2) - 1] : "", showlegend: sensor2 ? true : false, yaxis: 'y2' },
    //                     { x: dataset3.dates, y: dataset3.values, type: 'bar', marker: { color: color3 }, name: sensor3 ? sensorList.Sensor_Description[Number(sensor3) - 1] : "", showlegend: sensor3 ? true : false, yaxis: 'y3' }
    //                     ]}
    //                     layout={{
    //                         autosize: true,
    //                         margin: { t: 20, l: 40, r: 20, b: 40 },
    //                         xaxis: { automargin: true },
    //                         yaxis: { color: color, side: "left", anchor: 'x', position: 0, automargin: true, title: { text: sensor ? sensorList.Units[Number(sensor) - 1] : "" } },
    //                         yaxis2: sensor2 ? { color: color2, side: "right", anchor: 'x', overlaying: "y", automargin: true, title: { text: sensor2 ? sensorList.Units[Number(sensor2) - 1] : "" } } : { side: "right", overlaying: "y", automargin: true, showticklabels: false, showline: false, showgrid: false, zeroline: false },
    //                         yaxis3: sensor3 ? { color: color3, side: "right", anchor: "free", overlaying: "y", position: 1.15, automargin: true, title: { text: sensorList.Units[Number(sensor3) - 1] } } : { side: "right", overlaying: "y", automargin: true, showticklabels: false, showline: false, showgrid: false, zeroline: false },
    //                         paper_bgcolor: '#f1f5f9',
    //                         plot_bgcolor: '#f1f5f9',
    //                         showlegend: true,
    //                         legend: {
    //                             x: 1,
    //                             xanchor: 'right',
    //                             y: 1
    //                         }

    //                     }}
    //                     config={{ displayModeBar: false, scrollZoom: true, responsive: true }}
    //                     onInitialized={(_, graphDiv) => setGraphDiv(graphDiv)}
    //                     useResizeHandler={true}
    //                     style={{ width: "100%", height: "100%" }}

    //                 />
    //             );

    //         // Heatmap
    //         case 4:
    //             return (
    //                 <PlotlyComponent
    //                     data={[{ x: dataset.days, y: dataset.hours, z: dataset.values, type: 'heatmap', name: sensor ? sensorList.Sensor_Description[Number(sensor) - 1] : "" }]}
    //                     layout={{
    //                         autosize: true,
    //                         margin: { t: 20, l: 40, r: 20, b: 40 },
    //                         xaxis: { automargin: true },
    //                         yaxis: { automargin: true },
    //                         paper_bgcolor: '#f1f5f9',
    //                         plot_bgcolor: '#f1f5f9',
    //                         showlegend: true
    //                     }}
    //                     config={{ displayModeBar: false, scrollZoom: true, responsive: true }}
    //                     onInitialized={(_, graphDiv) => setGraphDiv(graphDiv)}
    //                     useResizeHandler={true}
    //                     style={{ width: "100%", height: "100%" }}
    //                 />
    //             );

    //         // Histogram
    //         case 5:
    //             return (
    //                 <PlotlyComponent
    //                     data={[{ x: dataset.values, type: 'histogram', marker: { color: color }, name: sensor ? sensorList.Sensor_Description[Number(sensor) - 1] : "", showlegend: sensor ? true : false },
    //                     { x: dataset2.values, type: 'histogram', marker: { color: color2 }, name: sensor2 ? sensorList.Sensor_Description[Number(sensor2) - 1] : "", showlegend: sensor2 ? true : false },
    //                     { x: dataset3.values, type: 'histogram', marker: { color: color3 }, name: sensor3 ? sensorList.Sensor_Description[Number(sensor3) - 1] : "", showlegend: sensor3 ? true : false }
    //                     ]}
    //                     layout={{
    //                         autosize: true,
    //                         margin: { t: 20, l: 40, r: 20, b: 40 },
    //                         xaxis: { automargin: true },
    //                         yaxis: { automargin: true },
    //                         paper_bgcolor: '#f1f5f9',
    //                         plot_bgcolor: '#f1f5f9',
    //                         showlegend: true,
    //                         legend: {
    //                             x: 1,
    //                             xanchor: 'right',
    //                             y: 1
    //                         }

    //                     }}
    //                     config={{ displayModeBar: false, scrollZoom: true, responsive: true }}
    //                     onInitialized={(_, graphDiv) => setGraphDiv(graphDiv)}
    //                     useResizeHandler={true}
    //                     style={{ width: "100%", height: "100%" }}

    //                 />
    //             );

    //         // Violin
    //         case 6:
    //             return (
    //                 <PlotlyComponent
    //                     data={[{ x: sensor ? dataset.values : [], type: 'violin', marker: { color: color }, name: sensor ? sensorList.Sensor_Description[Number(sensor) - 1] : "", box: { visible: true }, meanline: { visible: true } },
    //                     { x: sensor2 ? dataset2.values : [], type: 'violin', marker: { color: color2 }, name: sensor2 ? sensorList.Sensor_Description[Number(sensor2) - 1] : "", box: { visible: true }, meanline: { visible: true } },
    //                     { x: sensor3 ? dataset3.values : [], type: 'violin', marker: { color: color3 }, name: sensor3 ? sensorList.Sensor_Description[Number(sensor3) - 1] : "", box: { visible: true }, meanline: { visible: true } }
    //                     ]}
    //                     layout={{
    //                         autosize: true,
    //                         margin: { t: 20, l: 40, r: 20, b: 40 },
    //                         xaxis: { automargin: true },
    //                         yaxis: { automargin: true },
    //                         paper_bgcolor: '#f1f5f9',
    //                         plot_bgcolor: '#f1f5f9',
    //                         showlegend: false,
    //                         legend: {
    //                             x: 1,
    //                             xanchor: 'right',
    //                             y: 1
    //                         }

    //                     }}
    //                     config={{ displayModeBar: false, scrollZoom: true, responsive: true }}
    //                     onInitialized={(_, graphDiv) => setGraphDiv(graphDiv)}
    //                     useResizeHandler={true}
    //                     style={{ width: "100%", height: "100%" }}

    //                 />
    //             );

    //         // Default is line
    //         default:
    //             return (
    //                 <PlotlyComponent
    //                     data={[{ x: dataset.dates, y: dataset.values, type: 'scatter', mode: 'lines+markers', marker: { color: color }, name: sensor ? sensorList.Sensor_Description[Number(sensor) - 1] : "", showlegend: sensor ? true : false, },
    //                     { x: dataset2.dates, y: dataset2.values, type: 'scatter', mode: 'lines+markers', marker: { color: color2 }, name: sensor2 ? sensorList.Sensor_Description[Number(sensor2) - 1] : "", showlegend: sensor2 ? true : false, yaxis: 'y2' },
    //                     { x: dataset3.dates, y: dataset3.values, type: 'scatter', mode: 'lines+markers', marker: { color: color3 }, name: sensor3 ? sensorList.Sensor_Description[Number(sensor3) - 1] : "", showlegend: sensor3 ? true : false, yaxis: 'y3' }
    //                     ]}
    //                     layout={{
    //                         autosize: true,
    //                         margin: { t: 20, l: 20, r: 20, b: 20 },
    //                         xaxis: { automargin: true },
    //                         yaxis: { color: color, side: "left", anchor: 'x', position: 0, automargin: true, title: { text: sensor ? sensorList.Units[Number(sensor) - 1] : "" } },
    //                         yaxis2: sensor2 ? { color: color2, side: "right", anchor: 'x', overlaying: "y", automargin: true, title: { text: sensor2 ? sensorList.Units[Number(sensor2) - 1] : "" } } : { side: "right", overlaying: "y", automargin: true, showticklabels: false, showline: false, showgrid: false, zeroline: false },
    //                         yaxis3: sensor3 ? { color: color3, side: "right", anchor: "free", overlaying: "y", position: 1.15, automargin: true, title: { text: sensorList.Units[Number(sensor3) - 1] } } : { side: "right", overlaying: "y", automargin: true, showticklabels: false, showline: false, showgrid: false, zeroline: false },
    //                         paper_bgcolor: '#f1f5f9',
    //                         plot_bgcolor: '#f1f5f9',
    //                         showlegend: true,
    //                         legend: {
    //                             x: 1,
    //                             xanchor: 'right',
    //                             y: 1
    //                         }

    //                     }}
    //                     config={{ displayModeBar: false, scrollZoom: true, responsive: true }}
    //                     onInitialized={(_, graphDiv) => setGraphDiv(graphDiv)}
    //                     useResizeHandler={true}
    //                     style={{ width: "100%", height: "100%" }}

    //                 />
    //             );
        
 

    return (
        <div className="w-full h-full grid gap-2 p-2 grid-rows-2 grid-cols-5">

             {/* Data Rate */}
             <div className="p-4 h-full row-span-2 bg-slate-100 shadow-sm rounded-md flex-grow">
                <h1 className="text-center text-xl font-semibold font-mono">Sensor List</h1>
                
            </div>

            {/* Board 1 */}
            <div className="h-full bg-slate-100 col-span-2 shadow-sm rounded-md">
                <div className="p-3">
                    <h1 className="text-center text-xl font-semibold font-mono">Board 1</h1>
                    
                </div>
            </div>

             {/* Board 2 */}
             <div className="h-full bg-slate-100 col-span-2 shadow-sm rounded-md">
                <div className="p-3">
                    <h1 className="text-center text-xl font-semibold font-mono">Board 1</h1>
                    
                </div>
            </div>

            {/* Data Rate */}
            <div className="p-4 h-full col-span-4 bg-slate-100 shadow-sm rounded-md flex-grow">
                <h1 className="text-center text-xl font-semibold font-mono">Transmission Rate</h1>
                
            </div>
            

        </div>
    );
}

export default HealthPage;