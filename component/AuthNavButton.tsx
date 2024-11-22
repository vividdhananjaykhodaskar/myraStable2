"use client";
import { useAppSelector } from "@/redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

function AuthNavButton({ title, path }: { title: string; path: string }) {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.insdata);

  const handleNavigate = (event: any) => {
    event.preventDefault();
    if (user) {
      router.push(path);
    } else {
      router.push("/signup");
    }
  };
  return (
    <Link
      onClick={handleNavigate}
      href="#"
      type="button"
      className="bg-[#0e3029] text-base font-normal rounded-[30px] px-[30px] py-[10px] hover:bg-white hover:text-[#0e3029] transition-all"
    >
      {title}
    </Link>
  );
}

export default AuthNavButton;
