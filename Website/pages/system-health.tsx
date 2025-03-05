import dynamic from 'next/dynamic';
export const PlotlyComponent = dynamic(() => import('react-plotly.js'), { ssr: false });

// import {
//     Dropdown,
//     DropdownTrigger,
//     DropdownMenu,
//     DropdownItem,
//     Drawer,
//     DrawerContent,
//     DrawerHeader,
//     DrawerBody,
//     DrawerFooter,
//     DateRangePicker,
//     Modal,
//     ModalContent,
//     ModalHeader,
//     ModalBody,
//     Button,
//     useDisclosure,
// } from "@heroui/react";

import { useEffect, useState } from 'react';



const HealthPage = () => {

    // // Custom data types
    type DataSet = {
        dates: Array<Date>;
        values: Array<number>;
        days: Array<Date>;
        hours: Array<Date>;
    }

    type DataSetAll = Array<{
        Sensor_Description: string;
        Board_Description: string;
        Count: number;
    }>;

   
    // // States of the datasets
    const [dataset, setDataset] = useState<DataSet>({
        dates: [],
        values: [],
        days: [],
        hours: [],
    });

    const [datasetAll, setDatasetAll] = useState<DataSetAll>([]);

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
    useEffect(() => {
        const fetchData = async () => {
            try {

                // Fetch the data from the API
                const [response, all] = await Promise.all([
                    fetch(`/api/rate/1000`),
                    fetch(`/api/rate/all`)

                ]);

                const rate = await response.json();
                const rateAll = await all.json() as DataSetAll;
 

                const hours = rate.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    timeZone: "America/Chicago"
                }));

                const values = rate.map((data: { Number_Reading: number }) => data.Number_Reading);


                const days = rate.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp).toLocaleDateString("en-US", {
                    dateStyle: "short",
                    timeZone: "America/Chicago"
                }));

                const dates = rate.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp));



                setDataset({
                    dates: dates,
                    values: values,
                    days: days,
                    hours: hours,
                });

                setDatasetAll(rateAll);
               
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []); // These are the dependant variables



    return (
        <div className="w-full h-full grid gap-2 p-2 grid-rows-2 grid-cols-5">

            {/* Data Rate */}
            <div className="p-4 h-full row-span-2 bg-slate-100 shadow-sm rounded-md flex-grow">
                <h1 className="text-center text-xl font-semibold font-mono">Sensor List</h1>
                <div className="overflow-scroll" style={{ maxHeight: '95%' }}>
                    {datasetAll.map((data, index) => (
                        <div key={index} className="p-2 border-b border-gray-200">
                            <p>Sensor: {data.Sensor_Description}</p>
                            <p>Board: {data.Board_Description}</p>
                            <p>Total Readings Received: {data.Count}</p>
                        </div>
                    ))}
                </div>
                
            </div>

            {/* Board 1 */}
            <div className="h-full bg-slate-100 col-span-2 shadow-sm rounded-md">
                <div className="p-3 gap-5">
                    <h1 className="text-center text-xl font-semibold font-mono">Board 1</h1>
                    <p>Board 1 Readings per Hour</p>
                    <PlotlyComponent
                        data={[
                            {
                                type: "indicator",
                                mode: "gauge+number",
                                value: 710,
                                title: { text: "Board 1 transmission rate" },
                                gauge: {
                                    axis: { range: [600, 750] },
                                },
                            },
                        ]}
                        layout={{
                            autosize: true,
                            margin: { t: 20, r: 20, l: 20, b: 10 },
                            paper_bgcolor: '#f1f5f9',
                            plot_bgcolor: '#f1f5f9',
                        }}
                        useResizeHandler
                        style={{ width: "100%", height: "200px" }}
                    />
                    <div className="text-center text-lg gap-5 p-10">
                        <p>Board 1: ONLINE</p>
                        <p>Last Reading: 3:15pm 3/4/25</p>
                    </div>
                </div>

            </div>

            {/* Board 2 */}
            <div className="h-full bg-slate-100 col-span-2 shadow-sm rounded-md">
                <div className="p-3">
                    <h1 className="text-center text-xl font-semibold font-mono">Board 2</h1>
                    <p>Board 2 Readings per Hour</p>
                    <PlotlyComponent
                        data={[
                            {
                                type: "indicator",
                                mode: "gauge+number",
                                value: 0,
                                title: { text: "Board 2 transmission rate" },
                                gauge: {
                                    axis: { range: [600, 750] },
                                },
                            },
                        ]}
                        layout={{
                            autosize: true,
                            margin: { t: 20, r: 20, l: 20, b: 10 },
                            paper_bgcolor: '#f1f5f9',
                            plot_bgcolor: '#f1f5f9',
                        }}
                        useResizeHandler
                        style={{ width: "100%", height: "200px" }}
                    />
                    <div className="text-center text-lg gap-5 p-10">
                        <p>Board 1: OFFLINE</p>
                        <p>Last Reading: 2:22pm 1/24/25</p>
                    </div>
                </div>
            </div>

            {/* Data Rate */}
            <div className="p-4 h-full col-span-4 bg-slate-100 shadow-sm rounded-md flex flex-col">
                <h1 className="text-center text-xl font-semibold font-mono">Transmission Rate</h1>
                <div className="flex-grow">
                    <PlotlyComponent
                        data={[{ x: dataset.dates, y: dataset.values, type: 'scatter', mode: 'lines+markers', name: "Transmissions Per Hour" }]}
                        layout={{
                            autosize: true,
                            margin: { t: 20, l: 20, r: 20, b: 20 },
                            xaxis: { automargin: true },
                            yaxis: { side: "left", anchor: 'x', position: 0, automargin: true, title: "Transmission Rate" },
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
                        useResizeHandler={true}
                        style={{ width: "100%", height: "100%" }}
                    />
                </div>
            </div>


        </div>
    );
}

export default HealthPage;