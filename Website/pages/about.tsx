// import dynamic from "next/dynamic";
// import { useEffect, useState } from "react";
// import LiquidFillGauge from "react-liquid-gauge";
// import { color } from "d3-color";
// import { interpolateRgb } from "d3-interpolate";
import Image from "next/image";

// export const PlotlyComponent = dynamic(() => import("react-plotly.js"), { ssr: false });

const About = () => {

    return (
        <div className="w-full grid grid-cols-1 gap-2 p-2">
            <div className="h-full w-full bg-slate-100 shadow-sm rounded-md">
                <h1 className="text-center text-xl font-semibold font-mono">About this project</h1>
                <p> About ...
                    <Image
                        src="/About_Images/Picture7.png"
                        alt=""
                        width={500}
                        height={300}
                        className="rounded-md shadow-md"
                    />
                </p>
            </div>
            <div className="bg-slate-100 shadow-sm rounded-md p-2">
                <h2 className="text-center text-xl font-semibold font-mono">Purpose Of This Project</h2>
                <p>
                    The system is designed to provide real-time environmental monitoring by integrating multiple sensor clusters
                    and weather data to track critical metrics such as water levels, water condition, temperature, wind conditions, humidity, and atmospheric pressure.
                    The main goal is to offer an intuitive and informative dashboard that allows users to visualize and analyze weather conditions and water levels effectively.
                </p>
            </div>

            <div className="bg-slate-100 shadow-sm rounded-md p-2">
                <h2 className="text-center text-xl font-semibold font-mono">Where is This Project Installed</h2>
                <p>
                    This project is installed at ...
                    <Image
                        src="/About_Images/Picture4.png"
                        alt=""
                        width={500}
                        height={300}
                        className="rounded-md shadow-md"
                    />

                    <Image
                        src="/About_Images/Picture5.png"
                        alt=""
                        width={500}
                        height={300}
                        className="rounded-md shadow-md"
                    />
                    <Image
                        src="/About_Images/Picture6.png"
                        alt=""
                        width={500}
                        height={300}
                        className="rounded-md shadow-md"
                    />
                </p>
            </div>

            <div className="bg-slate-100 shadow-sm rounded-md p-2">
                <h2 className="text-center text-xl font-semibold font-mono">What Technology Does This Project Employ</h2>
                <p>
                    text here...
                    <div className="flex justify-center mt-4">
                        <Image
                            src="/About_Images/Picture2.jpg"
                            alt=""
                            width={500}
                            height={300}
                            className="rounded-md shadow-md"
                        />
                        <Image
                            src="/About_Images/Picture3.jpg"
                            alt=""
                            width={500}
                            height={300}
                            className="rounded-md shadow-md"
                        />
                    </div>
                </p>
            </div>

            <div className="bg-slate-100 shadow-sm rounded-md p-2">
                <h2 className="text-center text-xl font-semibold font-mono">About The Authors</h2>
                <p>
                    Credits:
                    Authors: Kirk Blood, Hector Ceballos, Andre Descallar, Preston DeShazo, William Kolath
                    Supervised by: Dr. Mohammad Faridul H. Siddiqui, Ph.D, Dr. Joshua Partheepan, Ph.D.
                    Advised by: Dr. Nathan Howell , Ph.D, Richard Sambian

                </p>
            </div>

            <div className="bg-slate-100 shadow-sm rounded-md p-2">
                <h2 className="text-center text-xl font-semibold font-mono">More Information</h2>
                <p>
                    <li>
                        <a href="https://github.com/DeskColor/TerraTek" target="_blank" rel="noopener noreferrer">
                            The software developed as part of this project can be found at: https://github.com/DeskColor/TerraTek
                        </a>
                    </li>
                    Please Note: This software and data is provided &apos;as is,&apos; without any warranties of suitability or fitness for a particular purpose.
                </p>
            </div>
        </div>

    );
};

export default About;
