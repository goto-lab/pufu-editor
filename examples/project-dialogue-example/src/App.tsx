import { useState, useEffect, useCallback } from 'react';
import { DialogueView } from './components/DialogueView';
import { HistoryPanel } from './components/HistoryPanel';
import { InputPanel } from './components/InputPanel';
import { ProjectScoreView } from './components/ProjectScoreView';
import { DialogueService } from './services/DialogueService';
import { VoicevoxService } from './services/VoicevoxService';
import { SpeechRecognitionService } from './services/SpeechRecognition';
import { ProjectAnalyzer } from './services/ProjectAnalyzer';
import { ApiService } from './services/ApiService';
import { DialogueMessage } from './types';

function App() {
  const [messages, setMessages] = useState<DialogueMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<DialogueMessage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [showProjectScore, setShowProjectScore] = useState(false);
  const [voicevoxConnected, setVoicevoxConnected] = useState(false);
  const [currentStepType, setCurrentStepType] = useState<string>('notice');
  const [llmProvider, setLlmProvider] = useState<string>('unknown');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState(''); // 音声認識結果を保持
  const [isInitialized, setIsInitialized] = useState(false); // 初期化フラグ

  const dialogueService = DialogueService.getInstance();
  const voicevoxService = VoicevoxService.getInstance();
  const speechRecognition = SpeechRecognitionService.getInstance();

  useEffect(() => {
    if (isInitialized) return; // 既に初期化済みの場合は何もしない
    
    // VOICEVOXの接続確認
    voicevoxService.checkConnection().then(setVoicevoxConnected);

    // LLMプロバイダー情報を取得
    const fetchProvider = async () => {
      try {
        const apiService = ApiService.getInstance();
        const provider = await apiService.getProvider();
        setLlmProvider(provider.toUpperCase());
      } catch (error) {
        console.error('プロバイダー情報取得エラー:', error);
      }
    };
    fetchProvider();

    // 初期メッセージ（最初のシナリオステップを表示）
    const currentStep = dialogueService.getCurrentStep();
    if (currentStep) {
      setCurrentStepType(currentStep.type);
      
      if (currentStep.type === 'question') {
        // questionタイプの場合はAI質問を生成
        setIsProcessing(true);
        dialogueService.processUserInput('').then(({ response, voiceText }) => {
          const initMessage = dialogueService.generateMessage('system', response, voiceText);
          setCurrentMessage(initMessage);
          setMessages([initMessage]);
          
          // 音声で読み上げ
          voicevoxService.checkConnection().then(connected => {
            if (connected && !isSpeaking) {
              const voiceTextToSpeak = dialogueService.getVoiceText(initMessage);
              setIsSpeaking(true);
              voicevoxService.speak(voiceTextToSpeak)
                .then(() => setIsSpeaking(false))
                .catch((error) => {
                  setIsSpeaking(false);
                  console.error(error);
                });
            }
          });
          setIsProcessing(false);
        }).catch((error) => {
          console.error('初期質問生成エラー:', error);
          setIsProcessing(false);
        });
      } else {
        // 通常の場合
        const initMessage = dialogueService.generateMessage('system', currentStep.displayMessage || '', currentStep.voiceMessage || '');
        setCurrentMessage(initMessage);
        setMessages([initMessage]);

        // 音声で読み上げ
        voicevoxService.checkConnection().then(connected => {
          if (connected && !isSpeaking) {
            const voiceText = dialogueService.getVoiceText(initMessage);
            setIsSpeaking(true);
            voicevoxService.speak(voiceText)
              .then(() => setIsSpeaking(false))
              .catch((error) => {
                setIsSpeaking(false);
                console.error(error);
              });
          }
        });
      }
    }
    
    setIsInitialized(true); // 初期化完了フラグを設定
  }, [isInitialized, isSpeaking]);

  const processDialogue = useCallback(async (userInput: string) => {
    console.log('[DEBUG] processDialogue開始:', new Date().toISOString());
    setIsProcessing(true);

    // ユーザーメッセージを作成（メイン画面には表示しないが、対話履歴には表示する）
    const userMessage = dialogueService.generateMessage('user', userInput);
    // ユーザーメッセージはメイン画面には表示しない
    // setCurrentMessage(userMessage);
    // ユーザーメッセージを対話履歴に追加
    setMessages(prev => [...prev, userMessage]);

    try {
      // 対話処理
      console.log('[DEBUG] dialogueService.processUserInput開始:', new Date().toISOString());
      const { response, voiceText, shouldGenerate, currentStepType: newStepType } = await dialogueService.processUserInput(userInput);
      console.log('[DEBUG] dialogueService.processUserInput完了:', new Date().toISOString());

      // 現在のステップタイプを更新
      if (newStepType) {
        setCurrentStepType(newStepType);
      }

      // システムレスポンスを追加
      const systemMessage = dialogueService.generateMessage('system', response, voiceText);
      setCurrentMessage(systemMessage);
      setMessages(prev => [...prev, systemMessage]);

      // 音声で読み上げ（generateの場合は並行処理で実行するためスキップ、既に再生中でない場合のみ）
      if (voicevoxConnected && !shouldGenerate && !isSpeaking) {
        const voiceTextToSpeak = dialogueService.getVoiceText(systemMessage);
        console.log('[DEBUG] 音声読み上げ開始:', new Date().toISOString());
        setIsSpeaking(true);
        try {
          await voicevoxService.speak(voiceTextToSpeak);
          console.log('[DEBUG] 音声読み上げ完了:', new Date().toISOString());
          setIsSpeaking(false);
        } catch (error) {
          setIsSpeaking(false);
          console.error('音声再生エラー:', error);
        }
      }

      // プ譜生成が必要な場合 - メッセージ表示後にLLM生成を開始
      if (shouldGenerate) {
        // 最初に音声読み上げを実行（既に再生中でない場合のみ）
        if (voicevoxConnected && !isSpeaking) {
          const voiceTextToSpeak = dialogueService.getVoiceText(systemMessage);
          setIsSpeaking(true);
          try {
            await voicevoxService.speak(voiceTextToSpeak);
            setIsSpeaking(false);
          } catch (error) {
            setIsSpeaking(false);
            console.error('音声再生エラー:', error);
          }
        }
        
        // 音声読み上げ完了後にLLM生成を開始
        setTimeout(() => {
          ProjectAnalyzer.analyzeAndComplete(dialogueService.getProjectInfo());
          setShowProjectScore(true);
        }, 1000); // 少し遅延させてユーザーがメッセージを確認できるようにする
      }
    } catch (error) {
      console.error('対話処理エラー:', error);
      const errorMessage = dialogueService.generateMessage(
        'system',
        'エラーが発生しました。もう一度お試しください。'
      );
      setCurrentMessage(errorMessage);
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  }, [voicevoxConnected]);

  const handleTextSubmit = useCallback((text: string) => {
    processDialogue(text);
  }, [processDialogue]);

  const handleNextClick = useCallback(async () => {
    // 発話中の場合は停止、そうでなければ次のステップに進む
    if (isSpeaking) {
      voicevoxService.stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    // noticeタイプの場合、次のステップに進む
    setIsProcessing(true);
    try {
      const { response, voiceText, shouldGenerate, currentStepType: newStepType } = await dialogueService.proceedToNext();
      
      if (newStepType) {
        setCurrentStepType(newStepType);
      }

      const systemMessage = dialogueService.generateMessage('system', response, voiceText);
      setCurrentMessage(systemMessage);
      setMessages(prev => [...prev, systemMessage]);

      // 音声読み上げ（既に再生中でない場合のみ）
      if (voicevoxConnected && !isSpeaking) {
        const voiceTextToSpeak = dialogueService.getVoiceText(systemMessage);
        setIsSpeaking(true);
        try {
          await voicevoxService.speak(voiceTextToSpeak);
          setIsSpeaking(false);
        } catch (error) {
          setIsSpeaking(false);
          console.error('音声再生エラー:', error);
        }
      }

      if (shouldGenerate) {
        // 音声読み上げ完了後にLLM生成を開始
        setTimeout(() => {
          ProjectAnalyzer.analyzeAndComplete(dialogueService.getProjectInfo());
          setShowProjectScore(true);
        }, 1000); // 少し遅延させてユーザーがメッセージを確認できるようにする
      }
    } catch (error) {
      console.error('エラー:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [voicevoxConnected, isSpeaking]);

  const handleVoiceInput = useCallback(async () => {
    if (isListening) {
      // 既存の音声認識を停止して新しい認識を開始
      speechRecognition.stop();
      setIsListening(false);
      setInterimTranscript('');
      // 少し待ってから新しい認識を開始
      setTimeout(() => {
        setIsListening(true);
        setInterimTranscript('');
        
        speechRecognition.listen(
          (interim) => setInterimTranscript(interim),
          30000  // 30秒に延長
        ).then((transcript) => {
          setIsListening(false);
          setInterimTranscript('');
          
          // 音声認識結果を既存のテキストに追加（上書きしない）
          if (transcript) {
            setVoiceTranscript(prev => {
              const currentText = prev.trim();
              return currentText ? `${currentText} ${transcript}` : transcript;
            });
          }
        }).catch((error) => {
          setIsListening(false);
          setInterimTranscript('');
          
          // no-speechエラーの場合は静かに無視する
          if ((error as Error).message === '音声が検出されませんでした') {
            return;
          }
          
          alert((error as Error).message);
        });
      }, 100);
      return;
    }

    if (!speechRecognition.isSupported()) {
      alert('お使いのブラウザは音声認識に対応していません。');
      return;
    }

    setIsListening(true);
    setInterimTranscript('');

    try {
      const transcript = await speechRecognition.listen(
        (interim) => setInterimTranscript(interim),
        30000  // 30秒に延長
      );
      setIsListening(false);
      setInterimTranscript('');
      
      // 音声認識結果を既存のテキストに追加（上書きしない）
      if (transcript) {
        setVoiceTranscript(prev => {
          const currentText = prev.trim();
          return currentText ? `${currentText} ${transcript}` : transcript;
        });
      }
    } catch (error) {
      setIsListening(false);
      setInterimTranscript('');
      
      // no-speechエラーの場合は静かに無視する
      if ((error as Error).message === '音声が検出されませんでした') {
        // 何もしない - ユーザーは再度試すことができる
        return;
      }
      
      // その他のエラーのみアラートを表示
      alert((error as Error).message);
    }
  }, [isListening]);


  const handleCloseProjectScore = () => {
    setShowProjectScore(false);
    dialogueService.reset();
    
    // リセット後の最初のシナリオステップを表示
    const currentStep = dialogueService.getCurrentStep();
    if (currentStep) {
      setCurrentStepType(currentStep.type);
      
      if (currentStep.type === 'question') {
        // questionタイプの場合はAI質問を生成
        setIsProcessing(true);
        dialogueService.processUserInput('').then(({ response, voiceText }) => {
          const restartMessage = dialogueService.generateMessage('system', response, voiceText);
          setCurrentMessage(restartMessage);
          setMessages([restartMessage]);
          setIsProcessing(false);
        }).catch((error) => {
          console.error('再起動時質問生成エラー:', error);
          setIsProcessing(false);
        });
      } else {
        const restartMessage = dialogueService.generateMessage('system', currentStep.displayMessage || '', currentStep.voiceMessage || '');
        setCurrentMessage(restartMessage);
        setMessages([restartMessage]);
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">プロジェクト振り返り対話システム ({llmProvider})</h1>
          {!voicevoxConnected && (
            <p className="text-sm text-orange-600 mt-1">
              VOICEVOXが接続されていません。音声出力は利用できません。
            </p>
          )}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <DialogueView 
          currentMessage={currentMessage} 
          isProcessing={isProcessing}
          currentStepType={currentStepType}
          onNextClick={handleNextClick}
          isSpeaking={isSpeaking}
        />
        <HistoryPanel messages={messages} />
      </div>

      <InputPanel
        onSubmit={handleTextSubmit}
        onClearVoiceTranscript={() => setVoiceTranscript('')}
        onVoiceInput={handleVoiceInput}
        isProcessing={isProcessing}
        isListening={isListening}
        interimTranscript={interimTranscript}
        isDisabled={currentStepType === 'notice'}
        allowSpeakingInterruption={currentStepType === 'talk' || currentStepType === 'question'}
        isSpeaking={isSpeaking}
        voiceTranscript={voiceTranscript}
      />

      {showProjectScore && (
        <ProjectScoreView
          projectInfo={ProjectAnalyzer.analyzeAndComplete(dialogueService.getProjectInfo())}
          onClose={handleCloseProjectScore}
        />
      )}

      {/* VOICEVOXクレジット表示 */}
      <div className="fixed top-4 right-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 shadow-lg text-xs text-gray-600 pointer-events-none z-10">
        <div className="flex items-center gap-1">
          <span className="font-medium">VOICEVOX:</span>
          <span>ずんだもん</span>
        </div>
      </div>
    </div>
  );
}

export default App;