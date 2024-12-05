"use client";
// forgot-password-token/page.tsx
import React, { useState } from "react";
import FormInput from "../../FormField/FormInput"; // Assuming you already have a reusable input form component
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams, useRouter } from "next/navigation";
import { verifyResetPasswordToken } from "@/service/auth";

const schema = yup.object().shape({
  newPassword: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), ""], "Passwords must match")
    .required("Confirm Password is required"),
});

function ForgotPasswordToken() {
  const { token }: { token: string } = useParams(); // Get token from URL
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState(""); // State for status messages
  const [loading, setLoading] = useState(false); // State to handle loading state

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setStatusMessage("");

    const result = await verifyResetPasswordToken(token, data.newPassword);

    if (result.success) {
      setStatusMessage(result.message); 
    } else {
      setStatusMessage(result.message);
    }

    setLoading(false); 
  };

  return (
    <div className="p-4 w-screen flex h-[inherit] relative after:h-full after:w-full after:bg-no-repeat after:bg-cover after:bg-[url('../public/images/body-bg.png')] after:absolute after:top-0 after:left-0 after:z-[2] justify-center items-center ">
      <div className="max-w-lg w-full rounded-xl bg-white/15 xl:p-8 p-5 py-6 relative z-20">
        <Image
          src={"/icon/vomyraLogo.svg"}
          width={200}
          height={100}
          alt="logo"
          className="mx-auto block rounded-full mb-4"
          onClick={() => router.push("/")}
        />
        <h2 className="text-center lg:text-2xl md:text-xl text-lg font-medium text-white lg:mb-6 mb-4">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col lg:gap-4 gap-3">
            <FormInput
              name="newPassword"
              type={"password"}
              label={"New Password"}
              placeholder={"Enter your new password"}
              error={errors.newPassword?.message}
              register={register}
              required
            />
            <FormInput
              name="confirmPassword"
              type={"password"}
              label={"Confirm New Password"}
              placeholder={"Confirm your new password"}
              error={errors.confirmPassword?.message}
              register={register}
              required
            />
            {statusMessage && (
              <p
                className={`text-center text-sm ${statusMessage.includes("successfully") ? "text-green-500" : "text-red-500"}`}
              >
                {statusMessage}
              </p>
            )}
            <button className="mt-4 w-full block bg-green-400 text-black p-2 md:text-base text-sm rounded-md uppercase font-semibold hover:bg-transparent hover:text-green-400 border border-solid border-green-400 transition-all duration-300 ease-in">
              Change Password
            </button>
            <p className="text-white text-center md:text-base text-sm mb-0">
              Remembered your password?{" "}
              <Link
                href={"/login"}
                className="text-[#E7C66C] underline font-medium"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordToken;
