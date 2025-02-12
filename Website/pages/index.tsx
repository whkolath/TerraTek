import React from "react";
// import dynamic from 'next/dynamic';
import 'chart.js/auto';

const Dashboard = () => {
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