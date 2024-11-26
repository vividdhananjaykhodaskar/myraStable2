"use client";
import React from "react";
import FormInput from "../../FormField/FormInput";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupFunction } from "@/service/auth";
import { useRouter } from "next/navigation";
import { toast, Bounce } from "react-toastify";
import { handleUser } from "@/redux/indSourceSlice";
import { useAppDispatch } from "@/redux";

const schema = yup.object().shape({
  name: yup.string().required("Email is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confpassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

const SignUp = () => {
  const route = useRouter();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    const loginUser: any = await signupFunction(data);
    if (loginUser.success) {
      dispatch(handleUser(loginUser.data));
      toast(loginUser.message, {
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
      reset();
    } else {
      toast(loginUser.message, {
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
    <div className="max-w-lg w-full rounded-xl bg-white/15 xl:p-8 p-5 py-6 relative z-20">
      <Image
        src={"/icon/vomyraLogo.svg"}
        width={200}
        height={80}
        alt="logo"
        className="mx-auto block rounded-full mb-3"
        onClick={() => route.push("/")}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col lg:gap-4 gap-3">
          <FormInput
            name="name"
            label={"First Name"}
            placeholder={"Enter your first name"}
            error={errors.name?.message}
            register={register}
            required
          />
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
            placeholder={"Enter password"}
            error={errors.password?.message}
            register={register}
            required
          />
          <FormInput
            name="confpassword"
            type={"password"}
            label={"Confirm Password"}
            placeholder={"Enter confirm password"}
            error={errors.confpassword?.message}
            register={register}
            required
          />
          <button className="mt-4 w-full block bg-[#E7C66C] text-black p-2 md:text-base text-sm rounded-md uppercase font-semibold hover:bg-transparent hover:text-[#E7C66C] border border-solid border-[#E7C66C] transition-all duration-300 ease-in">
            Submit
          </button>
          <p className="text-white text-center md:text-base text-sm mb-0">
            If you alrady account{" "}
            <Link href={"/login"} className="text-[#E7C66C] underline font-medium">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
