export class VoicevoxService {
  private static instance: VoicevoxService;
  private audioContext: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private isPlaying: boolean = false;
  private lastSpeakTime: number = 0;
  private lastSpeakText: string = '';

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
      // 重複再生防止: 100ms以内に同じテキストの再生要求があった場合はスキップ
      const now = Date.now();
      if (text === this.lastSpeakText && now - this.lastSpeakTime < 100) {
        console.log('[DEBUG] 重複再生をスキップしました:', text.substring(0, 50) + '...');
        return;
      }
      this.lastSpeakTime = now;
      this.lastSpeakText = text;

      console.log('[DEBUG] VoicevoxService.speak開始:', new Date().toISOString(), 'テキスト:', text.substring(0, 50) + '...');
      const startTime = performance.now();
      
      const response = await fetch('/api/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          speaker: options.speaker || 3, // ずんだもん
          speedScale: options.speedScale || 1.2,
          pitchScale: options.pitchScale || 0,
          volumeScale: options.volumeScale || 1,
        }),
      });

      if (!response.ok) {
        throw new Error(`音声合成APIエラー: ${response.status}`);
      }

      const apiTime = performance.now();
      console.log('[DEBUG] API応答完了:', (apiTime - startTime).toFixed(2) + 'ms');

      const responseData = await response.json();
      const audioData = responseData.audio;
      const audioBuffer = this.base64ToArrayBuffer(audioData);
      
      const context = this.getAudioContext();
      const decodedAudio = await context.decodeAudioData(audioBuffer);
      
      const source = context.createBufferSource();
      source.buffer = decodedAudio;
      source.connect(context.destination);
      
      // 現在のソースを記録
      this.currentSource = source;
      this.isPlaying = true;
      
      return new Promise((resolve, reject) => {
        source.onended = () => {
          this.isPlaying = false;
          this.currentSource = null;
          resolve();
        };
        
        try {
          source.start();
        } catch (error) {
          this.isPlaying = false;
          this.currentSource = null;
          reject(error);
        }
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

  stopSpeaking(): void {
    if (this.currentSource && this.isPlaying) {
      this.currentSource.stop();
      this.currentSource = null;
      this.isPlaying = false;
    }
  }

  isCurrentlySpeaking(): boolean {
    return this.isPlaying;
  }

  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch('/api/health');
      if (!response.ok) return false;
      const data = await response.json();
      return data.voicevox === 'connected';
    } catch {
      return false;
    }
  }
}