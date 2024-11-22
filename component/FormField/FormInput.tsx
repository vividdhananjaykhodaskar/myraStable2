'use client'
import React from "react";

const FormInput = ({ label, labelClass, type, name, id, placeholder, inputClass, required, error, register }: any) => {
  return (
    <>
      <div className="mb-2">
        <label htmlFor={id} className={`text-base text-white block font-normal mb-1 ${labelClass ? labelClass : null}`}>
          {label} {required && <sup className="text-red-600 text-sm">*</sup>}
        </label>
        <input
          type={type ? type : "text"}
          name={name}
          {...register(name)}
          id={id}
          placeholder={placeholder}
          className={`w-full focus:outline-none block bg-[#7594cd66] md:p-2 md:px-3 p-1.5 lg:text-base text-sm rounded-md text-white  ${inputClass ? inputClass : null}`}
        />
        {error && <p className="absolute text-red-4 00 text-[12px] mt-1">{error}</p>}
      </div>
    </>
  );
};

export default FormInput;
