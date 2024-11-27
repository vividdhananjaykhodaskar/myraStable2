import React from "react";
import ReactApexChart from "react-apexcharts";
import chroma from "chroma-js";

const ApexDonutChart = ({
  assistanceList,
  noOfCallsArray,
}: {
  assistanceList: string[];
  noOfCallsArray: number[];
}) => {
  // Function to generate the color gradient based on the base color
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

  const setupOptions = {
    series: noOfCallsArray,
    options: {
      labels: assistanceList,
      chart: {
        height: 350,
        type: "donut", // Keep donut type for pie chart
        toolbar: {
          show: true,
          tools: {
            download: false,
          },
        },
      },
      stroke: {
        width: 0
      },
      plotOptions: {
        pie: {
          donut: {
            size: "60%", // Adjust size of the donut
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (
          val: number,
          { seriesIndex }: { seriesIndex: number }
        ) {
          return val ? val.toFixed(2) : "";
        },
        offsetY: -20,
        style: {
          fontSize: "12px",
        },
        // Use 'color' dynamically inside the formatter function by overriding the color
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
        enabledOnSeries: undefined,
        shared: true,
        followCursor: false,
        intersect: false,
        inverseOrder: false,
        custom: undefined,
        hideEmptySeries: true,
        fillSeriesColor: false,
        theme: false,
        style: {
          fontSize: "12px",
          fontFamily: undefined,
        },
        onDatasetHover: {
          highlightDataSeries: false,
        },
        x: {
          show: true,
          formatter: undefined,
        },
        y: {
          formatter: undefined,
          title: {
            formatter: (seriesName) => seriesName,
          },
        },
        z: {
          formatter: undefined,
          title: "Size: ",
        },
        marker: {
          show: true,
        },
        items: {
          display: "flex",
        },
        fixed: {
          enabled: false,
          position: "topRight",
          offsetX: 0,
          offsetY: 0,
        },
      },
      colors: generateColorGradient("#4ade80", assistanceList.length), // Matching color for consistency
      legend: {
        position: "right",
        offsetY: 0,
        height: 230,
        labels: {
          colors: ["#444"], // Consistent legend text color
        },
        fontSize: "12px", // Matching font size for legend
      },
      title: {
        text: "Calls Distribution",
        floating: false,
        offsetY: 0,
        align: "left",
        style: {
          color: "#444",
          fontSize: "16px", // Matching title font size
          fontWeight: "bold", // Matching title font weight
        },
      },
      grid: {
        show: true,
        borderColor: "#535962", // Matching grid border color
        position: "back",
      },
    },
  };

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={setupOptions.options}
          series={setupOptions.series}
          type="donut"
          height={350}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default ApexDonutChart;
