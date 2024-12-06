import { CallCollectionModel } from "@/mongodb/models/mainModel";
import {
  SpeechConfig,
  SpeechSynthesisOutputFormat,
  SpeechSynthesizer,
  ResultReason,
  AudioConfig,
  PushAudioOutputStreamCallback,
} from "microsoft-cognitiveservices-speech-sdk";
import { NextResponse } from "next/server";

const subscriptionKey = process.env.AZURE_SPEECH_KEY as string;
const serviceRegion = process.env.AZURE_SPEECH_REGION as string;
const sanitizeText= (input: string): string => input.replace(/[^a-zA-Z0-9\s.,!?]/g, '');

class MyPushAudioOutputStream extends PushAudioOutputStreamCallback {
  out_controller: any;
  constructor(contoller: any) {
    super();
    this.out_controller = contoller;
  }

  write(data: any) {
    this.out_controller.enqueue(new Uint8Array(data));
  }

  close() {}
}

export async function POST(request: Request) {
  const { text, voice }: any = await request.json();
  const callId = new URL(request.url).searchParams.get('id');

  if (callId && text?.length) {
    const callModel = await CallCollectionModel.findById(callId);
    if (callModel) {
      callModel.character_count = callModel.character_count + text?.length;
      await callModel.save();
    }
  }

  const model_voice_name: any= voice.name || "hi-IN-SwaraNeural";
  const model_voice_gender: any= voice.gender || "Female";

  const speechConfig = SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
  speechConfig.speechSynthesisVoiceName = model_voice_name;
  speechConfig.speechSynthesisOutputFormat = SpeechSynthesisOutputFormat.Audio24Khz48KBitRateMonoMp3;

  const audioStream = new ReadableStream({
    start(controller) {
      const stream = new MyPushAudioOutputStream(controller);
      const audioConfig: AudioConfig = AudioConfig.fromStreamOutput(stream);

      const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);
      const escapedText = sanitizeText(text);
      const ssml = `<speak version='1.0' xml:lang='en-US'><voice xml:lang='en-US' xml:gender='${model_voice_gender}' name='${model_voice_name}'><prosody rate='${40}%'>${escapedText}</prosody></voice></speak>`;


      synthesizer.speakSsmlAsync(
        ssml,
        async (result) => {
          if (result.reason === ResultReason.SynthesizingAudioCompleted) {
            synthesizer.close(); 
            controller.close();
          }
        },
        (err) => {
          synthesizer.close(); 
          controller.error(err);
        }
      );
    },
  });

  return new NextResponse(audioStream, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      "Transfer-Encoding": "chunked",
    },
  });
}
