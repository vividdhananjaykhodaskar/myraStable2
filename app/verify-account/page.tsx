import Image from "next/image";
import React from "react";
import VerifyAccountClient from "@/component/pages/verifyAccount";
async function VerifyAccount() {
  return (
    <div className="p-4 w-screen flex h-[inherit] relative after:h-full after:w-full after:bg-no-repeat after:bg-cover after:bg-[url('../public/images/body-bg.png')] after:absolute after:top-0 after:left-0 after:z-[2] justify-center items-center ">
      <div className="p-4 w-screen flex h-[inherit] relative after:h-full after:w-full after:bg-no-repeat after:bg-cover after:bg-[url('../public/images/body-bg.png')] after:absolute after:top-0 after:left-0 after:z-[2] justify-center items-center ">
        <div className="max-w-lg w-full rounded-xl bg-white/15 xl:p-8 p-5 py-6 relative z-20">
          <h2 className="text-center lg:text-2xl md:text-xl text-lg font-medium text-white lg:mb-6 mb-4">
            Verify Account
          </h2>
          <VerifyAccountClient/>
        </div>
      </div>
    </div>
  );
}

export default VerifyAccount;
