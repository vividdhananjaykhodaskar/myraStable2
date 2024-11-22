"use client";
import { useEffect, useRef, useState } from "react";
import { handleGroq } from "@/service/groqService";
import { generateSpeechNew } from "@/service/azureservice";
import Loader from "@/component/Loader";
import { createCall, endCall, updateCall } from "@/service/prservice";
import { LiveConnectionState, LiveTranscriptionEvent, LiveTranscriptionEvents, useDeepgram } from "@/lib/context/DeepgramContextProvider";
import useAudioRecord, { MicrophoneEvents, MicrophoneState } from "@/lib/context/MicrophoneContextProvider";
import { getDemoAssistent } from "@/service/assistantservice";

type DeviceType = "desktop" | "iOS" | "Android";

const TalkToMyra = ({}: {}) => {
  const callIntervalRef = useRef<any>(null);
  const stateRef = useRef<any>(null);
  const speakRef = useRef<any>(null);
  const scntenceRef = useRef<string[]>([]);
  const captionTimeout = useRef<any>();
  const keepAliveInterval = useRef<any>();

  const audiocontaxtRef = useRef<any>(null);
  const audioSourceRef = useRef<any>(null);
  const audioBufferQueue = useRef<any>([]);
  const intruptRef = useRef<any>(false);

  const [messages, setMessages] = useState<any>([]);
  const [caption, setCaption] = useState<any>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [listening, setListening] = useState(false);
  const [currentCall, setCurrentCall] = useState<any>(null);
  const [currentAssistant, setCurrentAssistant] = useState<any>(null);
  const [callActive, setCallActive] = useState<any>(false);
  const [callstatus, setCallStatus] = useState<any>("Listening");

  const { connection, connectToDeepgram, connectionState, disconnectFromDeepgram } = useDeepgram();
  const [setaudioListen, microphone, microphoneState]: any = useAudioRecord();
  const deviceType = getDeviceType();

  useEffect(() => {
    getDemoAssistent().then((res: any) => {
      if (res.success) {
        const assistent_data = res.data;
        let sysyem_prompt = assistent_data.system_prompt;
        setCurrentAssistant(assistent_data);
        setMessages([{ content: sysyem_prompt, role: "system" }]);
      } else {
        console.log("error", res);
      }
    });
  }, []);

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

  const handleCallState = (value: string | boolean, status: string) => {
    if (status === "active") {
      setCallActive(value);
    } else {
      setCallStatus(value);
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
            console.log(error);
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
        console.log(error);
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
        console.log(error);
      }
    });
  };

  const playNextBuffer = async () => {
    if (audioBufferQueue.current.length > 0) {
      const buffer = audioBufferQueue.current.shift();
      const source = audiocontaxtRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audiocontaxtRef.current.destination);
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

    if (context.state === "suspended") {
      context.resume();
    }
    audiocontaxtRef.current = context;

    const new_signal = handleSignal();
    if (currentAssistant?.welcome_message) {
      const reader: any = await generateSpeechNew(currentAssistant?.welcome_message, currentCall, new_signal);
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
        const callData = await createCall({
          completion_model: currentAssistant?.groq_model,
          assistant_id: currentAssistant?._id,
          user_id: currentAssistant?.user_id,
          character_count: currentAssistant?.welcome_message.length ?? 0
        });
        if (callData) {
          setCurrentCall(callData);
          callIntervalRef.current = setInterval(() => {
            updateCall(callData, { last_activity: new Date() });
          }, 10000);
        }
      });
    }
  };

  const stopListen = () => {
    if (!microphone) return;
    if (!connection) return;

    if (audioSourceRef.current) {
      intruptRef.current = true;
      audioSourceRef.current.stop();
      audioSourceRef.current = null;
    }

    setaudioListen(false);
    setListening(false);

    connection.removeListener(LiveTranscriptionEvents.Transcript, onTranscript);
    microphone.removeEventListener(MicrophoneEvents.DataAvailable, onData);
    disconnectFromDeepgram();
    endCall(currentCall);
    if (callIntervalRef.current) {
      clearInterval(callIntervalRef.current);
    }
    clearTimeout(captionTimeout.current);
  };

  const getTranscribeResponse = async (speech_text: string) => {
    setMessages((msg: string) => [...msg, { content: speech_text, role: "user" }]);
    generateApiResponse(speech_text);
  };

  const generateApiResponse = async (speech_text: string) => {
    let new_signal = handleSignal();
    handleCallState("Thinking", "");
    const new_messagArr = [...messages, { content: speech_text, role: "user" }];
    const openAIResponse = await handleGroq(new_messagArr, currentAssistant, currentCall, new_signal);
    stateRef.current = null;
    if (!openAIResponse) return;

    new_signal = handleSignal();
    setMessages((msg: string) => [...msg, { content: openAIResponse, role: "assistant" }]);
    console.log(openAIResponse)
    const reader = await generateSpeechNew(openAIResponse, currentCall, new_signal);

    if (reader) {
      handleState("Assistant Speaking");
      stateRef.current = null;
      processchunckdevice(reader);
    }
  };

  const handleSignal = () => {
    const controller = new AbortController();
    stateRef.current = controller;
    return controller.signal;
  };

  return (
    <div className="flex antialiased relative">
      <div className="flex flex-row w-full overflow-hidden">
        <div className="flex flex-col flex-auto w-full min-h-52 items-center justify-center">
          {loading ? (
            <Loader />
          ) : (
            <div className="w-full text-center pt-1">
              <div className="micro-inner text-center pb-5 w-full">
                {listening ? (
                  <>
                    {callActive && (
                      <div className="box-loader !static !translate-x-0">
                        <div className="wrapper mx-auto">
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
                        <p className="text-base text-white mb-5">{callstatus}</p>
                      </div>
                    )}
                    <button
                      className="text-center border border-solid border-white rounded-[30px] px-3 py-1.5 w-fit mx-auto my-0 block mt-9"
                      onClick={stopListen}
                    >
                      End Call
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      id="speech"
                      className="border-0 p-0 rounded-full w-28 h-28 text-white m-0 bg-[#0e3029] relative block leading-10 text-center whitespace-nowrap mx-auto"
                    >
                      <i className="fa fa-microphone" aria-hidden="true"></i>
                      <div className="pulse-ring w-28 h-28"></div>
                    </button>
                    <button
                      onClick={startListen}
                      className="text-center border border-solid border-white rounded-[30px] px-3 py-1.5 w-fit mx-auto my-0 block mt-9"
                    >
                      Talk to Myra
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <audio id="stream_audio_id" autoPlay></audio>
    </div>
  );
};

export default TalkToMyra;
