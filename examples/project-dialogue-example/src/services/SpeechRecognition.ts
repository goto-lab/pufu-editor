import { AudioDeviceManager } from "./AudioDeviceManager";

export class SpeechRecognitionService {
  private static instance: SpeechRecognitionService;
  private recognition: any;
  private isRecognizing: boolean = false;
  private audioDeviceManager: AudioDeviceManager;
  private silenceTimeoutId: NodeJS.Timeout | null = null;

  private constructor() {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = "ja-JP";
      this.recognition.continuous = true; // 連続認識を有効化
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
    retryOnNoSpeech: boolean = true,
    silenceTimeout: number = 5000 // 5秒間無音で停止（デフォルト値も延長）
  ): Promise<string> {
    if (!this.recognition) {
      throw new Error("音声認識がサポートされていません");
    }

    let retryCount = 0;
    const maxRetries = retryOnNoSpeech ? 2 : 0;

    const attempt = (): Promise<string> => {
      return new Promise((resolve, reject) => {
        // 既に認識中の場合はエラーを返す
        if (this.isRecognizing) {
          reject(new Error("音声認識は既に実行中です"));
          return;
        }

        let timeoutId: NodeJS.Timeout;
        let finalTranscript = "";
        let lastUpdateTime = Date.now();
        let isSilenceTimeout = false;

        // 無音監視の定期チェック
        const checkSilence = () => {
          this.silenceTimeoutId = setTimeout(() => {
            const now = Date.now();
            const silenceTime = now - lastUpdateTime;
            console.log(
              `[DEBUG] 無音チェック: ${silenceTime}ms経過 (閾値: ${silenceTimeout}ms)`
            );

            if (silenceTime >= silenceTimeout) {
              console.log("5秒間無音のため音声認識を停止します");
              isSilenceTimeout = true;
              this.recognition.stop();
            } else {
              checkSilence(); // 再帰的にチェック継続
            }
          }, 1000); // 1秒間隔でチェック
        };

        this.recognition.onresult = (event: any) => {
          clearTimeout(timeoutId);
          lastUpdateTime = Date.now(); // 最終更新時刻を更新

          let interimTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
              console.log("[DEBUG] 確定テキスト:", transcript);
            } else {
              interimTranscript += transcript;
              console.log("[DEBUG] 中間テキスト:", transcript);
            }
          }

          if (onInterimResult && interimTranscript) {
            onInterimResult(finalTranscript + interimTranscript);
          }

          if (finalTranscript) {
            console.log("[DEBUG] 確定テキスト検出、継続してさらなる入力を待機");
            // 確定テキストがあっても即座に停止せず、さらなる音声入力を待つ
            // 無音監視に任せて自然に停止させる
          } else {
            // 全体タイムアウトの再設定
            timeoutId = setTimeout(() => {
              if (this.silenceTimeoutId) {
                clearTimeout(this.silenceTimeoutId);
                this.silenceTimeoutId = null;
              }
              this.recognition.stop();
            }, timeout);
          }
        };

        this.recognition.onerror = (event: any) => {
          clearTimeout(timeoutId);
          if (this.silenceTimeoutId) {
            clearTimeout(this.silenceTimeoutId);
            this.silenceTimeoutId = null;
          }
          this.isRecognizing = false; // エラー時はフラグをリセット

          switch (event.error) {
            case "no-speech":
              // no-speechエラーは再試行処理をonendに任せる
              console.log("音声が検出されませんでした");
              break;
            case "not-allowed":
              reject(new Error("マイクの使用が許可されていません"));
              break;
            case "network":
              reject(new Error("ネットワークエラーが発生しました"));
              break;
            case "aborted":
              // 中断エラーは無視（stop()メソッドが呼ばれた場合など）
              if (!finalTranscript) {
                console.log("音声認識が中断されました");
              }
              break;
            default:
              reject(new Error(`音声認識エラー: ${event.error}`));
          }
        };

        this.recognition.onend = () => {
          clearTimeout(timeoutId);
          if (this.silenceTimeoutId) {
            clearTimeout(this.silenceTimeoutId);
            this.silenceTimeoutId = null;
          }
          this.isRecognizing = false;

          if (finalTranscript) {
            resolve(finalTranscript);
          } else if (isSilenceTimeout) {
            // 無音タイムアウトの場合はエラーではなく空文字列を返す
            resolve("");
          } else if (retryCount < maxRetries) {
            retryCount++;
            console.log(
              `音声が検出されませんでした。再試行中... (${retryCount}/${maxRetries})`
            );
            setTimeout(() => {
              attempt().then(resolve).catch(reject);
            }, 500);
          } else {
            reject(new Error("音声が検出されませんでした"));
          }
        };

        timeoutId = setTimeout(() => {
          if (this.isRecognizing) {
            if (this.silenceTimeoutId) {
              clearTimeout(this.silenceTimeoutId);
              this.silenceTimeoutId = null;
            }
            this.recognition.stop();
          }
        }, timeout);

        try {
          this.isRecognizing = true;
          console.log("[DEBUG] 音声認識開始");
          this.recognition.start();

          // 音声認識開始から少し遅延してから無音監視を開始（初期化時間を考慮）
          setTimeout(() => {
            console.log("[DEBUG] 無音監視開始");
            lastUpdateTime = Date.now(); // 無音監視開始時刻にリセット
            checkSilence();
          }, 3000); // 3秒後に無音監視開始（延長）
        } catch (error) {
          this.isRecognizing = false;
          if (this.silenceTimeoutId) {
            clearTimeout(this.silenceTimeoutId);
            this.silenceTimeoutId = null;
          }
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
    if (this.silenceTimeoutId) {
      clearTimeout(this.silenceTimeoutId);
      this.silenceTimeoutId = null;
    }
  }
}
