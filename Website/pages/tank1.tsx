import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import dynamic from 'next/dynamic';
export const PlotlyComponent = dynamic(() => import('react-plotly.js'), { ssr: false });

const Tank: NextPage = () => {
    return (
        <>
            <Head>
                <title>Tank Dashboard</title>
                <meta name="description" content="Tank Dashboard UI" />
            </Head>

            <main className="h-full bg-gray-100 p-6">
                {/* Title / Header */}
                <h1 className="text-2xl font-bold mb-6">Tank Dashboard</h1>

                {/* Two-Column Layout for Current / Historical */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Current Section */}
                    <section>
                        <h2 className="text-xl font-semibold mb-3">Current</h2>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="flex justify-center mb-4">
                                <Image
                                    src="/tank_UI.svg"
                                    alt="Tank SVG"
                                    width={100}
                                    height={100}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-3 text-center rounded shadow-sm">
                                    Water Level
                                </div>
                                <div className="bg-gray-50 p-3 text-center rounded shadow-sm">
                                    <PlotlyComponent
                                        data={[
                                            {
                                                x: ["Jan", "Feb", "Mar", "Apr", "May"],
                                                y: [10, 15, 13, 17, 20],
                                                type: "scatter",
                                                mode: "lines+markers",
                                                marker: { color: "blue" },
                                                name: "Water pH",
                                            },
                                        ]}
                                        layout={{ width: 600, height: 400, title: "Monthly Water pH" }}
                                        className="mx-auto"
                                    />
                                    Water pH
                                </div>
                                <div className="bg-gray-50 p-3 text-center rounded shadow-sm">
                                    <PlotlyComponent
                                        data={[
                                            {
                                                x: ["Jan", "Feb", "Mar", "Apr", "May"],
                                                y: [10, 15, 13, 17, 20],
                                                type: "scatter",
                                                mode: "lines+markers",
                                                marker: { color: "blue" },
                                                name: "Water pH",
                                            },
                                        ]}
                                        layout={{ width: 600, height: 400, title: "Monthly Water pH" }}
                                        className="mx-auto"
                                    />
                                    TDC
                                </div>
                                <div className="bg-gray-50 p-3 text-center rounded shadow-sm">
                                    <div>
                                        <PlotlyComponent
                                            data={[
                                                {
                                                    x: ["Jan", "Feb", "Mar", "Apr", "May"],
                                                    y: [10, 15, 13, 17, 20],
                                                    type: "scatter",
                                                    mode: "lines+markers",
                                                    marker: { color: "blue" },
                                                    name: "Water pH",
                                                },
                                            ]}
                                            layout={{ width: 600, height: 400, title: "Monthly Water pH" }}
                                            className="mx-auto"
                                        />
                                    </div>
                                    Water Temperature
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Predicted Section */}
                    <section>
                        <h2 className="text-xl font-semibold mb-3">Predicted</h2>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-3 text-center rounded shadow-sm">
                                    <Image
                                        src="/tank_UI.svg"
                                        alt="Tank SVG"
                                        width={100}
                                        height={100}
                                    />
                                    <strong>Water Level</strong>
                                </div>
                                <div className="bg-gray-50 p-3 text-center rounded shadow-sm">
                                    <PlotlyComponent
                                        data={[
                                            {
                                                x: ["Jan", "Feb", "Mar", "Apr", "May"],
                                                y: [10, 15, 13, 17, 20],
                                                type: "scatter",
                                                mode: "lines+markers",
                                                marker: { color: "blue" },
                                                name: "Water pH",
                                            },
                                        ]}
                                        layout={{ width: 600, height: 400, title: "Monthly Water pH" }}
                                        className="mx-auto"
                                    />
                                    <strong>Water pH</strong>
                                </div>
                                <div className="bg-gray-50 p-3 text-center rounded shadow-sm">
                                    <PlotlyComponent
                                        data={[
                                            {
                                                x: ["Jan", "Feb", "Mar", "Apr", "May"],
                                                y: [10, 15, 13, 17, 20],
                                                type: "scatter",
                                                mode: "lines+markers",
                                                marker: { color: "blue" },
                                                name: "Water pH",
                                            },
                                        ]}
                                        layout={{ width: 600, height: 400, title: "Monthly Water pH" }}
                                        className="mx-auto"
                                    />
                                    <strong>TDC</strong>
                                </div>
                                <div className="bg-gray-50 p-3 text-center rounded shadow-sm">
                                    <div>
                                        <PlotlyComponent
                                            data={[
                                                {
                                                    x: ["Jan", "Feb", "Mar", "Apr", "May"],
                                                    y: [10, 15, 13, 17, 20],
                                                    type: "scatter",
                                                    mode: "lines+markers",
                                                    marker: { color: "blue" },
                                                    name: "Water pH",
                                                },
                                            ]}
                                            layout={{ width: 600, height: 400, title: "Monthly Water pH" }}
                                            className="mx-auto"
                                        />
                                        <strong>Water Temperature</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Monthly Data Section */}
                <section className="mt-8">
                    <h2 className="text-xl font-semibold mb-3">Historical Data</h2>
                    <div className="bg-white rounded-lg shadow p-4">
                        {/* Example Plotly chart */}
                        <PlotlyComponent
                            data={[
                                {
                                    x: ["Jan", "Feb", "Mar", "Apr", "May"],
                                    y: [10, 15, 13, 17, 20],
                                    type: "scatter",
                                    mode: "lines+markers",
                                    marker: { color: "blue" },
                                    name: "Water pH",
                                },
                            ]}
                            layout={{ width: 600, height: 400, title: "Monthly Water pH" }}
                            className="mx-auto"
                        />
                    </div>
                </section>
            </main>
        </>
    );
};

export default Tank;