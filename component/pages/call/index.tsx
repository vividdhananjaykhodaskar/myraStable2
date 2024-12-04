"use client";
import { useEffect, useState } from "react";
import App from "@/component/pages/App";
import ChatList from "@/component/pages/ChatList";
import { useAppDispatch, useAppSelector } from "@/redux";
import { getAllUserAssistant, getAssistantDetailsById, getShareAssistant, updateMenu } from "@/service/assistantservice";
import { useParams, useRouter } from "next/navigation";
// import { handleAssistants, handleCurrentAssistant } from "@/redux/indSourceSlice";

const MyCall = ({ share, share_key }: { share: boolean; share_key: string }) => {
  const router = useRouter();
  const { assistant_id } = useParams();
  const dispatch = useAppDispatch();
  const [messages, setMessages] = useState<any>([]);
  // const { assistants, currentAssistant } = useAppSelector((state) => state.insdata);
  const [loadingRes, setLoadingRes] = useState(false);
  const [callActive, setCallActive] = useState<any>(false);
  const [callstatus, setCallStatus] = useState<any>("Listening");
  const [selectedAssistant,setSelectedAssistant] = useState(null);
  const [insufficientCredit, setInsufficientCredit] = useState(false);


  useEffect(() => {
    requestWakeLock();

    const fetchTime = setTimeout(async () => {
      if (!assistant_id) {
        router.push("/");
      }

      if (share && share_key) {
        const share_assistant: any = await getShareAssistant(assistant_id, share_key);
        if (share_assistant.success) {
          new_updated_menu(share_assistant.data);
        } else if (share_assistant.status === 402) {
          setInsufficientCredit(true); // Show insufficient credit message
        } else {
          router.push("/");
        }

      } else {
        const currSelectedAssitantDetails: any = await getAssistantDetailsById(assistant_id);
        if (currSelectedAssitantDetails.success) {
          setSelectedAssistant(currSelectedAssitantDetails.data);
          new_updated_menu(currSelectedAssitantDetails.data);
        } else if (currSelectedAssitantDetails.status === 402) {
          setInsufficientCredit(true); // Show insufficient credit message
        } else {
          router.push("/");
        }
 
        // else {
        //   router.push("/");
        // }

        // let current_config: any = currentAssistant || null;
        // if (assistants.length === 0) {
        //   getAllUserAssistant().then((res: any) => {
        //     console.log(res.data,'<<<<assistance')
        //     if (res.success) {
        //       dispatch(handleAssistants(res.data));
        //       if (currentAssistant) {
        //         current_config = assistants.find((item: any) => item._id == assistant_id);
        //       }
        //       new_updated_menu(currentAssistant);
        //     } else {
        //       router.push("/");
        //     }
        //   });
        // } else if (assistants.length > 0 && !currentAssistant) {
        //   current_config = assistants.find((item: any) => item._id == assistant_id);
        //   new_updated_menu(current_config);
        // }
      }
    }, 500);

    return () => clearTimeout(fetchTime);
  }, []);

  const new_updated_menu = async (assistant: any) => {
    let system_prompt = assistant.system_prompt;
    const { integration_type, integration_id } = assistant;
    if (integration_id && integration_type === "petpooja") {
      const new_menu: any = await updateMenu(integration_id._id);
      if (new_menu.success) {
        assistant.integration_id.integration_details = new_menu.data;
        const menu_promt = new_menu.data?.restaurant_menu_prompt;
        system_prompt = system_prompt + "\n" + menu_promt;
      } else {
        system_prompt = system_prompt + "\n" +  (integration_id?.integration_details?.restaurant_menu_prompt ?? "")
      }
    }
    setSelectedAssistant(assistant)
    setMessages([{ content: system_prompt, role: "system" }]);
  };

  const handlNewMessage = (message: string, type: string) => {
    setMessages((msg: string) => [...msg, { content: message, role: type }]);
  };

  async function requestWakeLock() {
    try {
      const wakeLock = await navigator.wakeLock.request("screen");
      wakeLock.addEventListener("release", () => {
        console.log("Wake Lock was released");
      });
      console.log("Wake Lock is active");
    } catch (err: any) {
      console.error(`${err.name}, ${err.message}`);
    }
  }

  const handleCallState = (value: string | boolean, status: string) => {
    if (status === "active") {
      setCallActive(value);
    } else {
      setCallStatus(value);
    }
  };

  return (
<main className="mx-auto px-1 md:px-6 lg:px-8 h-screen -mb-[4rem] flex flex-col justify-center items-center">
  <div className="w-full overflow-hidden">
    {insufficientCredit ? (
      <div className="insufficient-credit-message flex justify-center items-center text-red-600 h-full">
        <p>Insufficient credit to continue using this service.</p>
      </div>
    ) : (
      <>
        {selectedAssistant && (
          <App
            setMessages={handlNewMessage}
            setLoadingRes={setLoadingRes}
            messages={messages}
            handleCallState={handleCallState}
            currentAssistant={selectedAssistant}
          />
        )}
        {messages.length > 1 && <ChatList messages={messages} loadingRes={loadingRes} />}
      </>
    )}
  </div>
      {callActive && (
        <div className="box-loader">
          <div className="wrapper">
            <div className="line line1"></div>
            <div className="line line1"></div>
            <div className="line line1"></div>
            <div className="line line1"></div>
            <div className="line line1"></div>
            <div className="line line1"></div>
            <div className="line line1"></div>
            <div className="line line1"></div>
            <div className="line line1"></div>
            <div className="line line1"></div>
          </div>
          <p>{callstatus}</p>
        </div>
      )}
    </main>
  );
};

export default MyCall;
