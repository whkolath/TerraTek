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

    type Online = {
        online: boolean;
        last_reading: string;
    };


    // // States of the datasets
    const [dataset, setDataset] = useState<DataSet>({
        dates: [],
        values: [],
        days: [],
        hours: [],
    });

    const [datasetAll, setDatasetAll] = useState<DataSetAll>([]);
    const [rate1, setRate1] = useState<number>(0);
    const [rate2, setRate2] = useState<number>(0);

    const [online1, setOnline1] = useState<Online | null>(null)
    const [online2, setOnline2] = useState<Online | null>(null)


    // // This is where the website will react to changes the user makes. Ie. a different sensor is selected
    useEffect(() => {
        const fetchData = async () => {
            try {

                // Fetch the data from the API
                const [response, rate1Response, rate2Response, online1Response, online2Response, last1Response, last2Response] = await Promise.all([
                    fetch(`/api/rate/720`),
                    fetch(`/api/rate/latest/0xa8610a34362d800f`), //Playa Weather Station
                    fetch(`/api/rate/latest/0xa8610a3436268316`),  //Fresh Water Tank

                    fetch(`/api/rate/online/0xa8610a34362d800f`),  //Playa Weather Station
                    fetch(`/api/rate/online/0xa8610a3436268316`),  //Fresh Water Tank

                    fetch(`/api/rate/last_transmission/0xa8610a34362d800f`),  //Playa Weather Station
                    fetch(`/api/rate/last_transmission/0xa8610a3436268316`)  //Fresh Water Tank
                ]);

                const rate = await response.json();
                const rate1Data = await rate1Response.json();
                setRate1(rate1Data[0].Number_Reading);
                const rate2Data = await rate2Response.json();
                setRate2(rate2Data[0].Number_Reading);

                const last1Data = await last1Response.json();
                const last2Data = await last2Response.json();

                const online1Data = await online1Response.json();
                setOnline1({
                    online: online1Data[0].Online ? true : false,
                    last_reading: new Date(last1Data[0].LastTimestamp).toLocaleString("en-US", {
                        timeZone: "America/Chicago",
                        timeStyle: "medium",
                        dateStyle: "short",

                    })
                });

                const online2Data = await online2Response.json();
                setOnline2({
                    online: online2Data[0].Online ? true : false,
                    last_reading: new Date(last2Data[0].LastTimestamp).toLocaleString("en-US", {
                        timeZone: "America/Chicago",
                        timeStyle: "medium",
                        dateStyle: "short",

                    })
                });

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

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []); // These are the dependant variables



    useEffect(() => {
        const fetchData = async () => {
            try {

                // Fetch the data from the API
                const [all] = await Promise.all([
                    fetch(`/api/rate/all`)
                ]);


                const rateAll = await all.json() as DataSetAll;


                setDatasetAll(rateAll);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []); // These are the dependant variables



    return (
        <div className="w-full min-h-[calc(100vh-50px)] lg:h-[calc(100vh-50px)] grid gap-2 p-2 grid-rows-2 lg:grid-cols-5 md:grid-cols-3 grid-cols-1">

            {/* Data Rate */}
            <div className="p-4 lg:h-full md:h-[calc(100vh-50px)] md:row-span-2 bg-slate-100 shadow-sm rounded-md flex-grow md:block hidden">
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

            {/* Playa weather station */}
            <div className="h-full bg-slate-100 md:col-span-2 shadow-sm rounded-md">
                <div className="p-3 gap-5">
                    <h1 className="text-center text-xl font-semibold font-mono">Playa Weather Station</h1>
                    <PlotlyComponent
                        data={[
                            {
                                type: "indicator",
                                mode: "gauge+number",
                                value: rate1,
                                title: { text: "Board 1 transmission rate" },
                                gauge: {
                                    bar: { color: "darkGreen" },
                                    axis: { range: [570, 670] },
                                    steps: [
                                        { range: [570, 600], color: "lightgray" },
                                        { range: [600, 640], color: "lightGreen" },
                                        { range: [640, 670], color: "lightgray" }
                                    ],

                                },
                                number: { suffix: " Readings per Hour" }
                            },
                        ]}
                        layout={{
                            autosize: true,
                            margin: { t: 20, r: 20, l: 20, b: 10 },
                            paper_bgcolor: '#f1f5f9',
                            plot_bgcolor: '#f1f5f9',
                        }}
                        config={{ displayModeBar: false, responsive: true }}
                        useResizeHandler
                        style={{ width: "100%", height: "200px" }}
                    />
                    <div className="text-center text-lg gap-5 p-10">
                        <p className={`${online1?.online ? "text-green-900" : "text-red-900"}`}>Playa Weather Station: {online1?.online ? "ONLINE ✅" : "OFFLINE ❌"}</p>
                        <p className={`${online1?.online ? "text-green-900" : "text-red-900"}`}>Last Reading: {online1?.last_reading}</p>
                    </div>
                </div>

            </div>

            {/* Fresh Water Tank */}
            <div className="h-full bg-slate-100 md:col-span-2 shadow-sm rounded-md">
                <div className="p-3">
                    <h1 className="text-center text-xl font-semibold font-mono">Fresh Water Tank</h1>
                    <PlotlyComponent
                        data={[
                            {
                                type: "indicator",
                                mode: "gauge+number",
                                value: rate2,
                                title: { text: "Board 1 transmission rate" },
                                gauge: {
                                    bar: { color: "darkGreen" },
                                    axis: { range: [570, 670] },
                                    steps: [
                                        { range: [570, 600], color: "lightgray" },
                                        { range: [600, 640], color: "lightGreen" },
                                        { range: [640, 670], color: "lightgray" }
                                    ],

                                },
                                number: { suffix: " Readings per Hour" }
                            },
                        ]}
                        layout={{
                            autosize: true,
                            margin: { t: 20, r: 20, l: 20, b: 10 },
                            paper_bgcolor: '#f1f5f9',
                            plot_bgcolor: '#f1f5f9',
                        }}
                        config={{ displayModeBar: false, responsive: true }}
                        useResizeHandler
                        style={{ width: "100%", height: "200px" }}
                    />
                    <div className="text-center text-lg gap-5 p-10">
                        <p className={`${online2?.online ? "text-green-900" : "text-red-900"}`}>Fresh Water Tank: {online2?.online ? "ONLINE ✅" : "OFFLINE ❌"}</p>
                        <p className={`${online2?.online ? "text-green-900" : "text-red-900"}`}>Last Reading: {online2?.last_reading}</p>
                    </div>
                </div>
            </div>

            {/* Data Rate */}
            <div className="p-4 h-full lg:col-span-4 md:col-span-3 bg-slate-100 shadow-sm rounded-md flex flex-col">
                <h1 className="text-center text-xl font-semibold font-mono">Transmission Rate</h1>
                <div className="flex-grow h-full min-h-[400px]">
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
            {/* Data Rate */}
            <div className="p-4 lg:h-full md:h-[calc(100vh-50px)] md:row-span-2 bg-slate-100 shadow-sm rounded-md flex-grow block md:hidden">
                <h1 className="text-center text-xl font-semibold font-mono">Sensor List</h1>
                <div className="md:overflow-scroll" style={{ maxHeight: '95%' }}>
                    {datasetAll.map((data, index) => (
                        <div key={index} className="p-2 border-b border-gray-200">
                            <p>Sensor: {data.Sensor_Description}</p>
                            <p>Board: {data.Board_Description}</p>
                            <p>Total Readings Received: {data.Count}</p>
                        </div>
                    ))}
                </div>

            </div>

        </div>
    );
}

export default HealthPage;