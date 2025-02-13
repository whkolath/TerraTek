// import React from "react";
// import dynamic from 'next/dynamic';
// export const Plotly = dynamic(() => import('react-plotly.js'), { ssr: false });
// import 'chart.js/auto';
// import {
//     Dropdown,
//     DropdownTrigger,
//     DropdownMenu,
//     DropdownItem,
//     Button,
//     useDisclosure,
// } from "@heroui/react";

// import { useEffect, useState } from 'react';
// import { collect } from "collect.js";


const Dashboard = () => {



//     const { isOpen: isOpen, onOpen: onOpen, onClose: onClose } = useDisclosure();
//     const { isOpen: isOpen2, onOpen: onOpen2, onClose: onClose2 } = useDisclosure();
//     const { isOpen: isOpen3, onOpen: onOpen3, onClose: onClose3 } = useDisclosure();
//     const { isOpen: isOpenHelp, onOpen: onOpenHelp, onClose: onCloseHelp } = useDisclosure();

//     type DataSet = {
//         dates: Array<Date>;
//         values: Array<number>;
//         days: Array<Date>;
//         hours: Array<Date>;
//     }

//     type SensorList = {
//         Sensor_ID: Array<number>;
//         Sensor_Description: Array<string>;
//         Units: Array<string>;
//     }

//     type BoardList = {
//         Board_ID: Array<string>;
//         Board_Description: Array<string>;
//     }


//     const [dataset, setDataset] = useState<DataSet>({
//         dates: [],
//         values: [],
//         days: [],
//         hours: [],
//     });

//     const [dataset2, setDataset2] = useState<DataSet>({
//         dates: [],
//         values: [],
//         days: [],
//         hours: [],
//     });

//     const [dataset3, setDataset3] = useState<DataSet>({
//         dates: [],
//         values: [],
//         days: [],
//         hours: [],
//     });

//     const [value, setValue] = useState("744");

//     const [sensor, setSensor] = useState("2");
//     const [board, setBoard] = useState("0xa8610a34362d800f");

//     const [sensor2, setSensor2] = useState<string | null>(null);
//     const [board2, setBoard2] = useState<string | null>(null);

//     const [sensor3, setSensor3] = useState<string | null>(null);
//     const [board3, setBoard3] = useState<string | null>(null);


//     const [chartType, setChartType] = useState(1);

//     const [color, setColor] = useState('#0062B1');
//     const [color2, setColor2] = useState('#194D33');
//     const [color3, setColor3] = useState('#9F0500');

//     console.log(board);
//     const [sensorList, setSensorList] = useState<SensorList>({
//         Sensor_ID: [],
//         Sensor_Description: [],
//         Units: []
//     })

//     const [boardList, setBoardList] = useState<BoardList>({
//         Board_ID: [],
//         Board_Description: [],
//     })


//     useEffect(() => {
//         const fetchData = async () => {
//             try {

//                 const [response, response2, response3, sensorResponse, boardResponse] = await Promise.all([
//                     fetch(`/api/hourly/${value}/${sensor}`),
//                     fetch(`/api/hourly/${value}/${sensor2}`),
//                     fetch(`/api/hourly/${value}/${sensor3}`),
//                     fetch(`/api/sensors`),
//                     fetch(`/api/boards`)

//                 ]);
//                 const data = await response.json();
//                 const data2 = await response2.json();
//                 const data3 = await response3.json();
//                 const sensorsData = await sensorResponse.json();
//                 const boardsData = await boardResponse.json();

//                 data.reverse();


//                 const hours = data.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp).toLocaleTimeString("en-US", {
//                     hour: "numeric",
//                     minute: "numeric",
//                     timeZone: "America/Chicago"
//                 }));
//                 const values = data.map((data: { Average_Reading: number }) => data.Average_Reading);
//                 const days = data.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp).toLocaleDateString("en-US", {
//                     dateStyle: "short",
//                     timeZone: "America/Chicago"
//                 }));

//                 const dates = data.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp));

//                 const hours2 = data2.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp).toLocaleTimeString("en-US", {
//                     hour: "numeric",
//                     minute: "numeric",
//                     timeZone: "America/Chicago"
//                 }));
//                 const values2 = data2.map((data: { Average_Reading: number }) => data.Average_Reading);
//                 const days2 = data2.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp).toLocaleDateString("en-US", {
//                     dateStyle: "short",
//                     timeZone: "America/Chicago"
//                 }));

//                 const dates2 = data2.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp));

//                 const hours3 = data3.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp).toLocaleTimeString("en-US", {
//                     hour: "numeric",
//                     minute: "numeric",
//                     timeZone: "America/Chicago"
//                 }));
//                 const values3 = data3.map((data: { Average_Reading: number }) => data.Average_Reading);
//                 const days3 = data3.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp).toLocaleDateString("en-US", {
//                     dateStyle: "short",
//                     timeZone: "America/Chicago"
//                 }));

//                 const dates3 = data3.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp));

//                 console.log(hours3);
//                 console.log(values3);
//                 console.log(dates3);

//                 setDataset({
//                     dates: dates,
//                     values: values,
//                     days: days,
//                     hours: hours,
//                 });

//                 setDataset2({
//                     dates: dates2,
//                     values: values2,
//                     days: days2,
//                     hours: hours2,
//                 });

//                 setDataset3({
//                     dates: dates3,
//                     values: values3,
//                     days: days3,
//                     hours: hours3,
//                 });


//                 setSensorList({
//                     Sensor_ID: sensorsData.map((sensorsData: { Sensor_ID: number }) => sensorsData.Sensor_ID),
//                     Sensor_Description: sensorsData.map((sensorsData: { Sensor_Description: number }) => sensorsData.Sensor_Description),
//                     Units: sensorsData.map((sensorsData: { Units: number }) => sensorsData.Units)
//                 });
//                 setBoardList({
//                     Board_ID: boardsData.map((boardsData: { Board_ID: number }) => boardsData.Board_ID),
//                     Board_Description: boardsData.map((boardsData: { Board_Description: number }) => boardsData.Board_Description),
//                 });

//             } catch (error) {
//                 console.error("Error fetching data:", error);
//             }
//         };

//         fetchData();
//     }, [value, sensor, board, sensor2, board2, sensor3, board3]);
    return (
        <div className="w-full h-screen flex flex-col">
            {/* Header */}
            <div className="h-16 bg-gray-900 text-white flex items-center justify-center font-bold text-xl">
                LOGO
            </div>
            
            <div className="flex flex-grow">
                {/* Sidebar */}
                <div className="w-1/5 bg-gray-800 text-white flex flex-col p-4 space-y-4">
                    <button className="py-2 px-4 bg-gray-700 rounded">Tanks</button>
                    <button className="py-2 px-4 bg-gray-700 rounded">Weather/Soil</button>
                    <button className="py-2 px-4 bg-gray-700 rounded">Reports</button>
                    <button className="py-2 px-4 bg-gray-700 rounded">Comments</button>
                </div>
                
                {/* Main Content */}
                <div className="flex-grow p-6 grid grid-cols-2 gap-6">
                    {/* Fresh Water Section */}
                    <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center">
                        <h2 className="text-lg font-bold">Fresh Water</h2>
                        <div className="w-32 h-32 bg-blue-300 rounded-full mt-4"></div>
                        <div className="mt-2">Level Percentage</div>
                        <div className="w-full h-40 mt-4 bg-gray-200 flex items-center justify-center">
                            Graph Selection
                        </div>
                    </div>
                    
                    {/* Grey Water Section */}
                    <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center">
                        <h2 className="text-lg font-bold">Grey Water</h2>
                        <div className="w-32 h-32 bg-gray-400 rounded-full mt-4"></div>
                        <div className="mt-2">Level Percentage</div>
                        <div className="w-full h-40 mt-4 bg-gray-200 flex items-center justify-center">
                            Graph Selection
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
                <div className="w-1/5 bg-gray-100 p-4 flex flex-col items-center">
                    <h2 className="text-lg font-bold">Weather Plug-in</h2>
                    <div className="w-full h-40 mt-4 bg-gray-300 flex items-center justify-center">
                        Weather Data
                    </div>
                </div>
            </div>
        </div>
    );
    
};

export default Dashboard;