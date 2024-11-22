import React, { ReactNode } from "react";

export default function Modal({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: ReactNode }) {
  if (!isOpen) return null;

  return (
    <div className={`modal-top fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}>
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <button type="button" className="text-white absolute top-4 right-4 z-30 cursor-pointer" onClick={onClose}>X</button>
      <div className="bg-black max-w-3xl w-full p-6 rounded-lg shadow-lg z-10 flex justify-center items-center">{children}</div>
    </div>
  );
}
