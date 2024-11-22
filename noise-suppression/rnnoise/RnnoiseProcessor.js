export const RNNOISE_SAMPLE_LENGTH = 480;

const RNNOISE_BUFFER_SIZE = RNNOISE_SAMPLE_LENGTH * 4;

const PCM_FREQUENCY = 44100;

const SHIFT_16_BIT_NR = 32768;

export default class RnnoiseProcessor {
  _context;

  _destroyed = false;

  _wasmInterface;

  _wasmPcmInput;

  _wasmPcmInputF32Index;

  constructor(wasmInterface) {
    try {
      this._wasmInterface = wasmInterface;

      this._wasmPcmInput = this._wasmInterface._malloc(RNNOISE_BUFFER_SIZE);

      this._wasmPcmInputF32Index = this._wasmPcmInput >> 2;

      if (!this._wasmPcmInput) {
        throw Error("Failed to create wasm input memory buffer!");
      }

      this._context = this._wasmInterface._rnnoise_create();
    } catch (error) {
      this.destroy();
      throw error;
    }
  }

  _releaseWasmResources() {
    if (this._wasmPcmInput) {
      this._wasmInterface._free(this._wasmPcmInput);
    }

    if (this._context) {
      this._wasmInterface._rnnoise_destroy(this._context);
    }
  }

  getSampleLength() {
    return RNNOISE_SAMPLE_LENGTH;
  }

  getRequiredPCMFrequency() {
    return PCM_FREQUENCY;
  }

  destroy() {
    if (this._destroyed) {
      return;
    }

    this._releaseWasmResources();

    this._destroyed = true;
  }

  calculateAudioFrameVAD(pcmFrame) {
    return this.processAudioFrame(pcmFrame);
  }

  processAudioFrame(pcmFrame, shouldDenoise = false) {
    for (let i = 0; i < RNNOISE_SAMPLE_LENGTH; i++) {
      this._wasmInterface.HEAPF32[this._wasmPcmInputF32Index + i] =
        pcmFrame[i] * SHIFT_16_BIT_NR;
    }

    const vadScore = this._wasmInterface._rnnoise_process_frame(
      this._context,
      this._wasmPcmInput,
      this._wasmPcmInput
    );

    if (shouldDenoise) {
      for (let i = 0; i < RNNOISE_SAMPLE_LENGTH; i++) {
        pcmFrame[i] =
          this._wasmInterface.HEAPF32[this._wasmPcmInputF32Index + i] /
          SHIFT_16_BIT_NR;
      }
    }

    return vadScore;
  }
}
