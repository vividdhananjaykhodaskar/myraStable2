"use client";
import Image from "next/image";
import React, { useState } from "react";
import Logo from "@/public/images/vooyralogo.png";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { excludeHeader, excludeHeaderDynamicPaths } from "@/lib/constans";
import { logoutFunction } from "@/service/auth";
import { Bounce, toast } from "react-toastify";


function Header({ user }: any) {
  const [display, setDisplay] = useState(true);
  const router = useRouter();
  const location = usePathname();
  const shouldExclude = (exclude: any, exlcludeDynamic: any) => {
    if (exclude.includes(location)) {
      return true;
    }
    return exlcludeDynamic.some((dynamicPath: any) => {
      const dynamicPathRegex = new RegExp(`^${dynamicPath.replace(/\[.*?\]/g, ".*")}$`);
      return dynamicPathRegex.test(location);
    });
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

  return shouldExclude(excludeHeader, excludeHeaderDynamicPaths) ? null : (
    <header className="fixed z-10 top-0 left-0 w-full py-4 bg-[rgba(43,72,72,0.63)]">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between">
          <Link href="/">
            <Image
              src={"/icon/vomyraLogo.svg"}
              alt="logo"
              className="max-w-36 xl:max-w-full"
              width={200}
              height={60}
            />
          </Link>

          <ul className="flex flex-wrap nt-desctop">
            <li>
              <Link href="/contactus" className="py-2 px-4 hover:opacity-75 transition-all block">
                Contact Us
              </Link>
            </li>

            {user ? (
              <>
                <li>
                  <button
                    onClick={handleLogout}
                    className="py-2 px-4 hover:opacity-75 transition-all block"
                  >
                    Log Out
                  </button>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="block text-sm sm:text-base text-white font-semibold md:text-lg bg-[rgba(255, 255, 255, 0.05)] hover:bg-white hover:text-black border border-solid border-white rounded-full py-2 px-5 transition-all duration-200 ease-in"
                  >
                    My Account
                  </Link>
                </li>
              </>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center text-sm sm:text-base text-white font-semibold md:text-lg bg-[rgba(255,255,255,0.05)] hover:bg-white hover:text-black border border-solid border-white rounded-full py-1 px-5 transition-all duration-200 ease-in"
                >
                  Register
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center text-sm sm:text-base text-white font-semibold md:text-lg bg-[rgba(255,255,255,0.05)] hover:bg-white hover:text-black border border-solid border-white rounded-full ml-2 py-1 px-5 transition-all duration-200 ease-in"
                >
                  Login
                </Link>
              </>
            )}
          </ul>
          <ul className="flex flex-wrap nt-menus" style={{ display: !display ? "flex" : "none" }}>
            <span className="close-icon" onClick={() => setDisplay(!display)}></span>
            {user ? (
              <>
                <li>
                  <Link
                    href="/contactus"
                    className="py-2 px-4 hover:opacity-75 transition-all block"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="py-2 px-4 hover:opacity-75 transition-all block"
                  >
                    Log Out
                  </button>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="py-2 px-4 hover:opacity-75 transition-all block"
                  >
                    My Account
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/contactus"
                    className="py-2 px-4 hover:opacity-75 transition-all block"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="py-2 px-4 hover:opacity-75 transition-all block">
                    Register
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="py-2 px-4 hover:opacity-75 transition-all block">
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
          <span className="menubar" onClick={() => setDisplay(!display)}></span>
        </div>
      </div>
    </header>
  );
}

export default Header;
