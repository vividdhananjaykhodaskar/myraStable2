"use client";
import { useAppSelector } from "@/redux";
import { Coins } from "lucide-react";
import React from "react";
import RazorPayment from "@/component/pages/razorpay/RazorPayment";

const TopBar = () => {
  const { user } = useAppSelector((state) => state.insdata);

  return (
    <div className="flex flex-wrap border border-solid border-[#3d3d3d] p-3 w-full rounded-md mb-4 justify-between items-center gap-3">
      <h3 className="text-white text-base">{user?.name}</h3>
      <div className="flex flex-wrap items-center gap-3 ml-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-coins"
        >
          <circle cx="8" cy="8" r="6"></circle>
          <path d="M18.09 10.37A6 6 0 1 1 10.34 18"></path>
          <path d="M7 6h1v4"></path>
          <path d="m16.71 13.88.7.71-2.82 2.82"></path>
        </svg>
        <h3 className="text-white text-sm md:text-base bg-slate-100/10 p-2 rounded-3xl px-6">
          {user?.credits.toFixed(0)}
        </h3>
      </div>
      <RazorPayment />
    </div>
  );
};

export default TopBar;
