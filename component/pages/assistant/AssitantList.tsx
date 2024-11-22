"use client";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux";
import { handleAssistants, handleCurrentAssistant } from "@/redux/indSourceSlice";
import { createAssistant, getAllUserAssistant } from "@/service/assistantservice";
import { useParams, useRouter } from "next/navigation";
import Modal from "@/component/Modal";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "@/component/FormField/FormInput";
import { toast, Bounce } from "react-toastify";

const schema = yup.object().shape({
  name: yup.string().required("Password is required"),
});

const AssitantList = () => {
  const { assistant_id } = useParams();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { assistants } = useAppSelector((state) => state.insdata);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  React.useEffect(() => {
    if (assistants.length === 0) {
      getAllUserAssistant().then((res: any) => {
        if (res.success) {
          dispatch(handleAssistants(res.data));
          if (res.data.length > 0 && !assistant_id) {
            dispatch(handleCurrentAssistant(res.data[0]));
            router.push(`/dashboard/assistant/${res.data[0]._id}`);
          } else if (assistant_id) {
            dispatch(handleCurrentAssistant(res.data.find((item: any) => item._id == assistant_id)));
            router.push(`/dashboard/assistant/${assistant_id}`);
          }
        }
      });
    } else if (assistants.length > 0 && !assistant_id) {
      dispatch(handleCurrentAssistant(assistants[0]));
      router.push(`/dashboard/assistant/${assistants[0]._id}`);
    } else if (assistants.length > 0 && assistant_id) {
      let cr_assisten = assistants.find((item: any) => item._id == assistant_id);
      if (!cr_assisten) {
        cr_assisten = assistants[0];
      }
      dispatch(handleCurrentAssistant(cr_assisten));
      router.push(`/dashboard/assistant/${cr_assisten?._id}`);
    }
  }, [assistants]);

  const loadAssitant = async () => {
    const all_assitent: any = await getAllUserAssistant();
    if (all_assitent.success) {
      dispatch(handleAssistants(all_assitent.data));
    }
  };

  const onSubmit = async (data: any) => {
    const new_assistant: any = await createAssistant(data);
    if (new_assistant.success) {
      await loadAssitant();
      router.push(`/dashboard/${new_assistant.data._id}`);
      dispatch(handleCurrentAssistant(new_assistant.data));
      closeModal();
      reset();
    } else {
      toast(new_assistant.message, {
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
    <>
      <div className="border flex flex-col border-[#3d3d3d] xl:w-72 w-full xl:h-[calc(100vh-40px)] h-auto rounded-md xl:mr-4 mr-0 xl:min-h-[580px] min-h-max relative">
        <div className="p-5 sticky flex-shrink">
          <button
            type="button"
            onClick={openModal}
            className="bg-emerald-300 flex-shrink px-4 py-2 rounded-full w-full block text-center text-black 2xl:text-base text-sm hover:opacity-[0.7] transition-all sticky top-0"
          >
            Create Assistant
          </button>
        </div>
        <div className="p-5 flex flex-col xl:gap-5 lg:gap-4 gap-3 overflow-y-auto custom-scrollbar">
          {assistants.map((item: any) => (
            <div
              key={item._id}
              className={`min-h-20 relative p-2 bg-[rgb(0,126,90,0.3)] rounded-md cursor-pointer ${assistant_id === item._id ? "bg-[rgb(0,126,90,0.8)]" : ""}`}
              onClick={() => {
                dispatch(handleCurrentAssistant(item));
                router.push(`/dashboard/assistant/${item._id}`);
              }}
            >
              <h3 className="text-white text-base font-medium pr-5 whitespace-nowrap w-full text-ellipsis overflow-hidden">{item.assistent_name}</h3>
              <span className="block text-[rgb(255, 255, 255, 0.5)] text-xs mt-1 pr-5">{item.groq_model}</span>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="rounded-md border border-[#3d3d3d] p-4 w-full">
          <div className="mb-4">
            <h3 className="xl:text-2xl md:text-xl text-lg text-white">Create Assistant</h3>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormInput
              name="name"
              type={"text"}
              label={"Assistant Name"}
              placeholder={"Enter your assistant name"}
              error={errors.name?.message}
              register={register}
              required
            />
            <div className="flex gap-x-4 mt-4 p-0 modal-btns">
              <button
                type="button"
                className="bg-emerald-300 px-4 py-2 rounded-full w-full block text-center text-black text-base hover:opacity-[0.7] transition-all"
                onClick={closeModal}
              >
                Close
              </button>
              <button
                type="submit"
                className="bg-emerald-300 px-4 py-2 rounded-full w-full block text-center text-black text-base hover:opacity-[0.7] transition-all"
              >
                Create Assistant
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default AssitantList;
