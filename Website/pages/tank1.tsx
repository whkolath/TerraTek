import { NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import { ReactNode, useEffect, useState } from "react";

// 1) Dynamically import Plotly for gauge charts
const PlotlyComponent = dynamic(() => import("react-plotly.js"), { ssr: false });

// 2) Import react-liquid-gauge + D3 color libs
import LiquidFillGauge from "react-liquid-gauge";
import { color } from "d3-color";
import { interpolateRgb } from "d3-interpolate";

interface SensorReading {
    Sensor_Timestamp: string;
    Sensor_Value: number;
}

const Tank1: NextPage = () => {
    // States for each sensor
    const [waterLevelData, setWaterLevelData] = useState<SensorReading[] | null>(null);
    const [waterTempData, setWaterTempData] = useState<SensorReading[] | null>(null);
    const [pHData, setPHData] = useState<SensorReading[] | null>(null);
    const [tdcData, setTdcData] = useState<SensorReading[] | null>(null);

    useEffect(() => {
        Promise.all([
            // This section is commented out for local testing
            fetch("/api/latest/10"), // Water Level
            fetch("/api/latest/1"), // Water Temp
            fetch("/api/latest/11"), // pH
            fetch("/api/latest/9"), // TDC

            // This section is for public website
            // fetch("https://terratekrwh.com/api/latest/10"), // Water Level
            // fetch("https://terratekrwh.com/api/latest/1"), // Water Temp
            // fetch("https://terratekrwh.com/api/latest/11"), // pH
            // fetch("https://terratekrwh.com/api/latest/9"), // TDC
        ])
            .then((responses) => Promise.all(responses.map((r) => r.json())))
            .then(([data2, data3, data4, data5]) => {
                data2.reverse();
                data3.reverse();
                data4.reverse();
                data5.reverse();

                setWaterLevelData(data2);
                setWaterTempData(data3);
                setPHData(data4);
                setTdcData(data5);
            })
            .catch((err) => console.error("Error fetching data:", err));
    }, []);

    // Helper to get the last reading from each array
    function latestValue(data: SensorReading[] | null): number {
        if (!data || data.length === 0) return 0;
        return data[data.length - 1].Sensor_Value;
    }

    // Water Level
    const waterLevel = Math.round(latestValue(waterLevelData));
    const predictedWaterLevel = Math.min(waterLevel + 10, 100);

    // Water Temp (assuming sensor in Celsius -> Fahrenheit)
    const rawTemp = latestValue(waterTempData);
    const currentTempF = Math.round((rawTemp * 9) / 5 + 32);
    const predictedTempF = Math.min(currentTempF + 5, 212);

    // pH
    const currentPH = latestValue(pHData);
    const predictedPH = Math.min(currentPH + 0.2, 14);

    // TDC
    const currentTDC = latestValue(tdcData);
    const predictedTDC = currentTDC + 20;

    // Liquid gauge color logic
    const startColor = "#6495ed";
    const endColor = "#dc143c";
    const interpolate = interpolateRgb(startColor, endColor);

    function renderLiquidGauge(value: number) {
        const fillColor = interpolate(value / 100);
        const gradientStops = [
            {
                key: "0%",
                stopColor: color(fillColor)?.darker(0.5).toString(),
                stopOpacity: 1,
                offset: "0%",
            },
            {
                key: "50%",
                stopColor: fillColor,
                stopOpacity: 0.75,
                offset: "50%",
            },
            {
                key: "100%",
                stopColor: color(fillColor)?.brighter(0.5).toString(),
                stopOpacity: 0.5,
                offset: "100%",
            },
        ];

        return (
            <LiquidFillGauge
                style={{ margin: "0 auto" }}
                width={200}
                height={200}
                value={value}
                percent="%"
                textSize={1}
                textOffsetX={0}
                textOffsetY={0}
                textRenderer={(props: { height: number; width: number; textSize: number; value: number; percent: ReactNode; }) => {
                    const radius = Math.min(props.height / 2, props.width / 2);
                    const textPixels = (props.textSize * radius) / 2;
                    const valueStyle = {
                        fontSize: textPixels,
                    };
                    const percentStyle = {
                        fontSize: textPixels * 0.6,
                    };
                    const val = Math.round(props.value);

                    return (
                        <tspan>
                            <tspan className="value" style={valueStyle}>
                                {val}
                            </tspan>
                            <tspan style={percentStyle}>{props.percent}</tspan>
                        </tspan>
                    );
                }}
                riseAnimation
                waveAnimation
                waveFrequency={2}
                waveAmplitude={1}
                gradient
                gradientStops={gradientStops}
                circleStyle={{
                    fill: fillColor,
                }}
                waveStyle={{
                    fill: fillColor,
                }}
                textStyle={{
                    fill: color("#444")?.toString(),
                    fontFamily: "Arial",
                }}
                waveTextStyle={{
                    fill: color("#fff")?.toString(),
                    fontFamily: "Arial",
                }}
            />
        );
    }

    function renderGauge(value: number, title: string, range: [number, number], barColor: string) {
        return (
            <PlotlyComponent
                data={[
                    {
                        type: "indicator",
                        mode: "gauge+number",
                        value,
                        title: { text: title },
                        gauge: {
                            axis: { range },
                            bar: { color: barColor },
                        },
                    },
                ]}
                layout={{
                    autosize: true,
                    margin: { t: 20, r: 20, l: 20, b: 10 },
                }}
                useResizeHandler
                style={{ width: "100%", height: "200px" }}
            />
        );
    }

    return (
        <>
            <Head>
                <title>TerraTek</title>
                <meta name="description" content="Tank Dashboard UI" />
            </Head>

            {/* 
        We add 'auto-rows-min' to let each row auto-size to its content,
        and 'items-start' so each card starts at the top, 
        preventing overlap. 
      */}
            <main className=" bg-slate-500 p-6">
                <div
                    className="
            grid 
            grid-cols-1 
            md:grid-cols-2 
            gap-6 
            items-start 
            auto-rows-min
          "
                >
                    {/* Current Section */}
                    <section className="bg-slate-100 rounded-lg shadow p-4">
                        <h2 className="text-center text-xl font-semibold mb-3">
                            Current Freshwater Tank
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Water Level (liquid gauge) */}
                            <div className="flex flex-col items-center justify-center bg-slate-100 p-4 rounded">
                                {renderLiquidGauge(waterLevel)}
                                <span className="mt-2 font-medium">
                                    <strong>Water Level</strong>: {waterLevel}%
                                </span>
                            </div>

                            {/* Water pH */}
                            <div className="flex flex-col items-center bg-slate-100 p-4 rounded">
                                {pHData ? (
                                    renderGauge(currentPH, "", [0, 14], "blue")
                                ) : (
                                    <p>Loading pH...</p>
                                )}
                                <span className="mt-2 font-medium">
                                    <strong>Water pH</strong>
                                </span>
                            </div>

                            {/* TDC */}
                            <div className="flex flex-col items-center bg-slate-100 p-4 rounded">
                                {tdcData ? (
                                    renderGauge(currentTDC, "", [0, 500], "green")
                                ) : (
                                    <p>Loading TDC...</p>
                                )}
                                <span className="mt-2 font-medium">
                                    <strong>TDC</strong>
                                </span>
                            </div>

                            {/* Temperature */}
                            <div className="flex flex-col items-center bg-slate-100 p-4 rounded">
                                {waterTempData ? (
                                    renderGauge(currentTempF, "", [0, 212], "red")
                                ) : (
                                    <p>Loading Temperature...</p>
                                )}
                                <span className="mt-2 font-medium">
                                    <strong>Water Temperature</strong>
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Predicted Section */}
                    <section className="bg-slate-100 rounded-lg shadow p-4">
                        <h2 className=" text-center text-xl font-semibold mb-3">
                            Historical Freshwater Tank
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Predicted Water Level */}
                            <div className="flex flex-col items-center bg-slate-100 justify-center p-4 rounded">
                                {renderLiquidGauge(predictedWaterLevel)}
                                <span className="mt-2 font-medium">
                                    <strong>Water Level (Predicted)</strong>
                                </span>
                            </div>

                            {/* Predicted pH */}
                            <div className="flex flex-col items-center bg-slate-100 p-4 rounded">
                                {pHData ? (
                                    renderGauge(predictedPH, "", [0, 14], "blue")
                                ) : (
                                    <p>Loading pH...</p>
                                )}
                                <span className="mt-2 font-medium">
                                    <strong>Water pH</strong>
                                </span>
                            </div>

                            {/* Predicted TDC */}
                            <div className="flex flex-col items-center bg-slate-100 p-4 rounded">
                                {tdcData ? (
                                    renderGauge(predictedTDC, "", [0, 500], "green")
                                ) : (
                                    <p>Loading TDC...</p>
                                )}
                                <span className="mt-2 font-medium">
                                    <strong>TDC</strong>
                                </span>
                            </div>

                            {/* Predicted Temperature */}
                            <div className="flex flex-col items-center bg-slate-100 p-4 rounded">
                                {waterTempData ? (
                                    renderGauge(predictedTempF, "", [0, 212], "red")
                                ) : (
                                    <p>Loading Temperature...</p>
                                )}
                                <span className="mt-2 font-medium">
                                    <strong>Water Temperature</strong>
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Historical Data Section (3rd row, spanning 2 columns) */}
                    <section className="bg-slate-100 rounded-lg shadow p-4 md:col-span-2">
                        <h2 className="text-center text-xl font-semibold mb-3">Historical Data</h2>
                        <PlotlyComponent
                            data={[
                                {
                                    x: ["Jan", "Feb", "Mar"],
                                    y: [65, 66, 67],
                                    type: "scatter",
                                    mode: "lines+markers",
                                    marker: { color: "red" },
                                },
                            ]}
                            layout={{
                                autosize: true,
                                title: "Historical Water Temperature",
                                margin: { t: 30, r: 10, l: 40, b: 30 },
                            }}
                            useResizeHandler
                            style={{ width: "100%", height: "300px" }}
                        />
                    </section>
                </div>
            </main>
        </>
    );
};

export default Tank1;
