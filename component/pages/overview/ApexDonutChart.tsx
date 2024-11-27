import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexDonutChart = ({assistanceList,noOfCallsArray}:{assistanceList:string[],noOfCallsArray:number[]}) => {
  const setupOptions= {
    series: noOfCallsArray,
    options: {
      chart: {
        type: 'donut',
      },
      labels: assistanceList,
      legend: {
        position: 'right',
        offsetY: 0,
        height: 230,
      },
      responsive: [
        {
          breakpoint: 200,
          options: {
            chart: {
              width: 50,
              height: 50,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
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