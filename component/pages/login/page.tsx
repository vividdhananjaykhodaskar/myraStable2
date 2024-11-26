"use client";
import React, { useState } from "react";
import FormInput from "../../FormField/FormInput";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginFunction, resendVerification } from "@/service/auth";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux";
import { handleUser } from "@/redux/indSourceSlice";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

function LoginInner() {
  const route = useRouter();
  const dispatch = useAppDispatch();
  const [resendEmail, setResendEmail] = useState(""); // State to track resend button visibility
  const [statusMessage, setStatusMessage] = useState(""); // State for status messages
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    const loginUser: any = await loginFunction(data);
    if (loginUser.success) {
      dispatch(handleUser(loginUser.data));
      route.push("/dashboard");
    } else {
      setResendEmail(loginUser?.statusCode === 403 ? data.email : "");
      setError("password", {
        type: "manual",
        message: loginUser.message,
      });
    }
  };

  const handleResendVerification = async () => {
    try {
      const response = await resendVerification(resendEmail);
      if (response.success) {
        setStatusMessage(
          "Verification email sent successfully. Please check your email."
        );
        reset();
      } else {
        setStatusMessage(
          response.message || "Failed to resend verification email."
        );
      }
    } catch (error) {
      setStatusMessage(
        "An error occurred while sending the verification email."
      );
    }
    setResendEmail(""); // Hide resend button after the action
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
          Welcome back
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
            <FormInput
              name="password"
              type={"password"}
              label={"Password"}
              placeholder={"Enter your password"}
              error={errors.password?.message}
              register={register}
              required
            />
            {resendEmail && (
              <button
                type="button"
                className="underline text-green-400"
                onClick={handleResendVerification}
              >
                Resend Verification Email
              </button>
            )}
            {statusMessage && !resendEmail && (
              <p
                className={`text-center text-sm ${statusMessage.includes("successfully") ? "text-green-500" : "text-red-500"}`}
              >
                {statusMessage}
              </p>
            )}
            <button className="mt-4 w-full block bg-green-400 text-black p-2 md:text-base text-sm rounded-md uppercase font-semibold hover:bg-transparent hover:text-green-400 border border-solid border-green-400 transition-all duration-300 ease-in">
              Submit
            </button>
            <p className="text-white text-center md:text-base text-sm mb-0">
              If you don't have account{" "}
              <Link
                href={"/signup"}
                className="text-[#E7C66C] underline font-medium"
              >
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginInner;
