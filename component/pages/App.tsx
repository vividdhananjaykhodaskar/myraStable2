"use client";
import { useEffect, useRef, useState } from "react";
import { LiveConnectionState, LiveTranscriptionEvent, LiveTranscriptionEvents, useDeepgram } from "../../lib/context/DeepgramContextProvider";
import useAudioRecord, { MicrophoneEvents, MicrophoneState } from "../../lib/context/MicrophoneContextProvider";
import { handleGroq } from "@/service/groqService";
import { generateSpeech, generateSpeechNew } from "@/service/azureservice";
import Loader from "@/component/Loader";
import { createCall, CreateOrder, createPosOrder, endCall, updateCall } from "@/service/prservice";
import moment from "moment";
import { useAppSelector } from "@/redux";
import { useParams, useSearchParams } from "next/navigation";
import { toast, Bounce } from "react-toastify";
import {socket}  from '../../app/socket'

type DeviceType = "desktop" | "iOS" | "Android";

const App = ({
  setMessages,
  setLoadingRes,
  messages,
  handleCallState,
  currentAssistant
}: {
  setMessages: (message: string, type: string) => void;
  setLoadingRes: (value: boolean) => void;
  handleCallState: (value: string | boolean, type: string) => void;
  messages: any;
  currentAssistant:any
}) => {
  const { assistant_id } = useParams();
  const param = useSearchParams();
  const callIntervalRef = useRef<any>(null);
  const stateRef = useRef<any>(null);
  const speakRef = useRef<any>(null);
  const scntenceRef = useRef<string[]>([]);
  const captionTimeout = useRef<any>();

  const audiocontaxtRef = useRef<any>(null);
  const audioSourceRef = useRef<any>(null);
  const audioBufferQueue = useRef<any>([]);
  const intruptRef = useRef<any>(false);
  const gainNodeRef = useRef<any>(null);

  const keepAliveInterval = useRef<any>();
  const [caption, setCaption] = useState<any>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { connection, connectToDeepgram, connectionState, disconnectFromDeepgram } = useDeepgram();
  const [setaudioListen, microphone, microphoneState]: any = useAudioRecord();
  // const { currentAssistant } = useAppSelector((state) => state.insdata);

  const [retData, setRetData] = useState<any>({});
  const [listening, setListening] = useState(false);
  const [currentCall, setCurrentCall] = useState<any>(null);
  
  const deviceType = getDeviceType();

  useEffect(() => {
    if (currentAssistant && currentAssistant.integration_type === "petpooja") {
      const { integration_id } = currentAssistant;

      const details = {
        restID: integration_id?.integration_details?.menusharingcode,
        taxes: integration_id?.integration_details?.taxes ?? [],
        discounts: integration_id?.integration_details?.discounts ?? [],
      };
      setRetData(details);
    }
  }, [currentAssistant]);

  const handleToast = (message: string, type: any) => {
    toast(message, {
      position: "top-right",
      autoClose: 1000,
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

  useEffect(() => {
    if (connection && connectionState === LiveConnectionState.OPEN && connection["_socket"]["readyState"] === 1 && loading) {
      setLoading(false);
      setListening(true);
      setaudioListen(true);

      connection.addListener(LiveTranscriptionEvents.Transcript, onTranscript);
      microphone.addEventListener(MicrophoneEvents.DataAvailable, onData);

      return () => {
        connection.removeListener(LiveTranscriptionEvents.Transcript, onTranscript);
        microphone.removeEventListener(MicrophoneEvents.DataAvailable, onData);
      };
    }
  }, [connectionState, connection]);

  useEffect(() => {
    if (!connection) return;
    if (microphoneState !== MicrophoneState.Open && connectionState === LiveConnectionState.OPEN) {
      connection.keepAlive();

      keepAliveInterval.current = setInterval(() => {
        connection.keepAlive();
      }, 10000);
    } else {
      clearInterval(keepAliveInterval.current);
    }

    return () => {
      clearInterval(keepAliveInterval.current);
    };
  }, [microphoneState, connectionState]);

  useEffect(() => {
    if (caption) {
      getTranscribeResponse(caption);
    }
  }, [caption]);

  useEffect(()=>{
    socket.on('callStarted',(callDataId:string)=>{
      setCurrentCall(callDataId);
    })
  },[])

  function getDeviceType(): DeviceType {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

    if (/android/i.test(userAgent)) {
      return "Android";
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !("MSStream" in window)) {
      return "iOS";
    }
    return "desktop";
  }

  const onData = (e: BlobEvent) => {
    if (e.data.size > 0) {
      connection?.send(e.data);
    }
  };

  const handleState = (state: string) => {
    handleCallState(state, "state");
    if (speakRef.current) {
      clearTimeout(speakRef.current);
    }
    if (state === "Assistant Speaking") return;

    setTimeout(() => {
      handleCallState("Listening", "state");
    }, 1000);
  };

  const onTranscript = (data: LiveTranscriptionEvent) => {
    const { is_final: isFinal, speech_final: speechFinal } = data;
    let thisCaption = data.channel.alternatives[0].transcript;

    if (thisCaption) {
      if (stateRef.current) {
        stateRef.current.abort();
        stateRef.current = null;
      }

      if (audioSourceRef.current) {
        intruptRef.current = true;
        audioSourceRef.current.stop();
        audioSourceRef.current = null;
      }
    }

    if (isFinal && speechFinal) {
      if (thisCaption) {
        scntenceRef.current.push(thisCaption);
      }

      if (scntenceRef.current.length > 0) {
        setCaption(scntenceRef.current.join(" "));
        scntenceRef.current = [];

        clearTimeout(captionTimeout.current);
        captionTimeout.current = setTimeout(() => {
          setCaption(undefined);
          clearTimeout(captionTimeout.current);
        }, 3000);
      }
    } else if (isFinal && thisCaption !== "") {
      scntenceRef.current.push(thisCaption);
    } else if (!thisCaption && scntenceRef.current.length > 0) {
      setCaption(scntenceRef.current.join(" "));
      scntenceRef.current = [];

      clearTimeout(captionTimeout.current);
      captionTimeout.current = setTimeout(() => {
        setCaption(undefined);
        clearTimeout(captionTimeout.current);
      }, 3000);
    }
  };

  const processchunckdevice = (reader: any) => {
    if (deviceType == "iOS") {
      processAudioChunkIOS(reader);
    } else {
      processAudioChunkOther(reader);
    }
  };

  const processAudioChunkOther = (reader: any) => {
    let audio_chunk: any = [];
    let played = false;
    reader?.read().then(async function processStream({ done, value }: any) {
      try {
        if (intruptRef.current) {
          return;
        }

        if (value) {
          audio_chunk.push(value);
        }

        const totalLength = audio_chunk.reduce((acc: number, chunk: any) => acc + chunk.length, 0);

        if ((totalLength >= 8000 || done) && totalLength > 0) {
          const mergedChunk = new Uint8Array(totalLength);
          let offset = 0;
          for (const chunk of audio_chunk) {
            mergedChunk.set(chunk, offset);
            offset += chunk.length;
          }

          try {
            if (audiocontaxtRef.current.state === "suspended") {
              await audiocontaxtRef.current.resume();
            }
            const audioBuffer = await audiocontaxtRef.current.decodeAudioData(mergedChunk.buffer);
            audioBufferQueue.current.push(audioBuffer);
          } catch (error: any) {
            handleToast(error.name + " decode", "info");
          }

          if (!played && audioBufferQueue.current.length > 0) {
            played = true;
            playNextBuffer();
          }

          audio_chunk = [];
        }

        if (done) return;

        reader.read().then(processStream);
      } catch (error: any) {
        handleToast(error.name, "info");
      }
    });
  };

  const processAudioChunkIOS = (reader: any) => {
    let audio_chunk: any = [];
    reader?.read().then(async function processStream({ done, value }: any) {
      try {
        if (intruptRef.current) {
          return;
        }

        if (value) {
          audio_chunk.push(value);
        }

        if (done) {
          const totalLength = audio_chunk.reduce((acc: number, chunk: any) => acc + chunk.length, 0);
          const mergedChunk = new Uint8Array(totalLength);
          let offset = 0;
          for (const chunk of audio_chunk) {
            mergedChunk.set(chunk, offset);
            offset += chunk.length;
          }
          const audioBuffer = await audiocontaxtRef.current.decodeAudioData(mergedChunk.buffer);
          audioBufferQueue.current.push(audioBuffer);
          if (audioBufferQueue.current.length > 0) {
            playNextBuffer();
          }
          return;
        }

        reader.read().then(processStream);
      } catch (error: any) {
        handleToast(error.name, "info");
      }
    });
  };

  const playNextBuffer = async () => {
    if (audioBufferQueue.current.length > 0) {
      const buffer = audioBufferQueue.current.shift();
      const source = audiocontaxtRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(gainNodeRef.current);
      source.start();
      audioSourceRef.current = source;
      source.onended = () => {
        if (intruptRef.current) {
          audioBufferQueue.current = [];
          intruptRef.current = false;
          return;
        }
        playNextBuffer();
      };
    } else {
      if (audioSourceRef.current) {
        handleCallState("Listening", "");
        audioSourceRef.current = null;
      }
    }
  };

  const startListen = async () => {
    if (!microphone) return;
    const audioElement: any = document.getElementById("stream_audio_id");
    const context = new (window.AudioContext || window.webkitAudioContext)();
    context.createMediaElementSource(audioElement);
    let gainNode = context.createGain();
    gainNode.gain.setValueAtTime(1, context.currentTime); 
    gainNode.connect(context.destination);

    if (context.state === "suspended") {
      context.resume();
    }

    audiocontaxtRef.current = context;
    gainNodeRef.current = gainNode;

    const new_signal = handleSignal();
    if (currentAssistant?.welcome_message) {
      const reader: any = await generateSpeechNew(currentAssistant?.welcome_message, currentCall, new_signal, currentAssistant?.groq_model_voice);
      processchunckdevice(reader);
    }

    if (microphoneState === MicrophoneState.Ready && connectionState !== LiveConnectionState.OPEN) {
      setLoading(true);
      await connectToDeepgram({
        model: "nova-2",
        language: "hi",
        punctuate: true,
        encoding: "linear16",
        channels: 1,
        sampleRate: 16000,
        interim_results: true,
        utterance_end_ms: 1000,
        endpointing: 300,
        smart_format: true,
        diarize: true,
      }).then(async () => {
        setTimeout(() => {
          handleCallState(true, "active");
        }, 1000);
        const callDataPayload = {
          completion_model: currentAssistant?.groq_model,
          assistant:assistant_id,
          user_id: currentAssistant?.user_id,
          character_count: currentAssistant?.welcome_message.length ?? 0,
          welcomeMessage: currentAssistant?.welcome_message ?? "",
        }
        // const callData = await createCall(callDataPayload);
        socket.emit('createCall',callDataPayload)
        // if (callData) {
        //   setCurrentCall(callData);
        //   callIntervalRef.current = setInterval(() => {
        //     updateCall(callData, { last_activity: new Date() });
        //   }, 10000);
        // }
      });
    }
  };

  const stopListen = () => {
    if (!microphone) return;
    if (!connection) return;
    setaudioListen(false);
    setListening(false);

    if (audioSourceRef.current) {
      intruptRef.current = true;
      audioSourceRef.current.stop();
      audioSourceRef.current = null;
    } 

    connection.removeListener(LiveTranscriptionEvents.Transcript, onTranscript);
    microphone.removeEventListener(MicrophoneEvents.DataAvailable, onData);
    disconnectFromDeepgram();
    endCall(currentCall);
    handleCallState(false, "active");
    if (callIntervalRef.current) {
      clearInterval(callIntervalRef.current);
    }
    clearTimeout(captionTimeout.current);
  };

  const getTranscribeResponse = async (speech_text: string) => {
    setMessages(speech_text, "user");
    generateApiResponse(speech_text);
  };

  const generateApiResponse = async (speech_text: string) => {
    setLoadingRes(true);
    handleCallState("Thinking", "");
    let new_signal = handleSignal();
    const new_messagArr = [...messages, { content: speech_text, role: "user" }];
    const openAIResponse = await handleGroq(new_messagArr, currentAssistant, currentCall, new_signal);
    stateRef.current = null;
    if (!openAIResponse) return;

    let reader: any = "";
    let isResponse = false;
    if (currentAssistant && currentAssistant?.integration_type === "petpooja") {
      const new_order = await confirm_order_verify(openAIResponse);
      if (new_order) {
        isResponse = true;
        if (new_order.data.clientOrderID) {
          await createPosOrder(currentAssistant._id, {
            order_id: new_order.data.clientOrderID,
            user_id: currentAssistant.user_id,
            restaurant_id: currentAssistant.integration_id?.integration_details?.menusharingcode,
          });
        }
        const last_msg = `आपके ऑर्डर के लिए धन्यवाद, आपकी ऑर्डर आईडी है: ${new_order.data.clientOrderID}`; 
        
        reader = await generateSpeech(last_msg, currentCall, new_signal);
        setMessages(last_msg, "assistant");
        stopListen();
      }
    }

    if (!isResponse) {
      new_signal = handleSignal();
      setMessages(openAIResponse, "assistant");
      reader = await generateSpeechNew(openAIResponse, currentCall, new_signal, currentAssistant.groq_model_voice);
    }

    if (reader) {
      handleState("Assistant Speaking");
      stateRef.current = null;
      processchunckdevice(reader);
    }

    setLoadingRes(false);
  };

  const handleSignal = () => {
    const controller = new AbortController();
    stateRef.current = controller;
    return controller.signal;
  };

  const confirm_order_verify = async (text: string) => {
    try {
      const start_index = text.indexOf("[");
      const last_index = text.lastIndexOf("]");
      if (start_index >= 0 && last_index >= 0) {
        const order_id = text.substring(start_index, last_index + 1);
        const order_array = JSON.parse(order_id);
        return create_order(order_array, {});
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const create_order = async (order_data: any[], customer: any) => {
    
    const table_no = param.get("table");
    const order_info: any = { OrderInfo: {} };

    const order_price_details = [];
    const val_taxes = [];
    const val_discount: any = [];

    for (let fooditem of order_data) {
      const item_price = Number(fooditem.variant_price) * Number(fooditem.quantity);

      let addOns = [];
      let add_on_price = 0;
      let total_price = item_price;

      if (fooditem.addOn) {
        addOns = fooditem.addOn.map((addOn: any) => ({
          id: addOn.addOn_id,
          name: addOn.addOn_name,
          group_name: addOn.addOn_group_name,
          price: addOn.addOn_price,
          group_id: addOn.addOn_group_id,
          quantity: addOn.quantity.toString(),
        }));
        add_on_price = addOns.reduce((total: any, addOn: any) => total + Number(addOn.price) * Number(addOn.quantity), 0);
        total_price += Number(add_on_price) || 0;
      }

      let discount_amount = 0;
      if (retData.discounts?.length > 0) {
        for (let discount of retData.discounts) {
          const discount_item_ids = discount.discountcategoryitemids.split(",");
          if (
            discount.active === "1" &&
            discount_item_ids.includes(fooditem?.variant_id && fooditem?.variant_id != "0" ? fooditem?.variant_id : fooditem.item_id)
          ) {
            const discountable_price = discount.discountontotal === "1" ? total_price : item_price;
            if (discount.discounttype === "1") {
              discount_amount = Math.min((discountable_price * Number(discount.discount)) / 100, discount.discountmaxlimit);
            } else if (discount.discounttype === "2") {
              discount_amount = discount.discount;
            }

            val_discount.push({
              id: discount.discountid,
              price: discount_amount.toString(),
            });
          }
        }
      }

      const discounted_price = total_price - Number(discount_amount);

      const tex_details = [];
      if (retData.taxes?.length > 0) {
        for (let tax of retData.taxes) {
          if (tax.active === "1") {
            const tax_amount = (discounted_price * tax.tax) / 100;
            tex_details.push({
              id: tax.taxid,
              name: tax.taxname,
              amount: tax_amount.toString(),
            });
            val_taxes.push({
              id: tax.taxid,
              name: tax.taxname,
              price: tax.tax,
              amount: tax_amount.toString(),
            });
          }
        }
      }

      order_price_details.push({
        id: fooditem.item_id.toString(),
        name: fooditem.item_name.toString(),
        gst_liability: "restaurant",
        item_tax: tex_details,
        item_discount: discount_amount.toString(),
        price: total_price.toString(),
        final_price: Math.max(discounted_price, 0).toString(),
        quantity: fooditem.quantity.toString(),
        variation_name: fooditem.variant_name !== "df" ? fooditem.variant_name : "",
        variation_id: fooditem.variant_id !== "0" ? fooditem.variant_id.toString() : "",
        AddonItem: {
          details: addOns,
        },
      });
    }
    order_info.OrderInfo["OrderItem"] = {
      details: order_price_details,
    };

    //overall tax
    const tax_details = [];
    for (let tax of retData.taxes) {
      const current_tax = val_taxes.reduce((total, item) => (item.id === tax.taxid ? total + Number(item.amount) : total), 0).toFixed(2);

      tax_details.push({
        id: tax.taxid,
        title: tax.taxname,
        type: "P",
        price: tax.tax,
        tax: current_tax.toString(),
        restaurant_liable_amt: current_tax.toString(),
      });
    }

    order_info.OrderInfo["Tax"] = {
      details: tax_details,
    };

    // overall discount
    const discount_details = [];
    let discount_type = "";
    for (let discount of retData?.discounts) {
      const current_discount = val_discount.reduce((total: any, item: any) => (item.id === discount.discountid ? total + Number(item.price) : total), 0);
      if (current_discount > 0) {
        if (discount_type) {
          discount_type = "M";
        } else {
          discount_type = discount.discounttype === "1" ? "P" : "F";
        }

        discount_details.push({
          id: discount.discountid,
          title: discount.discountname,
          type: discount.discounttype === "1" ? "P" : "F",
          price: discount.discount.toString(),
        });
      }
    }

    order_info.OrderInfo["Discount"] = {
      details: discount_details,
    };

    order_info.OrderInfo["Restaurant"] = {
      details: {
        restID: retData.restID,
      },
    };

    const total_tax = tax_details.reduce((total, item) => total + Number(item.tax), 0);
    let total_discount = 0;

    if (discount_type === "M") {
      total_discount = val_discount.reduce((total: any, item: any) => total + Number(item.price), 0);
      discount_type = "F";
    } else {
      total_discount = discount_details.reduce((total: any, item: any) => total + Number(item.price), 0);
    }

    const total_cost = order_price_details.reduce((total, item) => total + Number(item.final_price) * Number(item.quantity), 0) + total_tax;

    order_info.OrderInfo["Order"] = {
      details: {
        orderID: createRendonOrderID(),
        preorder_date: moment().format("YYYY-MM-DD"),
        preorder_time: moment().format("H:mm:ss"),
        service_charge: "0",
        sc_tax_amount: "0",
        delivery_charges: "0",
        dc_tax_amount: "0",
        dc_gst_details: [
          {
            gst_liable: "vendor",
            amount: "0",
          },
          {
            gst_liable: "restaurant",
            amount: "0",
          },
        ],
        packing_charges: "0",
        pc_tax_amount: "0",
        pc_gst_details: [
          {
            gst_liable: "vendor",
            amount: "0",
          },
          {
            gst_liable: "restaurant",
            amount: "0",
          },
        ],
        order_type: "D",
        ondc_bap: "",
        advanced_order: "N",
        payment_type: "OTHER",
        table_no: table_no || 1,
        no_of_persons: "2",
        discount_total: total_discount.toString(),
        tax_total: total_tax.toString(),
        total: total_cost.toString(),
        discount_type: discount_type,
        description: "",
        created_on: moment().format("YYYY-MM-DD H:mm:ss"),
        enable_delivery: 1,
        min_prep_time: 20,
        callback_url: `${window.location.protocol}//${window.location.host}/restaurant/orderstatus`,
        collect_cash: "",
        otp: "",
      },
    };

    order_info.OrderInfo["Customer"] = {
      details: {
        email: "admin@yopmail.com",
        name: "Mayra",
        address: "",
      },
    };

    return CreateOrder(order_info);
  };

  const createRendonOrderID = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  return (
    <div className="flex antialiased">
      <div className="flex flex-row h-full w-full overflow-x-hidden">
        <div className="flex flex-col flex-auto w-full h-screen items-center justify-center">
          {loading ? (
            <Loader />
          ) : (
            <div className="w-full h-full text-center pt-1">
              <div className="micro-inner absolute text-center pb-5 bottom-0 w-full left-2/4 -translate-x-2/4 lg:top-6 lg:bottom-auto">
                {listening ? (
                  <button
                    className="order rounded-full mx-auto flex gap-2 items-center justify-center z-40 py-2 px-6 text-black font-semibold max-w-fit bg-emerald-300"
                    onClick={stopListen}
                  >
                    End Call
                  </button>
                ) : (
                  <button className="order rounded-full mx-auto block z-40 py-2 px-6 max-w-fit text-black font-semibold bg-emerald-300" onClick={startListen}>
                    Call
                  </button>
                )}
              </div>

              <div className="absolute bottom-[8rem] inset-x-0 max-w-4xl mx-auto text-center">
                {caption && <span className="bg-black/70 p-8">{caption}</span>}
              </div>
            </div>
          )}
        </div>
      </div>

      <audio id="stream_audio_id" autoPlay></audio>
    </div>
  );
};

export default App;
