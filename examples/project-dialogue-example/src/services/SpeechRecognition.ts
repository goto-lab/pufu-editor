import { AudioDeviceManager } from './AudioDeviceManager';

export class SpeechRecognitionService {
  private static instance: SpeechRecognitionService;
  private recognition: any;
  private isRecognizing: boolean = false;
  private audioDeviceManager: AudioDeviceManager;

  private constructor() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'ja-JP';
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;
    }
    this.audioDeviceManager = AudioDeviceManager.getInstance();
  }

  static getInstance(): SpeechRecognitionService {
    if (!SpeechRecognitionService.instance) {
      SpeechRecognitionService.instance = new SpeechRecognitionService();
    }
    return SpeechRecognitionService.instance;
  }

  isSupported(): boolean {
    return !!this.recognition;
  }

  async listen(
    onInterimResult?: (transcript: string) => void,
    timeout: number = 10000,
    retryOnNoSpeech: boolean = true
  ): Promise<string> {
    if (!this.recognition) {
      throw new Error('音声認識がサポートされていません');
    }

    let retryCount = 0;
    const maxRetries = retryOnNoSpeech ? 2 : 0;

    const attempt = (): Promise<string> => {
      return new Promise((resolve, reject) => {
        // 既に認識中の場合はエラーを返す
        if (this.isRecognizing) {
          reject(new Error('音声認識は既に実行中です'));
          return;
        }

        let timeoutId: NodeJS.Timeout;
        let finalTranscript = '';

        this.recognition.onresult = (event: any) => {
          clearTimeout(timeoutId);
          
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }
          
          if (onInterimResult && interimTranscript) {
            onInterimResult(finalTranscript + interimTranscript);
          }
          
          if (finalTranscript) {
            this.recognition.stop();
          } else {
            timeoutId = setTimeout(() => {
              this.recognition.stop();
            }, timeout);
          }
        };

        this.recognition.onerror = (event: any) => {
          clearTimeout(timeoutId);
          this.isRecognizing = false; // エラー時はフラグをリセット
          
          switch (event.error) {
            case 'no-speech':
              // no-speechエラーは再試行処理をonendに任せる
              console.log('音声が検出されませんでした');
              break;
            case 'not-allowed':
              reject(new Error('マイクの使用が許可されていません'));
              break;
            case 'network':
              reject(new Error('ネットワークエラーが発生しました'));
              break;
            case 'aborted':
              // 中断エラーは無視（stop()メソッドが呼ばれた場合など）
              if (!finalTranscript) {
                console.log('音声認識が中断されました');
              }
              break;
            default:
              reject(new Error(`音声認識エラー: ${event.error}`));
          }
        };

        this.recognition.onend = () => {
          clearTimeout(timeoutId);
          this.isRecognizing = false;
          
          if (finalTranscript) {
            resolve(finalTranscript);
          } else if (retryCount < maxRetries) {
            retryCount++;
            console.log(`音声が検出されませんでした。再試行中... (${retryCount}/${maxRetries})`);
            setTimeout(() => {
              attempt().then(resolve).catch(reject);
            }, 500);
          } else {
            reject(new Error('音声が検出されませんでした'));
          }
        };

        timeoutId = setTimeout(() => {
          if (this.isRecognizing) {
            this.recognition.stop();
          }
        }, timeout);

        try {
          this.isRecognizing = true;
          this.recognition.start();
        } catch (error) {
          this.isRecognizing = false;
          reject(error);
        }
      });
    };

    return attempt();
  }

  stop() {
    if (this.recognition && this.isRecognizing) {
      this.recognition.stop();
      this.isRecognizing = false;
    }
  }
}