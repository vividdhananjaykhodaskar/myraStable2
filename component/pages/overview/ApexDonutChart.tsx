import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import chroma from "chroma-js";

const ApexDonutChart = ({
  assistanceList,
  noOfCallsArray,
  perAssistantCostArray,
}: {
  assistanceList: string[];
  noOfCallsArray: number[];
  perAssistantCostArray: number[];
}) => {
  const [activeTab, setActiveTab] = useState<"calls" | "cost">("calls");

  function generateColorGradient(baseColor: string, steps = 10) {
    return chroma
      .scale([
        chroma(baseColor).set("hsl.l", 0.9).hex(),
        baseColor,
        chroma(baseColor).set("hsl.l", 0.1).hex(),
      ])
      .mode("lab")
      .colors(steps)
      .reverse();
  }

  function getTextColorBasedOnBackground(color: string) {
    const luminance = chroma(color).luminance();
    return luminance > 0.5 ? "#000000" : "#ffffff";
  }

  const textColors = generateColorGradient(
    "#4ade80",
    assistanceList.length
  ).map((color) => getTextColorBasedOnBackground(color));

  const chartData =
    activeTab === "calls" ? noOfCallsArray : perAssistantCostArray;
  const chartTitle =
    activeTab === "calls" ? "Calls Distribution" : "Cost Distribution";

  const setupOptions = {
    series: chartData,
    options: {
      labels: assistanceList,
      chart: {
        height: 350,
        type: "donut",
        toolbar: {
          show: true,
          tools: {
            download: false,
          },
        },
      },
      stroke: {
        width: 0,
      },
      plotOptions: {
        pie: {
          donut: {
            size: "60%",
          },
        },
      },
      dataLabels: {
        enabled: true,
        offsetY: -20,
        style: {
          fontSize: "12px",
          colors: textColors,
        },
        dropShadow: {
          enabled: true,
          blur: 3,
          left: 0,
          top: 1,
          opacity: 0.2,
        },
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: (value: number) =>
            activeTab === "calls" ? value.toFixed(2) : `$ ${value.toFixed(2)}`,
          title: {
            formatter: (seriesName: string) => seriesName,
          },
        },
      },
      colors: generateColorGradient("#4ade80", assistanceList.length),
      legend: {
        position: "right",
        offsetY: 0,
        height: 230,
        labels: {
          colors: "#ffffff",
        },
        fontSize: "12px",
        markers: {
          offsetX: -8,
        },
      },
      title: {
        text: chartTitle,
        floating: false,
        offsetY: 0,
        align: "left",
        style: {
          color: "#FFFFFF",
          fontSize: "16px",
          fontWeight: "bold",
        },
      },
      grid: {
        show: true,
        borderColor: "#535962",
        position: "back",
      },
    },
  };

  return (
    <div>
      {/* Tabs for switching */}
      <div className="w-full">
        <div className="relative right-0">
          <ul
            className="relative flex flex-wrap px-1.5 py-1.5 list-none rounded-md bg-slate-100"
            data-tabs="tabs"
            role="list"
          >
            <li
              className={`z-30 flex-auto text-center ${
                activeTab === "calls" ? "bg-slate-300" : "bg-inherit"
              }`}
            >
              <a
                onClick={() => setActiveTab("calls")}
                className="z-30 flex items-center justify-center w-full px-0 py-2 text-sm mb-0 transition-all ease-in-out border-0 rounded-md cursor-pointer text-slate-600"
                role="tab"
                aria-selected={activeTab === "calls"}
              >
                Calls
              </a>
            </li>
            <li
              className={`z-30 flex-auto text-center ${
                activeTab === "cost" ? "bg-slate-300" : "bg-inherit"
              }`}
            >
              <a
                onClick={() => setActiveTab("cost")}
                className="z-30 flex items-center justify-center w-full px-0 py-2 mb-0 text-sm transition-all ease-in-out border-0 rounded-lg cursor-pointer text-slate-600"
                role="tab"
                aria-selected={activeTab === "cost"}
              >
                Cost
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Chart */}
      <div id="chart">
        <ReactApexChart
          options={setupOptions.options}
          series={setupOptions.series}
          type="donut"
          height={350}
        />
      </div>
    </div>
  );
};

export default ApexDonutChart;
