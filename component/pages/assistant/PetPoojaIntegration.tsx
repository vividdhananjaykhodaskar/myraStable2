"use client";
import Modal from "@/component/Modal";
import { deleteIntegration } from "@/service/integrationservice";
import Image from "next/image";
import React, {  useState } from "react";
import { toast, Bounce } from "react-toastify";

function PetPoojaIntegration({ integrationConfig, handleRemove }: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleDelete = async () => {
    await deleteIntegration(integrationConfig._id).then((res) => {
      if (res.success) {
        handleToast(res.message, "success");
      } else {
        handleToast(res.message, "error");
      }
      handleRemove()
      setIsModalOpen(false);
    });
  };

  return (
    <div className="mt-8">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="bg-[rgb(0,126,90,0.3)] text-left w-2/5 border-r border-solid border-[rgb(6_21_22)] py-3 p-4 rounded-tl-xl">Rastaurant ID</th>
            <th className="bg-[rgb(0,126,90,0.3)] text-left w-2/5 border-r border-solid border-[rgb(6_21_22)] py-3 p-4">Rastaurant Name</th>
            <th className="bg-[rgb(0,126,90,0.3)] text-left py-3 p-4">Menu code</th>
            <th className="bg-[rgb(0,126,90,0.3)] rounded-tr-xl py-3 p-4"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="w-2/5 border-r border-solid border-[rgb(6_21_22)] p-3 px-4 2xl:text-base text-sm">
              {integrationConfig?.integration_details.rastaurant_id}
            </td>
            <td className="w-2/5 border-r border-solid border-[rgb(6_21_22)] p-3 px-4 2xl:text-base text-sm">
              {integrationConfig?.integration_details.rastaurant_name}
            </td>
            <td className="w-2/5 border-r border-solid border-[rgb(6_21_22)] p-3 px-4 2xl:text-base text-sm">
              {integrationConfig?.integration_details.menusharingcode}
            </td>
            <td className="w-[10%] p-3 px-4 border-l border-solid border-[rgb(6_21_22)]">
              <button type="button" onClick={() => setIsModalOpen(true)} className="w-7 h-7 block">
                <Image src="/icon/delete.svg" alt="delete" className="block" width={20} height={20} />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="rounded-md border border-[#3d3d3d] max-w-xl xl:pb-4 xl:p-8 p-6 w-full">
          <div className="mb-4">
            <h5 className="xl:text-xl max-w-60 mx-auto text-lg text-white text-center">Are you sure you want to Delete Integration</h5>
            <div></div>
            <div className="flex justify-center gap-4 my-4 modal-btns">
              <button
                type="button"
                className="bg-emerald-300 px-5 py-2 min-w-28 rounded-full max-w-fit block text-center text-black text-base hover:opacity-[0.7] transition-all"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
              <button
                className="bg-red-600 px-5 py-2 min-w-28 rounded-full max-w-fit block text-center text-white text-base hover:opacity-[0.7] transition-all"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default PetPoojaIntegration;
