export interface AudioDevice {
  deviceId: string;
  label: string;
  kind: MediaDeviceKind;
}

export class AudioDeviceManager {
  private static instance: AudioDeviceManager;
  private currentDeviceId: string = 'default';
  private stream: MediaStream | null = null;

  private constructor() {}

  static getInstance(): AudioDeviceManager {
    if (!AudioDeviceManager.instance) {
      AudioDeviceManager.instance = new AudioDeviceManager();
    }
    return AudioDeviceManager.instance;
  }

  async getAudioInputDevices(): Promise<AudioDevice[]> {
    try {
      // 権限を取得するために一度getUserMediaを呼ぶ
      if (!this.stream) {
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices
        .filter(device => device.kind === 'audioinput')
        .map(device => ({
          deviceId: device.deviceId,
          label: device.label || `マイク ${device.deviceId.slice(0, 5)}`,
          kind: device.kind
        }));

      return audioInputs;
    } catch (error) {
      console.error('オーディオデバイスの取得に失敗:', error);
      return [];
    }
  }

  async setAudioDevice(deviceId: string): Promise<MediaStream> {
    try {
      // 既存のストリームを停止
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
      }

      // 新しいデバイスでストリームを取得
      const constraints: MediaStreamConstraints = {
        audio: {
          deviceId: deviceId === 'default' ? undefined : { exact: deviceId }
        }
      };

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.currentDeviceId = deviceId;
      return this.stream;
    } catch (error) {
      console.error('オーディオデバイスの設定に失敗:', error);
      throw error;
    }
  }

  getCurrentDeviceId(): string {
    return this.currentDeviceId;
  }

  getStream(): MediaStream | null {
    return this.stream;
  }

  stopStream(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }
}