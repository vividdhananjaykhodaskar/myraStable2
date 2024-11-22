import RnnoiseProcessor from "./RnnoiseProcessor";
import { leastCommonMultiple } from "../lib/math";
import createRNNWasmModuleSync from "./rnnoise-sync";

export default class NoiseSuppressorWorklet extends AudioWorkletProcessor {
  _procNodeSampleRate = 128;
  _inputBufferLength = 0;
  _denoisedBufferLength = 0;
  _denoisedBufferIndx = 0;

  constructor() {
    super();
    this._volume = 0;
    this.clipLag = 750;
    this.clipLevel = 0.98;
    this.averaging = 0.95;
    this._denoiseProcessor = new RnnoiseProcessor(createRNNWasmModuleSync());
    this._denoiseSampleSize = this._denoiseProcessor.getSampleLength();
    this._circularBufferLength = leastCommonMultiple(
      this._procNodeSampleRate,
      this._denoiseSampleSize
    );
    this._circularBuffer = new Float32Array(this._circularBufferLength);
  }

  process(inputs, outputs, parameters) {
    const inData = inputs[0][0];
    const outData = outputs[0][0];

    if (!inData) {
      return true;
    }

    this._circularBuffer.set(inData, this._inputBufferLength); //512array - 0
    this._inputBufferLength += inData.length; // 512

    for (
      ;
      this._denoisedBufferLength + this._denoiseSampleSize <=
      this._inputBufferLength;
      this._denoisedBufferLength += this._denoiseSampleSize
    ) {
      const denoiseFrame = this._circularBuffer.subarray(
        this._denoisedBufferLength,
        this._denoisedBufferLength + this._denoiseSampleSize
      );

      this._denoiseProcessor.processAudioFrame(denoiseFrame, true);
    }

    let unsentDenoisedDataLength;

    if (this._denoisedBufferIndx > this._denoisedBufferLength) {
      unsentDenoisedDataLength =
        this._circularBufferLength - this._denoisedBufferIndx;
    } else {
      unsentDenoisedDataLength =
        this._denoisedBufferLength - this._denoisedBufferIndx;
    }

    if (unsentDenoisedDataLength >= outData.length) {
      const denoisedFrame = this._circularBuffer.subarray(
        this._denoisedBufferIndx,
        this._denoisedBufferIndx + outData.length
      );

      this._volume = this.volumemeter(denoisedFrame);

      outData.set(denoisedFrame, 0);
      this._denoisedBufferIndx += outData.length;
      this.port.postMessage({ volume: this._volume });
    }

    if (this._denoisedBufferIndx === this._circularBufferLength) {
      this._denoisedBufferIndx = 0;
    }

    if (this._inputBufferLength === this._circularBufferLength) {
      this._inputBufferLength = 0;
      this._denoisedBufferLength = 0;
    }

    return true;
  }

  volumemeter(samples) {
    let sum = 0;
    let isClipping = false;
    let lastClip = 0;

    for (let i = 0; i < samples.length; ++i) {
      if (Math.abs(samples[i]) >= this.clipLevel) {
        isClipping = true;
        lastClip = Date.now();
      }
      if (lastClip + this.clipLag < Date.now()) isClipping = false;
      sum += samples[i] * samples[i];
    }

    const rms = Math.sqrt(sum / samples.length);
    return Math.max(rms, this._volume * this.averaging);
  }
}

registerProcessor("rnnoise-noise-processor", NoiseSuppressorWorklet);
