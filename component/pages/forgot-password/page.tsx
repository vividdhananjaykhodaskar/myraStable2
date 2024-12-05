"use client";
import React, { useState } from "react";
import FormInput from "../../FormField/FormInput";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { sendResetPasswordToken } from "@/service/auth";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

function ForgotPasswordInner() {
  const route = useRouter();
  const [statusMessage, setStatusMessage] = useState(""); // State for status messages
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track if API call is in progress
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    console.log("Email submitted:", data.email);
    
    setIsSubmitting(true);
    const response = await sendResetPasswordToken(data.email);
    setIsSubmitting(false); 
  
    setStatusMessage(response.message);
  };

  const getStatusClass = (message: string) => {
    return message.includes("successfully") ? "text-green-500" : "text-red-500";
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
          onClick={() => route.push("/")}
        />
        <h2 className="text-center lg:text-2xl md:text-xl text-lg font-medium text-white lg:mb-6 mb-4">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col lg:gap-4 gap-3">
            <FormInput
              name="email"
              type={"email"}
              label={"Email"}
              placeholder={"Enter your email"}
              error={errors.email?.message}
              register={register}
              required
            />
            {statusMessage && (
              <p className={`text-center text-sm ${getStatusClass(statusMessage)}`}>
                {statusMessage}
              </p>
            )}
            <button
              className="mt-4 w-full block bg-green-400 text-black p-2 md:text-base text-sm rounded-md uppercase font-semibold hover:bg-transparent hover:text-green-400 border border-solid border-green-400 transition-all duration-300 ease-in"
              disabled={isSubmitting} 
            >
              {isSubmitting ? "Sending Link..." : "Submit"} 
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

export default ForgotPasswordInner;
