import { NextPage } from "next";
// import Head from "next/head";
import dynamic from "next/dynamic";
// import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal } from "react";
import { useEffect, useState } from "react";
// Dynamically import Plotly for gauge charts
const PlotlyComponent = dynamic(() => import("react-plotly.js"), { ssr: false });

// Import react-liquid-gauge + D3 color libs
import LiquidFillGauge from "react-liquid-gauge";
import { color } from "d3-color";
import { interpolateRgb } from "d3-interpolate";
import Image from "next/image";

// Match your actual server fields: "Hourly_Timestamp" & "Sensor_Value"
interface SensorReading {
  Sensor_Timestamp: string;
  Sensor_Value: number;
}

const Tank1: NextPage = () => {
  // Adjust states to use SensorReading
  const [waterLevelData, setWaterLevelData] = useState<SensorReading[] | null>(null);
  const [waterTempData, setWaterTempData] = useState<SensorReading[] | null>(null);
  const [pHData, setPHData] = useState<SensorReading[] | null>(null);
  const [tdcData, setTdcData] = useState<SensorReading[] | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/latest/10"), // Water Level
      fetch("/api/latest/1"),  // Water Temp
      fetch("/api/latest/11"), // pH
      fetch("/api/latest/9"),  // TDC
    ])
      .then((responses) => Promise.all(responses.map((r) => r.json())))
      .then(([data2, data3, data4, data5]) => {
        // Reverse if newest reading is first
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

  // Use "Sensor_Value" from the last object
  function latestValue(data: SensorReading[] | null): number {
    if (!data || data.length === 0) return 0;
    return data[data.length - 1].Sensor_Value;
  }

  // 1) Water Level
  const waterLevel = Math.round(latestValue(waterLevelData));
  const predictedWaterLevel = Math.min(waterLevel + 10, 100);

  // 2) Water Temp (C -> F example)
  const rawTemp = latestValue(waterTempData);
  const currentTempF = Math.round((rawTemp * 9) / 5 + 32);
  const predictedTempF = Math.min(currentTempF + 5, 212);

  // 3) pH
  const currentPH = latestValue(pHData);
  const predictedPH = Math.min(currentPH + 0.2, 14);

  // 4) TDC
  const currentTDC = latestValue(tdcData);
  const predictedTDC = currentTDC + 20;

  // Liquid gauge color logic
  const startColor = "#6495ed"; // cornflowerblue
  const endColor = "#dc143c";   // crimson
  const interpolate = interpolateRgb(startColor, endColor);

  // Render the liquid gauge
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
        width={150}
        height={150}
        value={value}
        percent="%"
        textSize={1}
        textOffsetX={0}
        textOffsetY={0}
        textRenderer={(props: { height: number; width: number; textSize: number; value: number; percent: string | number; }) => {
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
        circleStyle={{ fill: fillColor }}
        waveStyle={{ fill: fillColor }}
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

  // Render a Plotly gauge
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
          paper_bgcolor: '#f1f5f9',
          plot_bgcolor: '#f1f5f9',
        }}
        config={{ displayModeBar: false, responsive: true }}
        useResizeHandler
        style={{ width: "100%", height: "150px" }}
      />
    );
  }

  return (

    <div className="w-full min-h-[calc(100vh-50px)] lg:h-[calc(100vh-50px)] grid grid-cols-1 p-2 md:grid-cols-2 gap-2">
      {/* Current Section */}
      <div className="bg-slate-100 shadow-sm rounded-md p-2">
        <h2 className="text-center text-xl font-semibold font-mono">
          Current Freshwater Tank 3
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {/* Water Level (liquid gauge) */}
          <div className="flex flex-col items-center justify-center bg-slate-100 p-2 rounded">
            {renderLiquidGauge(waterLevel)}
            <span className="text-center text-md font-semibold font-mono">
              <strong>Water Level</strong>: {waterLevel}%
            </span>
          </div>

          {/* Water pH */}
          <div className="flex flex-col items-center bg-slate-100 p-2 rounded">
            {pHData ? (
              renderGauge(currentPH, "", [0, 14], "blue")
            ) : (
              <p>Loading pH...</p>
            )}
            <span className="text-center text-md font-semibold font-mono">
              <strong>Water pH</strong>
            </span>
          </div>

          {/* TDC */}
          <div className="flex flex-col items-center bg-slate-100 p-2 rounded">
            {tdcData ? (
              renderGauge(currentTDC, "", [0, 500], "green")
            ) : (
              <p>Loading TDC...</p>
            )}
            <span className="text-center text-md font-semibold font-mono">
              <strong>TDC</strong>
            </span>
          </div>

          {/* Temperature */}
          <div className="flex flex-col items-center bg-slate-100 p-2 rounded">
            {waterTempData ? (
              renderGauge(currentTempF, "", [0, 212], "red")
            ) : (
              <p>Loading Temperature...</p>
            )}
            <span className="text-center text-md font-semibold font-mono">
              <strong>Water Temperature</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Predicted Section */}
      <div className="bg-slate-100 shadow-sm rounded-md p-2">
        <h2 className="text-center text-xl font-semibold font-mono">
          Historical Freshwater Tank 3
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {/* Predicted Water Level */}
          <div className="flex flex-col items-center bg-slate-100 justify-center p-2 rounded">
            {renderLiquidGauge(predictedWaterLevel)}
            <span className="text-center text-md font-semibold font-mono">
              <strong>Water Level (Predicted)</strong>
            </span>
          </div>

          {/* Predicted pH */}
          <div className="flex flex-col items-center bg-slate-100 p-2 rounded">
            {pHData ? (
              renderGauge(predictedPH, "", [0, 14], "blue")
            ) : (
              <p>Loading pH...</p>
            )}
            <span className="text-center text-md font-semibold font-mono">
              <strong>Water pH</strong>
            </span>
          </div>

          {/* Predicted TDC */}
          <div className="flex flex-col items-center bg-slate-100 p-2 rounded">
            {tdcData ? (
              renderGauge(predictedTDC, "", [0, 500], "green")
            ) : (
              <p>Loading TDC...</p>
            )}
            <span className="text-center text-md font-semibold font-mono">
              <strong>TDC</strong>
            </span>
          </div>

          {/* Predicted Temperature */}
          <div className="flex flex-col items-center bg-slate-100 p-2 rounded">
            {waterTempData ? (
              renderGauge(predictedTempF, "", [0, 212], "red")
            ) : (
              <p>Loading Temperature...</p>
            )}
            <span className="text-center text-md font-semibold font-mono">
              <strong>Water Temperature</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Historical Data Section (3rd row, spanning 2 columns) */}
      <div className="bg-slate-100 shadow-sm rounded-md p-2 md:col-span-2 h-full flex flex-col">
        <h2 className="text-center text-xl font-semibold font-mono">Tank Location</h2>
        <div className="relative h-96 w-full justify-center items-center">
          <Image
            src="/Tank_Images/fw3.png"
            alt="Tank Location"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>
    </div>


  );
};

export default Tank1;
