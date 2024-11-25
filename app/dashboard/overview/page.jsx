"use client";
import { getCallOverview } from "@/service/prservice";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const Overview = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [data, setData] = useState({
    totalCalls: 0,
    totalCost: 0,
    totalMinutes: 0,
    avgCostPerMin:0
  });

  // Function to get the start and end of the current month
  const getBillingPeriod = (date) => {
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

  // Function to handle going to the next month
  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const { start, end } = useMemo(() =>getBillingPeriod(currentDate), [currentDate]);

  
  const fetchCallLogs = async (start_date,end_date) => {
    try {
      const data = await getCallOverview({ start_date, end_date });
      setData(prev => ({
        ...prev,
        totalCalls:data.totalCalls,
        totalCost: data.totalCost,
        totalMinutes: data.totalMinutes,
        avgCostPerMin: data.avgCostPerMin
      }));      
    } catch (error) {
      console.error("Error fetching call logs:", error);
    }
  };

  useEffect(() => {
    fetchCallLogs(start,end);
  }, [start,end]);

  return (
    <div className="p-4 flex-grow">
      <div className="flex w-fit flex-row  gap-1 bg-[rgba(148,148,148,0.5)] p-2 rounded-md">
        <Image src="/calender.svg" alt="" width={20} height={20} />
        <p className="text-sm text-gray-200 justify-center">Billing Period</p>
        <a href="" className="font-bold">
          <p className="text-sm">{`${start} - ${end}`}</p>
        </a>
        <button onClick={goToPreviousMonth}>
          <Image src="/chevron-left.svg" alt="" width={20} height={20} />
        </button>
        <button onClick={goToNextMonth}>
          <Image src="/chevron-right.svg" alt="" width={20} height={20} />
        </button>
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-2 pt-3">
        <div className="grow h-32 flex flex-col justify-center border border-[#3d3d3d] bg-[rgba(80,80,80,0.25)]   rounded-lg">
          <p className="px-3 py-1 text-md text-slate-400">No. of Calls</p>
          <p className="px-3 py-2   text-3xl text-slate-100">{data['totalCalls']}</p>
        </div>

        <div className="grow h-32 flex flex-col justify-center border border-[#3d3d3d] bg-[rgba(80,80,80,0.25)]   rounded-lg">
          <p className="px-3 py-1 text-md text-slate-400">Cost</p>
          <p className="px-3 py-2   text-3xl text-slate-100">${data['totalCost'].toFixed(2)}</p>
        </div>

        <div className="grow h-32 flex flex-col justify-center border border-[#3d3d3d] bg-[rgba(80,80,80,0.25)]   rounded-lg">
          <p className="px-3 py-1 text-md text-slate-400">Call Minutes</p>
          <p className="px-3 py-2   text-3xl text-slate-100">{data['totalMinutes'].toFixed(2)}</p>
        </div>
         
        <div className="grow h-32 flex flex-col justify-center border border-[#3d3d3d] bg-[rgba(80,80,80,0.25)]   rounded-lg">
          <p className="px-3 py-1 text-md text-slate-400">Average Cost Per Minutes</p>
          <p className="px-3 py-2   text-3xl text-slate-100">$ {data['avgCostPerMin']}</p>
        </div>
      </div>
    </div>
  );
};

export default Overview;
