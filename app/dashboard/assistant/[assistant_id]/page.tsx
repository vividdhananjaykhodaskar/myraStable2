"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Bounce } from "react-toastify";
import Editicon from "@/public/icon/edit.svg";
import { useAppDispatch, useAppSelector } from "@/redux";
import { deleteAssistant, duplicteAssistant, getAllUserAssistant, updateAssistant } from "@/service/assistantservice";
import { handleAssistants } from "@/redux/indSourceSlice";
import { Tooltip } from "@nextui-org/react";
import Image from "next/image";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown";
import DeleteIcon from "@/public/icon/delete.svg";
import CopyIcon from "@/public/icon/copy.svg";
import { Tabs, Tab } from "@nextui-org/react";
import PetpoojaModel from "@/component/pages/assistant/PetpoojaModel";
import PetPoojaIntegration from "@/component/pages/assistant/PetPoojaIntegration";

const AssitantConfiguration = () => {
  const openModal = () => setIsModalOpen(true);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const codeRef = useRef<HTMLDivElement>(null);
  const { currentAssistant } = useAppSelector((state) => state.insdata);
  const [complationConfig, setComplationConfig] = useState<any>(null);
  const [integrationConfig, setIntegrationConfig] = useState<any>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editToggel, setEditToggel] = useState(false);

  const share_path = useMemo(() => {
    if (complationConfig) {
      return `${window?.location.protocol}//${window?.location.host}/call/${complationConfig._id}?share=true&share_key=${complationConfig.share_key}`;
    } else {
      return "";
    }
  }, [complationConfig]);

  useEffect(() => {
    if (currentAssistant) {
      setComplationConfig(currentAssistant);

      const integration = currentAssistant.integration_id;
      if (integration && currentAssistant.integration_type === "petpooja") {
        setIntegrationConfig(integration);
      }
    }
  }, [currentAssistant]);

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

  const copyApiKey = () => {
    navigator.clipboard.writeText(share_path);
    handleToast("Copied demo link", "success");
  };

  const handleSubmit = async () => {
    const { _id, ...details } = complationConfig;
    const updateAssistent = await updateAssistant(details, _id);
    if (updateAssistent.success) {
      setEditToggel(false);
      const all_assitent: any = await getAllUserAssistant();
      if (all_assitent.success) {
        dispatch(handleAssistants(all_assitent.data));
      }
      handleToast(updateAssistent.message, "success");
    }
  };

  const handleDataChange = (e: any) => {
    const { name, value } = e.target;
    setComplationConfig({ ...complationConfig, [name]: value });
  };

  const handleCall = () => {
    router.push(`/call/${currentAssistant._id}`);
  };

  const loadAssitant = async () => {
    const all_assitent: any = await getAllUserAssistant();
    if (all_assitent.success) {
      dispatch(handleAssistants(all_assitent.data));
    }
  };

  const handleDuplicate = async (id: string) => {
    const res = await duplicteAssistant(id);
    if (res.success) {
      loadAssitant();
    }
  };

  const handleDelete = async (id: string) => {
    const res = await deleteAssistant(id);
    if (res.success) {
      loadAssitant();
    }
  };

  const handleModle = (value: boolean, success?: boolean) => {
    setIsModalOpen(value);
    if (success) {
      loadAssitant();
    }
  };

  return currentAssistant ? (
    <div className="border border-[#3d3d3d] flex-grow xl:w-4/6 w-full  xl:h-[calc(100vh-40px)] h-auto xl:mt-0 mt-5 p-5 overflow-y-auto custom-scrollbar rounded-md xl:min-h-[580px] min-h-max">
      <div className="flex items-center justify-between xl:gap-4 gap-3">
        {editToggel ? (
          <span className="inline-flex items-center w-fit bg-[rgb(110,231,183,0.25)] rounded p-2 py-2.5 gap-3 relative">
            <input
              type="text"
              name="assistent_name"
              value={complationConfig?.assistent_name}
              onChange={handleDataChange}
              className="w-fit bg-transparent text-white border-none outline-none"
            />
            <button type="button" onClick={handleSubmit} className="w-6 h-6">
              <Image src={"/icon/save.svg"} width={20} height={20} alt="edit" />
            </button>
          </span>
        ) : (
          <div className="flex items-center flex-grow bg-[rgba(80,80,80,0.25)] max-w-40 rounded-md py-1 px-3">
            <span className="flex-shrink whitespace-nowrap max-w-32 w-full overflow-hidden text-ellipsis">{complationConfig?.assistent_name}</span>
            <button onClick={() => setEditToggel(true)} className="ms-3 ">
              <Image src={Editicon} width={18} height={18} alt="edit" />
            </button>
          </div>
        )}

        <div className="flex gap-4">
          {complationConfig?.share_key && (
            <div className="flex flex-wrap items-center box-border w-[95%] sm:w-[220px] bg-secondary border border-border p-1 pl-2 rounded-xl hover:cursor-pointer justify-between">
              <span
                className="text-xs text-text/50 font-mono text-nowrap overflow-hidden block max-w-[85%] relative"
                data-testid="assistant-id-text"
                ref={codeRef}
              >
                {complationConfig?._id}
              </span>
              <div className="flex flex-row gap-x-2">
                <Tooltip
                  content="Assistant Demo"
                  style={{
                    background: "#ffffff",
                    color: "#000000",
                    padding: "4px 7px",
                    borderRadius: "5px",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  <div
                    aria-label="Share"
                    data-testid="copy-big-demo-link-button"
                    className="group bg-border/50 rounded-lg p-[6px] cursor-pointer hover:bg-border/80 active:scale-[0.95]"
                    onClick={copyApiKey}
                  >
                    <svg
                      width="21.0718"
                      height="20.9204"
                      viewBox="0 0 21.0718 20.9204"
                      fill="#ffffff"
                      stroke="none"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="w-[14px] h-[14px] fill-icon/50 group-hover:fill-primary"
                    >
                      <g>
                        <rect height="20.9204" opacity="0" width="21.0718" x="0" y="0"></rect>
                        <path
                          d="M10.4773 6.35376L9.17847 7.67212C10.4675 7.77954 11.3074 8.1604 11.9421 8.79517C13.6511 10.5042 13.6414 12.926 11.9519 14.6155L8.75855 17.7991C7.05933 19.4983 4.65698 19.5081 2.948 17.8088C1.23902 16.0901 1.24878 13.6877 2.948 11.9885L4.86206 10.0745C4.58862 9.45923 4.52027 8.72681 4.62769 8.09204L1.75659 10.9534C-0.577391 13.2971-0.596922 16.6174 1.76636 18.9807C4.13941 21.3538 7.45972 21.3342 9.7937 19.0002L13.1335 15.6506C15.4773 13.3069 15.4968 9.98657 13.1238 7.62329C12.5085 7.00806 11.7273 6.56861 10.4773 6.35376ZM10.2332 14.4006L11.532 13.0823C10.2429 12.9846 9.40308 12.594 8.76831 11.9592C7.05933 10.2502 7.06909 7.82837 8.75855 6.13892L11.9421 2.95532C13.6511 1.25611 16.0535 1.24634 17.7625 2.95532C19.4714 4.66431 19.4519 7.07642 17.7625 8.76587L15.8484 10.6799C16.1218 11.3049 16.1804 12.0276 16.0828 12.6624L18.9539 9.80103C21.2878 7.45728 21.3074 4.14673 18.9441 1.77368C16.571-0.599363 13.2507-0.579832 10.907 1.76392L7.57691 5.10376C5.23316 7.44751 5.21362 10.7678 7.58667 13.1311C8.20191 13.7463 8.98316 14.1858 10.2332 14.4006Z"
                          fill-opacity="0.85"
                        ></path>
                      </g>
                    </svg>
                  </div>
                </Tooltip>
              </div>
            </div>
          )}

          <button
            onClick={handleCall}
            className="bg-emerald-300 px-5 py-2 rounded-full whitespace-nowrap block text-center text-black 2xl:text-base text-sm hover:opacity-[0.7] transition-all ml-auto text-ellipsis overflow-hidden max-w-48 w-full min-w-40"
          >
            Talk to {complationConfig?.assistent_name}
          </button>

          <Dropdown>
            <DropdownTrigger>
              <div className="w-10 h-10 border border-[rgb(61,61,61)] rounded-md flex items-center justify-center">
                <svg
                  width="18.584"
                  height="3.7207"
                  viewBox="0 0 18.584 3.7207"
                  fill="#ffffff"
                  stroke="none"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="w-4 h-4 fill-icon/50 rotate-90"
                >
                  <g>
                    <rect height="3.7207" opacity="0" width="18.584" x="0" y="0"></rect>
                    <path
                      d="M16.3672 3.70117C17.3926 3.70117 18.2227 2.88086 18.2227 1.85547C18.2227 0.830078 17.3926 0 16.3672 0C15.3418 0 14.5117 0.830078 14.5117 1.85547C14.5117 2.88086 15.3418 3.70117 16.3672 3.70117Z"
                      fill-opacity="0.85"
                    ></path>
                    <path
                      d="M9.11133 3.70117C10.1367 3.70117 10.957 2.88086 10.957 1.85547C10.957 0.830078 10.1367 0 9.11133 0C8.08594 0 7.25586 0.830078 7.25586 1.85547C7.25586 2.88086 8.08594 3.70117 9.11133 3.70117Z"
                      fill-opacity="0.85"
                    ></path>
                    <path
                      d="M1.85547 3.70117C2.88086 3.70117 3.70117 2.88086 3.70117 1.85547C3.70117 0.830078 2.88086 0 1.85547 0C0.830078 0 0 0.830078 0 1.85547C0 2.88086 0.830078 3.70117 1.85547 3.70117Z"
                      fill-opacity="0.85"
                    ></path>
                  </g>
                </svg>
              </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions" className="bg-black p-1 border border-[rgb(61,61,61)] rounded-md">
              <DropdownItem key="copy" onClick={() => handleDuplicate(currentAssistant?._id)}>
                <div className="flex gap-3">
                  <Image src={CopyIcon} alt="copy" height={18} width={18} />
                  Duplicate
                </div>
              </DropdownItem>
              <DropdownItem key="del" onClick={() => handleDelete(currentAssistant?._id)}>
                <div className="flex gap-3">
                  <Image src={DeleteIcon} alt="Dele" height={20} width={20} />
                  Delete
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {/* Modal Section */}
      <Tabs aria-label="Options" className="kr-tabs-wrapper">
        <Tab key="model" title="Configuration" className="py-2.5 px-5 rounded-3xl">
          <div className="w-full mx-auto pb-3 border border-[#3d3d3d] rounded-md flex flex-wrap">
            <div className="p-3 flex-grow lg:w-2/3 w-full">
              <h3 className="text-base">Model</h3>
              <p className="text-xs text-[rgb(255,255,255,0.5)]">This section allows you to configure the modal for the Assistant</p>
              <div className="mt-4">
                <label htmlFor="system" className="block w-full mb-2 text-sm">
                  System Prompt
                </label>
                <textarea
                  id="system"
                  name="system_prompt"
                  placeholder="Enter system prompt"
                  className="w-full 2xl:text-base text-sm font-normal border border-[#3d3d3d] resize-none rounded-md h-72 p-3 focus:outline-0 custom-scrollbar"
                  value={complationConfig?.system_prompt}
                  onChange={handleDataChange}
                ></textarea>
              </div>
              <div className="mt-4">
                <label htmlFor="system" className="block w-full mb-2 text-sm">
                  Welcome Message
                </label>
                <textarea
                  id="system"
                  name="welcome_message"
                  placeholder="Enter welcome message"
                  className="w-full border border-[#3d3d3d] resize-none rounded-md min-h-20 p-3 focus:outline-0 custom-scrollbar"
                  value={complationConfig?.welcome_message}
                  onChange={handleDataChange}
                ></textarea>
              </div>
            </div>
            <div className="p-3 lg:w-1/3 w-full">
              <div className="mb-3">
                <div className="flex items-center justify-end mb-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-emerald-300 px-5 py-2 rounded-full w-max block text-center text-black 2xl:text-base text-sm hover:opacity-[0.7] transition-all ml-auto"
                  >
                    Update
                  </button>
                </div>
                <label htmlFor="model" className="block w-full mb-2 text-sm">
                  Model
                </label>
                <select
                  id="groq_model"
                  onChange={handleDataChange}
                  name="groq_model"
                  value={complationConfig?.groq_model}
                  className="w-full border border-[#3d3d3d] resize-none rounded-md  p-3 focus:outline-0"
                >
                  <option value="gemma2-9b-it">gemma2-9b-it</option>
                  <option value="gemma-7b-it">gemma-7b-it</option>
                  <option value="llama-3.1-70b-versatile">llama-3.1-70b-versatile</option>
                  <option value="llama-3.1-8b-instant">llama-3.1-8b-instant</option>
                  <option value="llama3-70b-8192">llama3-70b-8192</option>
                  <option value="llama3-8b-8192">llama3-8b-8192</option>
                  <option value="llama-guard-3-8b">llama-guard-3-8b</option>
                  <option value="llama3-groq-70b-8192-tool-use-preview">llama3-groq-70b-8192-tool-use-preview</option>
                  <option value="llama3-groq-8b-8192-tool-use-preview">llama3-groq-8b-8192-tool-use-preview</option>
                  <option value="mixtral-8x7b-32768">mixtral-8x7b-32768</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="knowledgebase" className="block w-full mb-2 text-sm">
                  Max Token
                </label>
                <div className="prompt-form-range">
                  <input
                    name="groq_token"
                    type="number"
                    className="complation_num block w-full p-1.5 px-3 h-10 outline-none"
                    onChange={handleDataChange}
                    value={complationConfig?.groq_token}
                  />
                </div>
              </div>
              <div className="mb-3">
                <div className="prompt-form-group">
                  <label className="block w-full mb-2 text-sm">Temperature</label>
                  <div className="prompt-form-range">
                    <input
                      type="range"
                      min={0.1}
                      max={1}
                      step={0.1}
                      name="groq_temperature"
                      onChange={handleDataChange}
                      value={complationConfig?.groq_temperature}
                    />
                    <span>{complationConfig?.groq_temperature} </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {integrationConfig && <PetPoojaIntegration integrationConfig={integrationConfig} handleRemove={() => loadAssitant()} />}
        </Tab>
        <Tab key="integration" title="Integration" className="py-2.5 px-5 rounded-3xl flex flex-wrap gap-4">
          <div
            className="border border-solid border-slate-600 rounded-2xl p-4 pb-3 flex flex-col gap-3 2xl:w-[calc(25%_-_16px)] md:w-[calc(50%_-_16px)] sm:w-[calc(50%_-_16px)] w-full flex-grow 2xl:max-w-[25%] md:max-w-[50%] sm:max-w-[50%] max-w-full flex-shrink dark:bg-gray-800 dark:border-gray-700"
            onClick={openModal}
          >
            <div className="bg-white rounded-lg p-6 shadow flex items-center justify-center relative before:block before:pt-[56.25%]">
              <Image
                src="/icon/petPooja-logo.svg"
                alt="logo"
                className="absolute top-0 left-0 w-full max-w-full h-full block object-contain object-center"
                width={120}
                height={60}
              />
            </div>
            <a href="#">
              <h5 className="text-lg mb-0 font-medium leading-normal text-white dark:text-white">Pet Pooja</h5>
            </a>
          </div>
        </Tab>
      </Tabs>

      {/* pet pooja modal */}
      <PetpoojaModel open={isModalOpen} setOpen={handleModle} currentAssistant={currentAssistant} />
    </div>
  ) : (
    <div className="flex flex-grow items-center justify-center w-10">
      <div className="spinner">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default AssitantConfiguration;
