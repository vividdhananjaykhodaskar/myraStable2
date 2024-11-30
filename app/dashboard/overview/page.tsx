"use client";
import ApexColumnChart from "@/component/pages/overview/ApexColumnChart";
import ApexDonutChart from "@/component/pages/overview/ApexDonutChart";
import { DatePickerWithRange } from "@/component/pages/overview/DatePickerWithRange";
import { getCallOverview } from "@/service/prservice";
import { endOfMonth, startOfMonth } from "date-fns";
import React, { useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";

const Overview = () => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const [barChartData, setBarChartData] = useState({
    datesArray: [] as string[],
    costArray: [] as number[],
  });


  const [donutChartData, setDonutChartData] = useState({
    assistanceList: [] as string[],
    noOfCallsArray: [] as number[],
    perAssistantCostArray: [] as number[],
  });

  const [data, setData] = useState({
    totalCalls: 0,
    totalCost: 0,
    totalMinutes: 0,
    avgCostPerMin: 0,
  });

  const fetchCallLogs = async (start_date: string, end_date: string) => {
    try {
      const {
        totalCalls,
        totalCost,
        totalMinutes,
        avgCostPerMin,
        currCostArray,
        dates,
        assistance,
        noOfCalls,
        perAssistantCost,
      } = await getCallOverview({ start_date, end_date });
      setData({
        totalCalls,
        totalCost,
        totalMinutes,
        avgCostPerMin,
      });

      setBarChartData({
        datesArray: dates || [],
        costArray: currCostArray || [],
      });

      setDonutChartData({
        assistanceList: assistance || [],
        noOfCallsArray: noOfCalls || [],
        perAssistantCostArray: perAssistantCost || [],
      });
    } catch (error) {
      console.error("Error fetching call logs:", error);
    }
  };

  useEffect(() => {
    if (date && date.from && date.to) {
      const startDate = new Date(date.from);
      const endDate = new Date(date.to);
      fetchCallLogs(
        `${startDate.getMonth() + 1}/${startDate.getDate()}/${startDate.getFullYear()}`,
        `${endDate.getMonth() + 1}/${endDate.getDate()}/${endDate.getFullYear()}`
      );
    }
  }, [date]);

  return (
    <div className="p-4 flex-grow w-3/4">
      <DatePickerWithRange date={date} setDate={setDate} />
      <div className="w-full gap-2 grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 pt-3 mb-6">
        <div className="grow p-4 justify-center border border-[#3d3d3d] bg-[rgba(80,80,80,0.25)] rounded-lg">
          <p className="text-md text-slate-400">No. of Calls</p>
          <p className="text-lg md:text-2xl 2xl:text-3xl text-slate-100">
            {data.totalCalls}
          </p>
        </div>

        <div className="grow p-4 justify-center border border-[#3d3d3d] bg-[rgba(80,80,80,0.25)] rounded-lg">
          <p className="text-md text-slate-400">Cost</p>
          <p className="text-lg md:text-2xl 2xl:text-3xl text-slate-100">
            ${data.totalCost.toFixed(2)}
          </p>
        </div>

        <div className="grow p-4 justify-center border border-[#3d3d3d] bg-[rgba(80,80,80,0.25)] rounded-lg">
          <p className="text-md text-slate-400">Call Minutes</p>
          <p className="text-lg md:text-2xl 2xl:text-3xl text-slate-100">
            {data.totalMinutes.toFixed(2)}
          </p>
        </div>

        <div className="grow p-4 justify-center border border-[#3d3d3d] bg-[rgba(80,80,80,0.25)] rounded-lg">
          <p className="text-md text-slate-400">Average Cost Per Minute</p>
          <p className="text-lg md:text-2xl 2xl:text-3xl text-slate-100">
            ${data.avgCostPerMin.toFixed(3)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap flex-row">
        <div className="w-full md:w-2/4 mt-3 p-0">
          <ApexColumnChart
            datesArray={barChartData.datesArray}
            costArray={barChartData.costArray}
          />
        </div>
        <div className="w-full md:w-2/4 mt-3 p-0">
          <ApexDonutChart
            noOfCallsArray={donutChartData.noOfCallsArray}
            assistanceList={donutChartData.assistanceList}
            perAssistantCostArray={donutChartData.perAssistantCostArray}
          />
        </div>
      </div>
    </div>
  );
};

export default Overview;
