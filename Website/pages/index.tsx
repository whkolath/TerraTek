import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button
} from "@heroui/react";
import Link from "next/link";

export const PlotlyComponent = dynamic(() => import('react-plotly.js'), { ssr: false });
const Plotly = dynamic(() => import("react-plotly.js"), { ssr: false });

const Dashboard = () => {
    type DataSet = {
        dates: Date[];
        values: number[];
        days: string[];
        hours: string[];
    };

    type SensorList = {
        Sensor_ID: number[];
        Sensor_Description: string[];
        Units: string[];
    };

    type BoardList = {
        Board_ID: string[];
        Board_Description: string[];
    };

    const [unitType, setUnitType] = useState(1);
    const [graphDiv, setGraphDiv] = useState<HTMLElement | null>(null);

    const [chartType, setChartType] = useState(1);

    const [color, setColor] = useState('#3f51b5');
    const [color2, setColor2] = useState('#f44336');
    const [color3, setColor3] = useState('#4caf50');

    const [dataset, setDataset] = useState<DataSet>({ dates: [], values: [], days: [], hours: [] });
    const [dataset2, setDataset2] = useState<DataSet>({ dates: [], values: [], days: [], hours: [] });
    const [dataset3, setDataset3] = useState<DataSet>({ dates: [], values: [], days: [], hours: [] });

    const [value, setValue] = useState("744");
    const [sensor, setSensor] = useState("2");
    const [board, setBoard] = useState("0xa8610a34362d800f");

    const [sensor2, setSensor2] = useState<string | null>(null);
    const [board2, setBoard2] = useState<string | null>(null);
    const [sensor3, setSensor3] = useState<string | null>(null);
    const [board3, setBoard3] = useState<string | null>(null);

    const [sensorList, setSensorList] = useState<SensorList>({ Sensor_ID: [], Sensor_Description: [], Units: [] });
    const [boardList, setBoardList] = useState<BoardList>({ Board_ID: [], Board_Description: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const requests = [
                    fetch(`/api/hourly/${value}/${sensor}`).then((res) => res.json()),
                    sensor2 ? fetch(`/api/hourly/${value}/${sensor2}`).then((res) => res.json()) : Promise.resolve([]),
                    sensor3 ? fetch(`/api/hourly/${value}/${sensor3}`).then((res) => res.json()) : Promise.resolve([]),
                    fetch(`/api/sensors`).then((res) => res.json()),
                    fetch(`/api/boards`).then((res) => res.json()),
                ];

                const [data, data2, data3, sensorsData, boardsData] = await Promise.all(requests);

                const formatData = (data: any[]) => ({
                    dates: data.map((d) => new Date(d.Hourly_Timestamp)),
                    values: data.map((d) => d.Average_Reading),
                    days: data.map((d) => new Date(d.Hourly_Timestamp).toLocaleDateString("en-US", { dateStyle: "short", timeZone: "America/Chicago" })),
                    hours: data.map((d) => new Date(d.Hourly_Timestamp).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", timeZone: "America/Chicago" })),
                });

                setDataset(formatData(data));
                setDataset2(formatData(data2));
                setDataset3(formatData(data3));

                setSensorList({
                    Sensor_ID: sensorsData.map((s: { Sensor_ID: number }) => s.Sensor_ID),
                    Sensor_Description: sensorsData.map((s: { Sensor_Description: string }) => s.Sensor_Description),
                    Units: sensorsData.map((s: { Units: string }) => s.Units),
                });

                setBoardList({
                    Board_ID: boardsData.map((b: { Board_ID: string }) => b.Board_ID),
                    Board_Description: boardsData.map((b: { Board_Description: string }) => b.Board_Description),
                });

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [value, sensor, board, sensor2, board2, sensor3, board3]);
    function createCart() {
            switch (chartType) {
    
                // Line Chart
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
    
                // Scatter Plot
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
    
                // Bar Chart
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
    
                // Heatmap
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
    
                // Histogram
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
    
                // Violin
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
    
                // Default is line
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
        
        <div className="w-full h-full flex flex-col">
            {/* Header */}
            <div className="h-16 bg-gray-900 text-white flex items-center justify-center font-bold text-xl">
                LOGO
            </div>

        <div className="h-4 w-4 bg-slate-100 text-black flex items-left">
    {/* Sidebar */}
    <Dropdown className="w-full">
        <DropdownTrigger>
            <Button className="shadow-sm w-full" radius="sm" variant="bordered" size="sm">
                Pages
            </Button>
        </DropdownTrigger>
        <DropdownMenu>
            <DropdownItem key="tanks">
                <Dropdown className="w-full">
                    <DropdownTrigger>
                        <Button className="w-full items-left" variant="light" size="sm">
                            Tanks
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                        <DropdownItem key="fresh-water">
                            <Link href="/tank1">Fresh Water</Link>
                        </DropdownItem>
                        <DropdownItem key="grey-water">
                            <Link href="/tank2">Grey Water</Link>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </DropdownItem>
            <DropdownItem key="condition"><Link href="/weather">Condition</Link></DropdownItem>
            <DropdownItem key="reports"><Link href="/reports">Reports</Link></DropdownItem>
            <DropdownItem key="comments">Comments</DropdownItem>
        </DropdownMenu>
    </Dropdown>
</div>



                {/* Main Content */}
                <div className="flex-grow p-4 grid grid-cols-2 gap-4">
                    {/* Fresh Water Section */}
                    <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center">
                        <h2 className="text-lg font-bold">Fresh Water</h2>
                        <div className="w-5 h-5 bg-blue-300 rounded-full mt-4"></div>
                        <div className="mt-2">Level Percentage</div>
                        <div className="flex justify-center mb-4">
                                                        <Image
                                                            src="/tank_UI.svg"
                                                            alt="Tank SVG"
                                                            width={100}
                                                            height={100}
                                                        />
                                                    </div>
                        <div className="w-full h-40 mt-4 bg-gray-200 flex items-center justify-center">
                         {/* Chart Type Section*/}
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

            {/* Chart Display Area */}
            <div className="row-span-8 col-span-8 p-4 h-full  bg-slate-100 shadow-sm rounded-md lg:col-span-3 md:col-span-2 flex flex-col">
                <h1 className="text-center text-xl font-semibold font-mono">Chart</h1>
                <div className="flex-grow w-full h-0" id="plotly-plot">

                    {/* Call the chart creation function */}
                    {createCart()}
                </div>
            </div>
                            
                        </div>
                    </div>

                    {/* Grey Water Section */}
                    <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center">
                        <h2 className="text-lg font-bold">Grey Water</h2>
                        <div className="w-5 h-5 bg-gray-400 rounded-full mt-4"></div>
                        <div className="mt-2">Level Percentage</div>
                        <div className="flex justify-center mb-4">
                                                        <Image
                                                            src="/tank_UI.svg"
                                                            alt="Tank SVG"
                                                            width={100}
                                                            height={100}
                                                        />
                                                    </div>
                        <div className="w-full h-40 mt-4 bg-gray-200 flex items-center justify-center">
                            {/* Chart Type Section*/}
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

            {/* Chart Display Area */}
            <div className="row-span-2 col-span-1 p-4 h-full  bg-slate-100 shadow-sm rounded-md lg:col-span-3 md:col-span-2 flex flex-col">
                <h1 className="text-center text-xl font-semibold font-mono">Chart</h1>
                <div className="flex-grow w-full h-0" id="plotly-plot">

                    {/* Call the chart creation function */}
                    {createCart()}
                </div>
            </div>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="bg-white shadow-lg rounded-lg p-4">
                        <h2 className="text-lg font-bold">About</h2>
                        <p className="mt-2 text-gray-600">Description about the system and its functionalities.</p>
                    </div>

                    {/* Purpose Section */}
                    <div className="bg-white shadow-lg rounded-lg p-4">
                        <h2 className="text-lg font-bold">Purpose</h2>
                        <p className="mt-2 text-gray-600">Explanation of the purpose and objectives of the system.</p>
                    </div>
                </div>

                {/* Weather Plugin Section */}
                <div className="w-1/5 bg-gray-100 p-4 flex flex-col items-right">
                    <h2 className="text-lg font-bold">Weather Plug-in</h2>
                    <div className="w-full h-40 mt-4 bg-gray-300 flex items-center justify-center">
                        Weather Data
                    </div>
                </div>
            </div>
    );
};



export default Dashboard;
