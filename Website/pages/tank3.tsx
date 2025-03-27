import { NextPage } from "next";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
// Dynamically import Plotly for gauge charts
const PlotlyComponent = dynamic(() => import("react-plotly.js"), { ssr: false });

// Import react-liquid-gauge + D3 color libs
import LiquidFillGauge from "react-liquid-gauge";
import { color } from "d3-color";
import { interpolateRgb } from "d3-interpolate";
import Image from "next/image";

const Tank1: NextPage = () => {

  // Match your actual server fields: "Hourly_Timestamp" & "Sensor_Value"
interface SensorReading {
  Sensor_Timestamp: string;
  Sensor_Value: number;
  Interval_Timestamp: string;
  Calculated_Reading: number;
}

type DateRange = {
  start: Date;
  end: Date;
};

  const [time] = useState<DateRange>({
    start: new Date(new Date().setMonth(new Date().getMonth() - 3)), // 3 months ago
    end: new Date(), // Current date
  });

  const board_freshwater3 = "0xa8610a3339188011";
  const sensor_Temp = "1";
  const sensor_WaterLevel = "10";
  const aggregation = "AVG"; // AVG, MIN, MAX, MEDIAN, SUM
  const interval = "hourly"; // Options: "halfhour", "hourly", "daily"


  // Adjust states to use SensorReading
const [waterLevelData, setWaterLevelData] = useState<number | null>(null);
const [waterTempData, setWaterTempData] = useState<number | null>(null);


  const [waterLevelHData, setWaterLevelHData] = useState<SensorReading[] | null>(null);
  const [waterTempHData, setWaterTempHData] = useState<SensorReading[] | null>(null);
  

  useEffect(() => {
    const fetchHistoricalTankData= async () => {
      const [reading2, reading3] = await Promise.all([
        fetch(`/api/fetchdata/sensor-data?board=${board_freshwater3}&sensor=${sensor_WaterLevel}&calc=${aggregation}&start=${time.start.toISOString()}&end=${time.end.toISOString()}&timeinterval=${interval}`), // HistoricWater Level
        fetch(`/api/fetchdata/sensor-data?board=${board_freshwater3}&sensor=${sensor_Temp}&calc=${aggregation}&start=${time.start.toISOString()}&end=${time.end.toISOString()}&timeinterval=${interval}`),  // Historic Temp
    ]);

    // Parse the JSON from each response
    const data2 = await reading2.json();
    const data3 = await reading3.json();

    setWaterLevelHData(data2?.length > 0 ? data2 : null);
    setWaterTempHData(data3?.length > 0 ? data3 : null);
};

fetchHistoricalTankData();
}, [time]);

  useEffect(() => {
    Promise.all([
      fetch(`/api/fetchdata/sensor-data?board=${board_freshwater3}&sensor=${sensor_WaterLevel}&calc=${aggregation}&timeframe=1`), // Water Level
      fetch(`/api/fetchdata/sensor-data?board=${board_freshwater3}&sensor=${sensor_Temp}&calc=${aggregation}&timeframe=1`),  // Water Temp
    ])
      .then((responses) => Promise.all(responses.map((r) => r.json())))
      .then(([data2, data3]) => {
        // Reverse if newest reading is first
        data2.reverse();
        data3.reverse();

        setWaterLevelData(data2?.length > 0 ? parseFloat(data2[0].Calculated_Reading) : null);
        setWaterTempData(data3?.length > 0 ? parseFloat(data3[0].Calculated_Reading) : null);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const waterLevel = Math.round(waterLevelData ?? 0);
  const waterTemp = Math.round(waterTempData ?? 2);

  // Liquid gauge color logic
        const startColor = "#6495ed";
        const endColor = "#dc143c";
        const interpolate = interpolateRgb(startColor, endColor);
    
        function renderLiquidGauge(value: number, forcedColor?: string) {
            const fillColor = forcedColor ? forcedColor : interpolate(value / 100);
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
                    width={300}
                    height={300}
                    value={value}
                    percent="%"
                    textSize={1}
                    textOffsetX={0}
                    textOffsetY={0}
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
            domain: { x: [0, 1], y: [0, 1] }, // Added domain property
            gauge: {
              axis: { range },
              bar: { color: barColor },
            },
          },
        ]}
        layout={{
          autosize: true,
          margin: { t: 20, r: 20, l: 20, b: 10 },
          paper_bgcolor: "#f1f5f9",
          plot_bgcolor: "#f1f5f9",
        }}
        config={{ displayModeBar: false, responsive: true }}
        useResizeHandler
        style={{ width: "100%", height: "150px" }}
      />
    );
  }

  function renderwaterLevelScatterPlot(data: SensorReading[] | null) {
    if (!data) return <div>Loading sensor data...</div>;
    if (data.length === 0) return <div>No Fresh Water data available.</div>;
  
    const xValues = data.map((reading) => reading.Interval_Timestamp);
    const yValues = data.map((reading) => reading.Calculated_Reading);
  
    return (
      <PlotlyComponent
        data={[
          {
            type: "scatter",
            mode: "lines+markers",
            x: xValues,
            y: yValues,
            marker: { color: "blue" },
            line: { shape: "spline" },
          },
        ]}
        layout={{
          autosize: true,
          margin: { t: 20, r: 20, l: 40, b: 40 },
          xaxis: { title: "Timestamp", type: "date" },
          yaxis: { title: "Fresh Water Level (AVG)" },
          paper_bgcolor: "#f1f5f9",
          plot_bgcolor: "#f1f5f9",
        }}
        config={{ displayModeBar: false, responsive: true }}
        useResizeHandler
        style={{ width: "100%", height: "300px" }}
      />
    );
  }

  function renderTempScatterPlot() {
          if (!waterTempHData) return <div>Loading sensor data...</div>;
          if (waterTempHData.length === 0) return <div>No Fresh Water data available.</div>;
  
          const xValues = waterTempHData.map((reading) => reading.Interval_Timestamp); // Updated field
          const yValues = waterTempHData.map((reading) => reading.Calculated_Reading); // Updated field
  
          return (
              <PlotlyComponent
                  data={[
                      {
                          type: "scatter",
                          mode: "lines+markers", // Use lines for better trend visualization
                          x: xValues,
                          y: yValues,
                          marker: { color: "blue" },
                          line: { shape: "spline" }, // Smooth the line
                      },
                  ]}
                  layout={{
                      autosize: true,
                      margin: { t: 20, r: 20, l: 40, b: 40 },
                      xaxis: { title: "Timestamp", type: "date" }, // Format x-axis as date
                      yaxis: { title: "Fresh Water Level (AVG)" },
                      paper_bgcolor: '#f1f5f9',
                      plot_bgcolor: '#f1f5f9',
                  }}
                  config={{ displayModeBar: false, responsive: true }}
                  useResizeHandler
                  style={{ width: "100%", height: "300px" }} // Increased height for better visibility
              />
          );
      }

  return (
           <div className="w-full min-h-[calc(100vh-50px)] p-2 grid grid-cols-1 gap-2 lg:grid-cols-2">
             {/* Current Section */}
             <div className="bg-slate-100 shadow-sm rounded-md p-2">
               <h2 className="text-center text-lg sm:text-xl font-semibold font-mono">
                 Current Freshwater Tank 1
               </h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                 {/* Water Level */}
                 <div className="flex flex-grow flex-col items-center justify-center bg-slate-100 p-2 rounded">
                   {renderLiquidGauge(waterLevel, "blue")}
                   <span className="text-center text-sm sm:text-md font-semibold font-mono">
                     <strong>Water Level</strong>: {waterLevel}%
                   </span>
                 </div>
       
                 {/* Temperature */}
                 <div className="flex flex-grow flex-col items-center bg-slate-100 p-2 rounded">
                   {waterTempData ? renderGauge(waterTemp, "", [0, 120], "red") : <p>Loading Temperature...</p>}
                   <span className="text-center text-sm sm:text-md font-semibold font-mono">
                     <strong>Water Temperature</strong>
                   </span>
                 </div>
               </div>
             </div>
         
             {/* Historical Section */}
             <div className="bg-slate-100 shadow-sm rounded-md p-2">
               <h2 className="text-center text-lg sm:text-xl font-semibold font-mono">
                 Historical Freshwater Tank 1
               </h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                 {/* Historical Water Level */}
                 <div className="flex flex-grow flex-col items-center justify-center bg-slate-100 p-2 rounded">
                   {renderwaterLevelScatterPlot(waterLevelHData)}
                   <span className="text-center text-sm sm:text-md font-semibold font-mono">
                     <strong>Water Level Historic Data</strong>
                   </span>
                 </div>
         
                 {/* Historical Temp */}
                 <div className="flex flex-grow flex-col items-center bg-slate-100 p-2 rounded">
                   {renderTempScatterPlot()}
                   <span className="text-center text-sm sm:text-md font-semibold font-mono">
                     <strong>Water Temperature Historical Data</strong>
                   </span>
                 </div>
               </div>
             </div>
         
             {/* Image Section */}
             <div className="bg-slate-100 shadow-sm rounded-md p-2 col-span-1 lg:col-span-2 h-full flex flex-col">
               <h2 className="text-center text-lg sm:text-xl font-semibold font-mono">Tank Location</h2>
               <div className="relative h-64 sm:h-96 w-full flex justify-center items-center">
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
