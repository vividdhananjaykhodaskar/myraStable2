import React from "react";
import ReactApexChart from "react-apexcharts";

const ApexColumnChart = ({
  costArray,
  datesArray,
}: {
  costArray: number[];
  datesArray: string[];
}) => {
  const chartOption: any = {
    series: [
      {
        name: "Cost",
        data: costArray,
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "bar",
        toolbar: {
          show: true,
          tools: {
            download: false,
          },
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 3,
          dataLabels: {
            position: "top",
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: any) {
          return val ? val.toFixed(2) : "";
        },
        offsetY: -20,
        style: {
          fontSize: "12px",
          colors: ["#a3a3a3"],
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
          format: "dd MMM",
          formatter: undefined,
        },
        y: {
          formatter: undefined,
          title: {
            formatter: (seriesName: string) => seriesName,
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
      colors: ["#4ade80"],
      xaxis: {
        categories: datesArray,
        position: "bottom",
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          style: {
            colors: "#a3a3a3",
          },
          formatter: function (value: any) {
            const date = new Date(value);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          },
        },
        tickAmount: 10,
        crosshairs: {
          fill: {
            type: "gradient",
            gradient: {
              colorFrom: "#D8E3F0",
              colorTo: "#BED1E6",
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            },
          },
        },
      },
      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: true,
          style: {
            colors: "#a3a3a3",
          },
          formatter: function (val: any) {
            return val + " $";
          },
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
    <div className="">
    <div className="w-2/4	">
      <h4>Daily Call Cost Breakdown</h4>
    </div>
      <div id="chart">
        <ReactApexChart
          options={chartOption.options}
          series={chartOption.series}
          type="bar"
          height={350}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default ApexColumnChart;
