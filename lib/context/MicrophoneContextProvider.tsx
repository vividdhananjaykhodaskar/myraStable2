"use client";
import { useEffect, useRef, useState } from "react";
import { getBaseUrl } from "@/lib/math";

export enum MicrophoneEvents {
  DataAvailable = "dataavailable",
  Error = "error",
  Pause = "pause",
  Resume = "resume",
  Start = "start",
  Stop = "stop",
}

export enum MicrophoneState {
  NotSetup = -1,
  SettingUp = 0,
  Ready = 1,
  Opening = 2,
  Open = 3,
  Error = 4,
  Pausing = 5,
  Paused = 6,
}

export default function useAudioRecord() {
  const meterRef = useRef(null);
  const [microphone, setMicrophone] = useState<MediaRecorder | null>(null);
  const [microphoneState, setMicrophoneState] = useState<MicrophoneState>(MicrophoneState.NotSetup);

  useEffect(() => {
    getMicrophonePermission();
  }, []);

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData: any = await navigator.mediaDevices.getUserMedia({
          audio: {
            noiseSuppression: true,
            echoCancellation: true,
          },
          video: false,
        });
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(streamData);
        const audioDestination = audioContext.createMediaStreamDestination();

        const baseUrl = `${getBaseUrl()}/rnnoise/`;
        const workletUrl = `${baseUrl}noise-suppressor-worklet.min.js`;
        await audioContext.audioWorklet.addModule(workletUrl);
        const randomNoiseNode = new AudioWorkletNode(audioContext, "rnnoise-noise-processor");

        randomNoiseNode.port.onmessage = (event) => {
          meterRef.current = event.data.volume;
        };

        source.connect(randomNoiseNode);
        randomNoiseNode.connect(audioDestination);

        const microphones = new MediaRecorder(audioDestination.stream);
        setMicrophone(microphones);
        setMicrophoneState(MicrophoneState.Ready);
      } catch (err: any) {
        alert(err.message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };

  const handleorderNow = async () => {
    microphone?.start(500);
    setMicrophoneState(MicrophoneState.Open);
  };

  const setaudioListen = (type: any) => {
    if (type) {
      handleorderNow();
    } else {
      microphone?.stop();
      setMicrophoneState(MicrophoneState.Ready);
    }
  };

  return [setaudioListen, microphone, microphoneState];
}
