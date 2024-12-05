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

  const model_voice: any= voice || "hi-IN-SwaraNeural";

  const speechConfig = SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
  speechConfig.speechSynthesisVoiceName = model_voice;
  speechConfig.speechSynthesisOutputFormat = SpeechSynthesisOutputFormat.Audio24Khz48KBitRateMonoMp3;

  const audioStream = new ReadableStream({
    start(controller) {
      const stream = new MyPushAudioOutputStream(controller);
      const audioConfig: AudioConfig = AudioConfig.fromStreamOutput(stream);

      const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);
      const ssml = `<speak version='1.0' xml:lang='en-US'><voice xml:lang='en-US' xml:gender='Female' name='${model_voice}'><prosody rate='${40}%'>${text}</prosody></voice></speak>`;

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
