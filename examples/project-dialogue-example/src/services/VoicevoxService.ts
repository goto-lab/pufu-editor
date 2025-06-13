import axios from 'axios';

export class VoicevoxService {
  private static instance: VoicevoxService;
  private audioContext: AudioContext | null = null;

  private constructor() {}

  static getInstance(): VoicevoxService {
    if (!VoicevoxService.instance) {
      VoicevoxService.instance = new VoicevoxService();
    }
    return VoicevoxService.instance;
  }

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  async speak(
    text: string,
    options: {
      speaker?: number;
      speedScale?: number;
      pitchScale?: number;
      volumeScale?: number;
    } = {}
  ): Promise<void> {
    try {
      const response = await axios.post('/api/synthesize', {
        text,
        speaker: options.speaker || 3, // ずんだもん
        speedScale: options.speedScale || 1.2,
        pitchScale: options.pitchScale || 0,
        volumeScale: options.volumeScale || 1,
      });

      const audioData = response.data.audio;
      const audioBuffer = this.base64ToArrayBuffer(audioData);
      
      const context = this.getAudioContext();
      const decodedAudio = await context.decodeAudioData(audioBuffer);
      
      const source = context.createBufferSource();
      source.buffer = decodedAudio;
      source.connect(context.destination);
      
      return new Promise((resolve) => {
        source.onended = () => resolve();
        source.start();
      });
    } catch (error) {
      console.error('音声合成エラー:', error);
      throw error;
    }
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  async checkConnection(): Promise<boolean> {
    try {
      const response = await axios.get('/api/health');
      return response.data.voicevox === 'connected';
    } catch {
      return false;
    }
  }
}