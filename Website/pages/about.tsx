import Image from "next/image";


const About = () => {

    return (
        <div className="w-full grid grid-cols-1 gap-2 p-2">
            <div className="h-full w-full bg-slate-100 shadow-sm rounded-md">
                <h1 className="text-center text-xl font-semibold font-mono">About this project</h1>
                <p className="p-4 justify-center"> This project presents the development of TerraTek, an IoT-based monitoring system designed to assist a customer in tracking rainwater harvesting tanks and environmental data. The system utilizes Arduino-controlled sensor clusters to gather data on key parameters such as rainfall, water pH, water level, and more. The data is then transmitted to a over LoRaWAN to our server. A responsive web interface allows users to visualize data trends and generate reports to aid decision-making processes. Through data analysis, the project demonstrates improved statistics by utilizing historical and real-time data. Future work will involve extending the system’s capabilities to include real-time camera monitoring based on sensor data.
                <div className="flex justify-center mt-4">
                    <Image
                        src="/About_Images/Picture7.png"
                        alt=""
                        width={500}
                        height={300}
                        className="rounded-md shadow-md"
                    />
                
                </div>
                </p>
            </div>
            {/* <div className="bg-slate-100 shadow-sm rounded-md p-2">
                <h2 className="text-center text-xl font-semibold font-mono">Purpose Of This Project</h2>
                <p>
                    The system is designed to provide real-time environmental monitoring by integrating multiple sensor clusters
                    and weather data to track critical metrics such as water levels, water condition, temperature, wind conditions, humidity, and atmospheric pressure.
                    The main goal is to offer an intuitive and informative dashboard that allows users to visualize and analyze weather conditions and water levels effectively.
                </p>
            </div> */}

            <div className="bg-slate-100 shadow-sm rounded-md p-2">
                <h2 className="text-center text-xl font-semibold font-mono">Project Project Background</h2>
                <p className="p-4 justify-center">
                The TerraTek project originated from a local initiative in the Texas Panhandle, where a resident sought a rainwater harvesting system to address water scarcity and promote sustainable practices. Recognizing the critical need for innovative solutions in a region often affected by drought, multiple professors supported the development of TerraTek as part of a broader effort to implement systems that assist with water conservation and management.
                    <div className="grid justify-center mt-4 lg:grid-cols-2 sm:grid-cols-1">
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
                        className="rounded-md shadow-md row-span-2"
                    />
                    </div>
                </p>
            </div>

            <div className="bg-slate-100 shadow-sm rounded-md p-2">
                <h2 className="text-center text-xl font-semibold font-mono">What Technology Does This Project Employ</h2>
                <p className="p-4 justify-center">
                TerraTek combines IoT technology with Arduino-controlled sensor clusters to monitor environmental parameters such as rainfall, water pH, and water levels. The data collected is transmitted to a centralized server, allowing users to visualize trends and generate actionable reports through a responsive web interface. Designed to support decision-making, the system also leverages historical and real-time data for enhanced insights. Future expansions include integrating real-time camera monitoring to further optimize water resource management, contributing to sustainable solutions for drought-prone areas.
                    <div className=" mt-4 grid grid-cols-1 lg:grid-cols-2">
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
                <p className="p-4">
                    Credits:<br />
                    Authors: Kirk Blood, Hector Ceballos, Andre Descallar, Preston DeShazo, William Kolath<br />
                    Supervised by: Dr. Mohammad Faridul H. Siddiqui, Ph.D, Dr. Joshua Partheepan, Ph.D.<br />
                    Advised by: Dr. Nathan Howell , Ph.D, Richard Sambian

                </p>
            </div>

            <div className="bg-slate-100 shadow-sm rounded-md p-2">
                <h2 className="text-center text-xl font-semibold font-mono">More Information</h2>
                <p className="p-4">
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
