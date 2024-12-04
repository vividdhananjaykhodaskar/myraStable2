"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { logoutFunction } from "@/service/auth";
import { usePathname, useRouter } from "next/navigation";
import { toast, Bounce } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/redux";
import Link from "next/link";
import { handleSidebar } from "@/redux/genSlice";
import RazorpayPayment from "./razorpay/RazorPayment";
import { Coins } from "lucide-react";

const Sidebar = () => {
  const [openSidebar, setOpenSidebar] = useState(true);
  const { user } = useAppSelector((state) => state.insdata);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    if (pathName === "/dashboard") {
      router.push("/dashboard/assistant");
    }
  }, [pathName]);

  const handleClick = () => {
    setOpenSidebar(!openSidebar);
    dispatch(handleSidebar(!openSidebar));
  };

  const handleLogout = async () => {
    const logoutaction = await logoutFunction();
    if (logoutaction.success) {
      router.push("/login");
    } else {
      toast(logoutaction.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  return (
    <>
      <span className="text-lg bg-black w-9 h-9 rounded-r-[10px] block text-center z-10 fixed top-4 left-0 cursor-pointer bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTEiIGhlaWdodD0iMTciIHZpZXdCb3g9IjAgMCAxMSAxNyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEuNjg3NSAxNi44MzMzTDAuMjA4MzM2IDE1LjM1NDJMNy4wNjI1IDguNUwwLjIwODMzNiAxLjY0NTgzTDEuNjg3NSAwLjE2NjY2NkwxMC4wMjA4IDguNUwxLjY4NzUgMTYuODMzM1oiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=')] bg-no-repeat bg-center" onClick={handleClick} ></span>
      <div className={`w-72 py-6 px-4 h-screen z-10 xl:static fixed border-r border-[#3d3d3d] overflow-auto bg-[#00181a] transition-all duration-300 ease-linear ${openSidebar ? "xl:translate-x-0 -translate-x-full" : "xl:-translate-x-full translate-x-0 xl:w-0 w-72"}`}>
        <span className="text-lg w-9 h-9  block text-center absolute top-2 right-3 cursor-pointer bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTMiIHZpZXdCb3g9IjAgMCAxMiAxMyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEuMzMzMzQgMTIuMzMzM0wwLjE2NjY3MiAxMS4xNjY3TDQuODMzMzQgNi41TDAuMTY2NjcyIDEuODMzMzNMMS4zMzMzNCAwLjY2NjY2OEw2LjAwMDAxIDUuMzMzMzNMMTAuNjY2NyAwLjY2NjY2OEwxMS44MzMzIDEuODMzMzNMNy4xNjY2NyA2LjVMMTEuODMzMyAxMS4xNjY3TDEwLjY2NjcgMTIuMzMzM0w2LjAwMDAxIDcuNjY2NjdMMS4zMzMzNCAxMi4zMzMzWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==')] bg-no-repeat bg-center" onClick={handleClick}></span>
        <div className="text-center border-b border-[#3d3d3d] pb-5">
          <Image
            src="/icon/vomyraLogo.svg"
            alt="logo"
            width={150}
            height={150}
            className="text-center mx-auto"
          />
        </div>
        <ul className="py-6">
          <li>
            <Link
              href="/dashboard/assistant"
              className="flex items-center gap-3 mb-4 text-white text-base"
            >
              <Image
                src="/icon/assistants.svg"
                alt=""
                width={30}
                height={30}
                className="p-2 rounded-md bg-[rgba(148,148,148,0.5)]"
              />{" "}
              Assistants
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/calllogs"
              className="flex items-center gap-3 mb-4 text-white text-base"
            >
              <Image
                src="/side-bar-icon.svg"
                alt=""
                width={30}
                height={30}
                className="p-2 rounded-md bg-[rgba(148,148,148,0.5)]"
              />{" "}
              Call Logs
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/overview"
              className="flex items-center gap-3 mb-4 text-white text-base"
            >
              <Image
                src="/overview-icon.svg"
                alt=""
                width={30}
                height={30}
                className="p-2 rounded-md bg-[rgba(148,148,148,0.5)]"
              />{" "}
              Overview
            </Link>
          </li>
        </ul>
        <RazorpayPayment/>
        <div className="flex gap-3 items-center justify-between py-5 border-t border-[#3d3d3d] bg-[#00181a] absolute w-[calc(100%-32px)] bottom-0">
          <h3 className="text-white text-base">{user?.name}</h3>
          <Coins />
          <h3 className="text-white text-base">{user?.credits.toFixed(0)}</h3>
          <a href="#" onClick={handleLogout}>
            <Image
              src="/logout.svg"
              alt="icon"
              width={30}
              height={30}
              className="p-2 rounded-md bg-[rgba(148,148,148,0.5)]"
            />
          </a>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
