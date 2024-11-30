"use client";
import ApexColumnChart from "@/component/pages/overview/ApexColumnChart";
import ApexDonutChart from "@/component/pages/overview/ApexDonutChart";
import { DatePickerWithRange } from "@/component/pages/overview/DatePickerWithRange";
import { getCallOverview } from "@/service/prservice";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const Overview = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());

  // State for bar chart data
  const [barChartData, setBarChartData] = useState({
    datesArray: [] as string[],
    costArray: [] as number[],
  });

  // State for donut chart data
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

  const getBillingPeriod = (date: Date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return {
      start: start.toLocaleDateString(),
      end: end.toLocaleDateString(),
    };
  };

  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const isNextDisabled = useMemo(() => {
    return (
      currentDate.getFullYear() === today.getFullYear() &&
      currentDate.getMonth() === today.getMonth()
    );
  }, [currentDate, today]);

  const { start, end } = useMemo(
    () => getBillingPeriod(currentDate),
    [currentDate]
  );

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
    fetchCallLogs(start, end);
  }, [start, end]);

  return (
    <div className="p-4 flex-grow w-3/4">
        <DatePickerWithRange />
      <div className="flex w-fit flex-row gap-1 bg-[rgba(148,148,148,0.5)] p-2 rounded-md">
        <Image src="/calender.svg" alt="" width={20} height={20} />
        <p className="text-sm text-gray-200 justify-center">Billing Period</p>
        <a href="" className="font-bold">
          <p className="text-sm">{`${start} - ${end}`}</p>
        </a>
        <button onClick={goToPreviousMonth}>
          <Image src="/chevron-left.svg" alt="" width={20} height={20} />
        </button>
        <button onClick={goToNextMonth} disabled={isNextDisabled}>
          <Image
            src="/chevron-right.svg"
            alt=""
            width={20}
            height={20}
            style={{ opacity: isNextDisabled ? 0.5 : 1 }}
          />
        </button>
      </div>

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
