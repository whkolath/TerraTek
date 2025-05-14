import dynamic from 'next/dynamic';
export const PlotlyComponent = dynamic(() => import('react-plotly.js'), { ssr: false });

import { useEffect, useState } from 'react';



const HealthPage = () => {

    // // Custom data types
    type DataSet = {
        dates: Array<Date>;
        values: Array<number>;
    }

    type DataSetAll = Array<{
        Sensor_Description: string;
        Board_Description: string;
        Count: number;
        Online: number;
        Error: number;
    }>;

    type Online = {
        online: boolean;
        last_reading: string;
    };


    // // States of the datasets
    const [dataset, setDataset] = useState<DataSet>({
        dates: [],
        values: []
    });

    const [playaDataset, setPlayaDataset] = useState<DataSet>({
        dates: [],
        values: []
    });


    const [fresh1Dataset, setFresh1Dataset] = useState<DataSet>({
        dates: [],
        values: []
    });



    const [fresh2Dataset, setFresh2Dataset] = useState<DataSet>({
        dates: [],
        values: []
    });



    const [fresh3Dataset, setFresh3Dataset] = useState<DataSet>({
        dates: [],
        values: []
    });


    const [greyDataset, setGreyDataset] = useState<DataSet>({
        dates: [],
        values: []
    });


    const [datasetAll, setDatasetAll] = useState<DataSetAll>([]);
    const [ratePlaya, setRatePlaya] = useState<number>(0);
    const [rateFresh1, setRateFresh1] = useState<number>(0);
    const [rateFresh2, setRateFresh2] = useState<number>(0);
    const [rateFresh3, setRateFresh3] = useState<number>(0);
    const [rateGrey, setRateGrey] = useState<number>(0);

    const [onlinePlaya, setOnlinePlaya] = useState<Online | null>(null)
    const [onlineFresh1, setOnlineFresh1] = useState<Online | null>(null)
    const [onlineFresh2, setOnlineFresh2] = useState<Online | null>(null)
    const [onlineFresh3, setOnlineFresh3] = useState<Online | null>(null)
    const [onlineGrey, setOnlineGrey] = useState<Online | null>(null)

    const playaID = "0xa8610a34362d800f";
    const fresh1ID = "0xa8610a3436268316";
    const fresh2ID = "0xa8610a33382d9411";
    const fresh3ID = "0xa8610a3339188011";
    const greyID = "0xa8610a343235910e";


    function processData(rate: Array<{ Hourly_Timestamp: string; Number_Reading: number }>) {

        const values = rate.map((data: { Number_Reading: number }) => data.Number_Reading);

        const dates = rate.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp));



        return ({ dates, values })
    }

    // // This is where the website will react to changes the user makes. Ie. a different sensor is selected
    useEffect(() => {
        const fetchData = async () => {
            try {

                // Fetch the data from the API
                // const [monthlyRate, ratePlayaResponse, rateFresh1Response, rateFresh2Response, rateFresh3Response, rateGreyResponse,
                //                     onlinePlayaResponse, onlineFresh1Response, onlineFresh2Response, onlineFresh3Response, onlineGreyResponse,
                //                     lastPlayaResponse, lastFresh1Response, lastFresh2Response, lastFresh3Response, lastGreyResponse] = await Promise.all([

                //     fetch(`/api/rate/720`),

                //     fetch(`/api/rate/latest/${playaID}`), //Playa Weather Station
                //     fetch(`/api/rate/latest/${fresh1ID}`),  //Fresh Water Tank 1
                //     fetch(`/api/rate/latest/${fresh2ID}`),  //Fresh Water Tank 3
                //     fetch(`/api/rate/latest/${fresh3ID}`),  //Fresh Water Tank 3
                //     fetch(`/api/rate/latest/${greyID}`),  //Grey Water Tank 

                //     fetch(`/api/rate/online/${playaID}`),  //Playa Weather Station
                //     fetch(`/api/rate/online/${fresh1ID}`),  //Fresh Water Tank 1
                //     fetch(`/api/rate/online/${fresh2ID}`),  //Fresh Water Tank 2
                //     fetch(`/api/rate/online/${fresh3ID}`),  //Fresh Water Tank 3
                //     fetch(`/api/rate/online/${greyID}`),  //Grey Water Tank 

                //     fetch(`/api/rate/last_transmission/${playaID}`),  //Playa Weather Station
                //     fetch(`/api/rate/last_transmission/${fresh1ID}`),  //Fresh Water Tank 1
                //     fetch(`/api/rate/last_transmission/${fresh2ID}`),  //Fresh Water Tank 2
                //     fetch(`/api/rate/last_transmission/${fresh3ID}`), //Fresh Water Tank 3
                //     fetch(`/api/rate/last_transmission/${greyID}`), //Grey Water Tank 
                // ]);

                const [monthlyRate, healthPlayaResponse, healthFresh1Response, healthFresh2Response, healthFresh3Response, healthGreyResponse,
                    historyPlayaResponse, historyFresh1Response, historyFresh2Response, historyFresh3Response, historyGreyResponse
                ] = await Promise.all([

                    fetch(`/api/rate/720`),

                    fetch(`/api/rate/health/${playaID}`), //Playa Weather Station
                    fetch(`/api/rate/health/${fresh1ID}`),  //Fresh Water Tank 1
                    fetch(`/api/rate/health/${fresh2ID}`),  //Fresh Water Tank 3
                    fetch(`/api/rate/health/${fresh3ID}`),  //Fresh Water Tank 3
                    fetch(`/api/rate/health/${greyID}`),  //Grey Water Tank 

                    fetch(`/api/rate/history/${playaID}`), //Playa Weather Station
                    fetch(`/api/rate/history/${fresh1ID}`),  //Fresh Water Tank 1
                    fetch(`/api/rate/history/${fresh2ID}`),  //Fresh Water Tank 3
                    fetch(`/api/rate/history/${fresh3ID}`),  //Fresh Water Tank 3
                    fetch(`/api/rate/history/${greyID}`),  //Grey Water Tank 
                ]);

                const rate = await monthlyRate.json();

                const playaRate = await historyPlayaResponse.json();
                const fresh1Rate = await historyFresh1Response.json();
                const fresh2Rate = await historyFresh2Response.json();
                const fresh3Rate = await historyFresh3Response.json();
                const greyRate = await historyGreyResponse.json();

                const healthPlayaData = await healthPlayaResponse.json();
                console.log(healthPlayaData);
                const healthFresh1Data = await healthFresh1Response.json();
                const healthFresh2Data = await healthFresh2Response.json();
                const healthFresh3Data = await healthFresh3Response.json();
                const healthGreyData = await healthGreyResponse.json();


                setRatePlaya(healthPlayaData[0].Number_Reading);
                setRateFresh1(healthFresh1Data[0].Number_Reading);
                setRateFresh2(healthFresh2Data[0].Number_Reading);
                setRateFresh3(healthFresh3Data[0].Number_Reading);
                setRateGrey(healthGreyData[0].Number_Reading);

                const lastPlayaData = healthPlayaData[0].LastTimestamp;
                const lastFresh1Data = healthFresh1Data[0].LastTimestamp;
                const lastFresh2Data = healthFresh2Data[0].LastTimestamp;
                const lastFresh3Data = healthFresh3Data[0].LastTimestamp;
                const lastGreyData = healthGreyData[0].LastTimestamp

                setOnlinePlaya({
                    online: healthPlayaData[0].Online ? true : false,
                    last_reading: new Date(lastPlayaData).toLocaleString("en-US", {
                        timeZone: "America/Chicago",
                        timeStyle: "medium",
                        dateStyle: "short",

                    })
                });

                setOnlineFresh1({
                    online: healthFresh1Data[0].Online ? true : false,
                    last_reading: new Date(lastFresh1Data).toLocaleString("en-US", {
                        timeZone: "America/Chicago",
                        timeStyle: "medium",
                        dateStyle: "short",

                    })
                });

                setOnlineFresh2({
                    online: healthFresh2Data[0].Online ? true : false,
                    last_reading: new Date(lastFresh2Data).toLocaleString("en-US", {
                        timeZone: "America/Chicago",
                        timeStyle: "medium",
                        dateStyle: "short",

                    })
                });

                setOnlineFresh3({
                    online: healthFresh3Data[0].Online ? true : false,
                    last_reading: new Date(lastFresh3Data).toLocaleString("en-US", {
                        timeZone: "America/Chicago",
                        timeStyle: "medium",
                        dateStyle: "short",

                    })
                });

                setOnlineGrey({
                    online: healthGreyData[0].Online ? true : false,
                    last_reading: new Date(lastGreyData).toLocaleString("en-US", {
                        timeZone: "America/Chicago",
                        timeStyle: "medium",
                        dateStyle: "short",

                    })
                });


                setDataset(processData(rate));

                setPlayaDataset(processData(playaRate));
                setFresh1Dataset(processData(fresh1Rate));
                setFresh2Dataset(processData(fresh2Rate));
                setFresh3Dataset(processData(fresh3Rate));
                setGreyDataset(processData(greyRate));


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

                console.log(rateAll);
                setDatasetAll(rateAll);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []); // These are the dependant variables



    return (
        <div className="w-full min-h-[calc(100vh-50px)] lg:h-[calc(100vh-50px)] grid gap-2 p-2 lg:grid-cols-5 lg:grid-rows-3 grid-cols-1">

            {/* Data Rate */}
            <div className="p-4 lg:h-full md:h-[calc(100vh-50px)] md:row-span-3 bg-slate-100 shadow-sm rounded-md flex-grow lg:block hidden">
                <h1 className="text-center text-xl font-semibold font-mono">Sensor List (Past Month)</h1>
                <div className="overflow-scroll" style={{ maxHeight: '95%' }}>
                    {datasetAll.length > 0 ? (datasetAll.map((data, index) => (
                        <div key={index} className={`p-2 border-b border-gray-200 ${data.Online ? (data.Error ? "bg-yellow-300" : "bg-green-300") : "bg-red-300"}`}>
                            <p>Sensor: {data.Sensor_Description}</p>
                            <p>Board: {data.Board_Description}</p>
                            <p>Total Readings Received: {data.Count}</p>
                        </div>
                    ))) : (<p className="text-center text-lg gap-5 p-10 text-gray-500 "> LOADING... </p>)}
                </div>

            </div>
            <div className="h-full md:col-span-4 md:row-span-2 lg:grid-cols-4 grid gap-2 overflow-scroll">

                {/* Playa weather station */}
                <div className="h-full bg-slate-100 md:col-span-2 shadow-sm rounded-md">
                    <div className="p-3 gap-5">
                        <h1 className="text-center text-xl font-semibold font-mono">Playa Weather Station</h1>
                        <PlotlyComponent
                            data={[
                                {
                                    type: "indicator",
                                    mode: "gauge+number",
                                    value: ratePlaya,
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
                            <p className={`${onlinePlaya === null ? "text-gray-500" : onlinePlaya.online ? "text-green-900" : "text-red-900"}`}>
                                Playa Weather Station: {onlinePlaya === null ? "LOADING..." : onlinePlaya.online ? "ONLINE ✅" : "OFFLINE ❌"}
                            </p>
                            <p className={`${onlinePlaya === null ? "text-gray-500" : onlinePlaya.online ? "text-green-900" : "text-red-900"}`}>
                                Last Reading: {onlinePlaya === null ? "LOADING..." : onlinePlaya.last_reading}
                            </p>
                        </div>
                        <PlotlyComponent
                            data={[{ x: playaDataset.dates, y: playaDataset.values, type: 'scatter', mode: 'lines+markers', name: "Transmissions Per Hour" }]}
                            layout={{
                                autosize: true,
                                margin: { t: 20, l: 20, r: 20, b: 20 },
                                xaxis: { automargin: true,  tickformat: '%m/%d %I:%M %p' },
                                yaxis: { side: "left", anchor: 'x', position: 0, automargin: true, title: "Transmission Rate" },
                                paper_bgcolor: '#f1f5f9',
                                plot_bgcolor: '#f1f5f9',
                                showlegend: false,
                                legend: {
                                    x: 1,
                                    xanchor: 'right',
                                    y: 1
                                }
                            }}
                            config={{ displayModeBar: false, scrollZoom: false, responsive: true }}
                            useResizeHandler={true}
                            style={{ width: "100%", height: "150px" }}
                        />
                    </div>

                </div>

                {/* Fresh Water Tank 1*/}
                <div className="h-full bg-slate-100 md:col-span-2 shadow-sm rounded-md">
                    <div className="p-3">
                        <h1 className="text-center text-xl font-semibold font-mono">Fresh Water Tank 1</h1>
                        <PlotlyComponent
                            data={[
                                {
                                    type: "indicator",
                                    mode: "gauge+number",
                                    value: rateFresh1,
                                    gauge: {
                                        bar: { color: "darkGreen" },
                                        axis: { range: [490, 590] },
                                        steps: [
                                            { range: [490, 520], color: "lightgray" },
                                            { range: [520, 560], color: "lightGreen" },
                                            { range: [560, 590], color: "lightgray" }
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
                            <p className={`${onlineFresh1 === null ? "text-gray-500" : onlineFresh1.online ? "text-green-900" : "text-red-900"}`}>
                                Fresh Water Tank 1: {onlineFresh1 === null ? "LOADING..." : onlineFresh1.online ? "ONLINE ✅" : "OFFLINE ❌"}
                            </p>
                            <p className={`${onlineFresh1 === null ? "text-gray-500" : onlineFresh1.online ? "text-green-900" : "text-red-900"}`}>
                                Last Reading: {onlineFresh1 === null ? "LOADING..." : onlineFresh1.last_reading}
                            </p>
                        </div>
                        <PlotlyComponent
                            data={[{ x: fresh1Dataset.dates, y: fresh1Dataset.values, type: 'scatter', mode: 'lines+markers', name: "Transmissions Per Hour" }]}
                            layout={{
                                autosize: true,
                                margin: { t: 20, l: 20, r: 20, b: 20 },
                                xaxis: { automargin: true,  tickformat: '%m/%d %I:%M %p' },
                                yaxis: { side: "left", anchor: 'x', position: 0, automargin: true, title: "Transmission Rate" },
                                paper_bgcolor: '#f1f5f9',
                                plot_bgcolor: '#f1f5f9',
                                showlegend: false,
                                legend: {
                                    x: 1,
                                    xanchor: 'right',
                                    y: 1
                                }
                            }}
                            config={{ displayModeBar: false, scrollZoom: false, responsive: true }}
                            useResizeHandler={true}
                            style={{ width: "100%", height: "150px" }}
                        />
                    </div>
                </div>
                {/* Fresh Water Tank 2*/}
                <div className="h-full bg-slate-100 md:col-span-2 shadow-sm rounded-md">
                    <div className="p-3">
                        <h1 className="text-center text-xl font-semibold font-mono">Fresh Water Tank 2</h1>
                        <PlotlyComponent
                            data={[
                                {
                                    type: "indicator",
                                    mode: "gauge+number",
                                    value: rateFresh2,
                                    gauge: {
                                        bar: { color: "darkGreen" },
                                        axis: { range: [180, 280] },
                                        steps: [
                                            { range: [180, 210], color: "lightgray" },
                                            { range: [210, 250], color: "lightGreen" },
                                            { range: [250, 280], color: "lightgray" }
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
                            <p className={`${onlineFresh2 === null ? "text-gray-500" : onlineFresh2.online ? "text-green-900" : "text-red-900"}`}>
                                Fresh Water Tank 2: {onlineFresh2 === null ? "LOADING..." : onlineFresh2.online ? "ONLINE ✅" : "OFFLINE ❌"}
                            </p>
                            <p className={`${onlineFresh2 === null ? "text-gray-500" : onlineFresh2.online ? "text-green-900" : "text-red-900"}`}>
                                Last Reading: {onlineFresh2 === null ? "LOADING..." : onlineFresh2.last_reading}
                            </p>
                        </div>
                        <PlotlyComponent
                            data={[{ x: fresh2Dataset.dates, y: fresh2Dataset.values, type: 'scatter', mode: 'lines+markers', name: "Transmissions Per Hour" }]}
                            layout={{
                                autosize: true,
                                margin: { t: 20, l: 20, r: 20, b: 20 },
                                xaxis: { automargin: true,  tickformat: '%m/%d %I:%M %p' },
                                yaxis: { side: "left", anchor: 'x', position: 0, automargin: true, title: "Transmission Rate" },
                                paper_bgcolor: '#f1f5f9',
                                plot_bgcolor: '#f1f5f9',
                                showlegend: false,
                                legend: {
                                    x: 1,
                                    xanchor: 'right',
                                    y: 1
                                }
                            }}
                            config={{ displayModeBar: false, scrollZoom: false, responsive: true }}
                            useResizeHandler={true}
                            style={{ width: "100%", height: "150px" }}
                        />
                    </div>
                </div>
                {/* Fresh Water Tank 3*/}
                <div className="h-full bg-slate-100 md:col-span-2 shadow-sm rounded-md">
                    <div className="p-3">
                        <h1 className="text-center text-xl font-semibold font-mono">Fresh Water Tank 3</h1>
                        <PlotlyComponent
                            data={[
                                {
                                    type: "indicator",
                                    mode: "gauge+number",
                                    value: rateFresh3,
                                    gauge: {
                                        bar: { color: "darkGreen" },
                                        axis: { range: [180, 280] },
                                        steps: [
                                            { range: [180, 210], color: "lightgray" },
                                            { range: [210, 250], color: "lightGreen" },
                                            { range: [250, 280], color: "lightgray" }
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
                            <p className={`${onlineFresh3 === null ? "text-gray-500" : onlineFresh3.online ? "text-green-900" : "text-red-900"}`}>
                                Fresh Water Tank 3: {onlineFresh3 === null ? "LOADING..." : onlineFresh3.online ? "ONLINE ✅" : "OFFLINE ❌"}
                            </p>
                            <p className={`${onlineFresh3 === null ? "text-gray-500" : onlineFresh3.online ? "text-green-900" : "text-red-900"}`}>
                                Last Reading: {onlineFresh3 === null ? "LOADING..." : onlineFresh3.last_reading}
                            </p>
                        </div>
                        <PlotlyComponent
                            data={[{ x: fresh3Dataset.dates, y: fresh3Dataset.values, type: 'scatter', mode: 'lines+markers', name: "Transmissions Per Hour" }]}
                            layout={{
                                autosize: true,
                                margin: { t: 20, l: 20, r: 20, b: 20 },
                                xaxis: { automargin: true,  tickformat: '%m/%d %I:%M %p' },
                                yaxis: { side: "left", anchor: 'x', position: 0, automargin: true, title: "Transmission Rate" },
                                paper_bgcolor: '#f1f5f9',
                                plot_bgcolor: '#f1f5f9',
                                showlegend: false,
                                legend: {
                                    x: 1,
                                    xanchor: 'right',
                                    y: 1
                                }
                            }}
                            config={{ displayModeBar: false, scrollZoom: false, responsive: true }}
                            useResizeHandler={true}
                            style={{ width: "100%", height: "150px" }}
                        />
                    </div>
                </div>
                {/* Grey Water Tank */}
                <div className="h-full bg-slate-100 md:col-span-2 shadow-sm rounded-md">
                    <div className="p-3">
                        <h1 className="text-center text-xl font-semibold font-mono">Grey Water Tank</h1>
                        <PlotlyComponent
                            data={[
                                {
                                    type: "indicator",
                                    mode: "gauge+number",
                                    value: rateGrey,
                                    gauge: {
                                        bar: { color: "darkGreen" },
                                        axis: { range: [530, 630] },
                                        steps: [
                                            { range: [530, 560], color: "lightgray" },
                                            { range: [560, 600], color: "lightGreen" },
                                            { range: [600, 630], color: "lightgray" }
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
                            <p className={`${onlineGrey === null ? "text-gray-500" : onlineGrey.online ? "text-green-900" : "text-red-900"}`}>
                                Grey Water Tank: {onlineGrey === null ? "LOADING..." : onlineGrey.online ? "ONLINE ✅" : "OFFLINE ❌"}
                            </p>
                            <p className={`${onlineGrey === null ? "text-gray-500" : onlineGrey.online ? "text-green-900" : "text-red-900"}`}>
                                Last Reading: {onlineGrey === null ? "LOADING..." : onlineGrey.last_reading}
                            </p>
                        </div>
                        <PlotlyComponent
                            data={[{ x: greyDataset.dates, y: greyDataset.values, type: 'scatter', mode: 'lines+markers', name: "Transmissions Per Hour" }]}
                            layout={{
                                autosize: true,
                                margin: { t: 20, l: 20, r: 20, b: 20 },
                                xaxis: { automargin: true,  tickformat: '%m/%d %I:%M %p' },
                                yaxis: { side: "left", anchor: 'x', position: 0, automargin: true, title: "Transmission Rate" },
                                paper_bgcolor: '#f1f5f9',
                                plot_bgcolor: '#f1f5f9',
                                showlegend: false,
                                legend: {
                                    x: 1,
                                    xanchor: 'right',
                                    y: 1
                                }
                            }}
                            config={{ displayModeBar: false, scrollZoom: false, responsive: true }}
                            useResizeHandler={true}
                            style={{ width: "100%", height: "150px" }}
                        />
                    </div>
                </div>
            </div>
            {/* Transmission Rate */}
            <div className="p-4 h-full lg:col-span-4 col-span-1 row-span-1 bg-slate-100 shadow-sm rounded-md flex flex-col">
                <h1 className="text-center text-xl font-semibold font-mono">Transmission Rate (Past Month)</h1>
                <div className="w-full h-full">
                    <PlotlyComponent
                        data={[{ x: dataset.dates, y: dataset.values, type: 'scatter', mode: 'lines+markers', name: "Transmissions Per Hour" }]}
                        layout={{
                            autosize: true,
                            margin: { t: 20, l: 20, r: 20, b: 20 },
                            xaxis: { automargin: true,  tickformat: '%m/%d %I:%M %p' },
                            yaxis: { side: "left", anchor: 'x', position: 0, automargin: true, title: "Transmission Rate" },
                            paper_bgcolor: '#f1f5f9',
                            plot_bgcolor: '#f1f5f9',
                            showlegend: false,
                            legend: { x: 1, xanchor: 'right', y: 1 }
                        }}
                        config={{ displayModeBar: false, scrollZoom: true, responsive: true }}
                        useResizeHandler={true}
                        style={{ width: "100%", height: "200px" }}
                    />
                </div>
            </div>
            {/* Sensor List */}
            <div className="p-4 lg:h-full md:h-[calc(100vh-50px)] md:row-span-2 row-span-1 bg-slate-100 shadow-sm rounded-md flex-grow block lg:hidden">
                <h1 className="text-center text-xl font-semibold font-mono">Sensor List (Past Month)</h1>
                <div className="md:overflow-scroll" style={{ maxHeight: '95%' }}>
                    {datasetAll.length > 0 ? (datasetAll.map((data, index) => (
                        <div key={index} className={`p-2 border-b border-gray-200 ${data.Online ? (data.Error ? "bg-yellow-300" : "bg-green-300") : "bg-red-300"}`}>
                            <p>Sensor: {data.Sensor_Description}</p>
                            <p>Board: {data.Board_Description}</p>
                            <p>Total Readings Received: {data.Count}</p>
                        </div>
                    ))) : (<p className="text-center text-lg gap-5 p-10 text-gray-500 "> LOADING... </p>)
                    }

                </div>
            </div>
        </div>
    );
}

export default HealthPage;