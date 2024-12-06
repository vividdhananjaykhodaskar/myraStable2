import ForgotPasswordInner from "@/component/pages/forgot-password/page";
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import React from "react";

async function ForgotPassword() {
  const { user } = await validateRequest();

  if (user) {
    return redirect("/");
  }

  return (
    <div className="p-4 w-screen flex h-[inherit] relative after:h-full after:w-full after:bg-no-repeat after:bg-cover after:bg-[url('../public/images/body-bg.png')] after:absolute after:top-0 after:left-0 after:z-[2] justify-center items-center ">
      <ForgotPasswordInner />
    </div>
  );
}

export default ForgotPassword;