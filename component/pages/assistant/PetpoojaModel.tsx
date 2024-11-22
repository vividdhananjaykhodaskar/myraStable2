"use client";
import React, { useState } from "react";
import Modal from "@/component/Modal";
import { createInegration } from "@/service/assistantservice";
import { toast, Bounce } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";
import FormInput from "@/component/FormField/FormInput";

const schema = yup.object().shape({
  rastaurant_id: yup.string().required("This field is required"),
  rastaurant_name: yup.string().required("This field is required"),
  menusharingcode: yup.string().required("This field is required"),
});

const PetpoojaModel = ({ open, setOpen, currentAssistant }: { currentAssistant: any; open: boolean; setOpen: (value: boolean, success?: boolean) => void }) => {
  const [inegration, setInegration] = useState<any>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleIntreDataChange = (e: any) => {
    const { name, value } = e.target;
    setInegration({ ...inegration, [name]: value });
  };

  const handleToast = (message: string, type: any) => {
    toast(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      type: type,
      transition: Bounce,
    });
  };

  const handleInegration = async (value: any) => {
    const data = {
      integration_details: value,
      type: "petpooja",
      assistant_id: currentAssistant._id,
    };

    await createInegration(data).then((res) => {
      if (res.success) {
        handleToast(res.message, "success");
        setOpen(false, true);
      } else {
        handleToast(res.message, "error");
      }
    });
  };

  return (
    <Modal isOpen={open} onClose={() => setOpen(false)}>
      <div className="rounded-md border border-[#3d3d3d] p-4 max-w-3xl w-full">
        <div className="mb-4">
          <h3 className="xl:text-2xl md:text-xl text-lg text-white">Pet Pooja</h3>
        </div>

        <form onSubmit={handleSubmit(handleInegration)}>
          <div className="flex flex-wrap gap-2">
            <div className="sm:w-[calc(50%-4px)] w-full">
              <FormInput
                name="rastaurant_id"
                type={"rastaurant_id"}
                label={"Rastaurant ID"}
                placeholder={"Enter your rastaurant ID"}
                error={errors.rastaurant_id?.message}
                register={register}
                required
              />
            </div>
            <div className="sm:w-[calc(50%-4px)] w-full sm:mt-0 mt-3">
              <FormInput
                name="rastaurant_name"
                type={"rastaurant_name"}
                label={"Rastaurant Name"}
                placeholder={"Enter your rastaurant name"}
                error={errors.rastaurant_name?.message}
                register={register}
                required
              />
            </div>
          </div>

          <div className="mt-5">
            <FormInput
              name="menusharingcode"
              type={"menusharingcode"}
              label={"Menu Sharing Code"}
              placeholder={"Enter your menu sharing code"}
              error={errors.menusharingcode?.message}
              register={register}
              required
            />
          </div>

          <div className="flex gap-4 my-4 modal-btns">
            <button
              type="button"
              className="bg-emerald-300 px-4 py-2 rounded-full w-full block text-center text-black text-base hover:opacity-[0.7] transition-all"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
            <button className="bg-emerald-300 px-4 py-2 rounded-full w-full block text-center text-black text-base hover:opacity-[0.7] transition-all">
              Create
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default PetpoojaModel;
