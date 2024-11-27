import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexDonutChart = () => {
  const [chartOptions, setChartOptions] = useState({
    series: [90, 55, 41, 17, 15],
    options: {
      chart: {
        type: 'donut',
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
  });

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={chartOptions.options}
          series={chartOptions.series}
          type="donut"
          height={350}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default ApexDonutChart;