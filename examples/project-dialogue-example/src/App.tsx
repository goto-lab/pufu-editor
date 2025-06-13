import { useState, useEffect, useCallback } from 'react';
import { DialogueView } from './components/DialogueView';
import { HistoryPanel } from './components/HistoryPanel';
import { InputPanel } from './components/InputPanel';
import { ProjectScoreView } from './components/ProjectScoreView';
import { DialogueService } from './services/DialogueService';
import { VoicevoxService } from './services/VoicevoxService';
import { SpeechRecognitionService } from './services/SpeechRecognition';
import { ProjectAnalyzer } from './services/ProjectAnalyzer';
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

  const dialogueService = DialogueService.getInstance();
  const voicevoxService = VoicevoxService.getInstance();
  const speechRecognition = SpeechRecognitionService.getInstance();

  useEffect(() => {
    // VOICEVOXの接続確認
    voicevoxService.checkConnection().then(setVoicevoxConnected);

    // 初期メッセージ（最初のシナリオステップを表示）
    const currentStep = dialogueService.getCurrentStep();
    if (currentStep) {
      setCurrentStepType(currentStep.type);
      const initMessage = dialogueService.generateMessage('system', currentStep.message);
      setCurrentMessage(initMessage);
      setMessages([initMessage]);

      // 音声で読み上げ
      voicevoxService.checkConnection().then(connected => {
        if (connected) {
          voicevoxService.speak(initMessage.text).catch(console.error);
        }
      });
    }
  }, []);

  const processDialogue = useCallback(async (userInput: string) => {
    setIsProcessing(true);

    // ユーザーメッセージを追加
    const userMessage = dialogueService.generateMessage('user', userInput);
    setCurrentMessage(userMessage);
    setMessages(prev => [...prev, userMessage]);

    try {
      // 対話処理
      const { response, shouldGenerate, currentStepType: newStepType } = await dialogueService.processUserInput(userInput);

      // 現在のステップタイプを更新
      if (newStepType) {
        setCurrentStepType(newStepType);
      }

      // システムレスポンスを追加
      const systemMessage = dialogueService.generateMessage('system', response);
      setCurrentMessage(systemMessage);
      setMessages(prev => [...prev, systemMessage]);

      // 音声で読み上げ
      if (voicevoxConnected) {
        await voicevoxService.speak(response);
      }

      // プ譜生成が必要な場合
      if (shouldGenerate) {
        setTimeout(() => {
          ProjectAnalyzer.analyzeAndComplete(dialogueService.getProjectInfo());
          setShowProjectScore(true);
        }, 2000);
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
    // noticeタイプの場合、次のステップに進む
    setIsProcessing(true);
    try {
      const { response, shouldGenerate, currentStepType: newStepType } = await dialogueService.proceedToNext();
      
      if (newStepType) {
        setCurrentStepType(newStepType);
      }

      const systemMessage = dialogueService.generateMessage('system', response);
      setCurrentMessage(systemMessage);
      setMessages(prev => [...prev, systemMessage]);

      if (voicevoxConnected) {
        await voicevoxService.speak(response);
      }

      if (shouldGenerate) {
        setTimeout(() => {
          ProjectAnalyzer.analyzeAndComplete(dialogueService.getProjectInfo());
          setShowProjectScore(true);
        }, 2000);
      }
    } catch (error) {
      console.error('エラー:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [voicevoxConnected]);

  const handleVoiceInput = useCallback(async () => {
    if (isListening) {
      // 音声認識を停止
      speechRecognition.stop();
      setIsListening(false);
      setInterimTranscript('');
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
        10000
      );
      setIsListening(false);
      setInterimTranscript('');
      
      if (transcript) {
        handleTextSubmit(transcript);
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
  }, [isListening, handleTextSubmit]);


  const handleCloseProjectScore = () => {
    setShowProjectScore(false);
    dialogueService.reset();
    
    // リセット後の最初のシナリオステップを表示
    const currentStep = dialogueService.getCurrentStep();
    if (currentStep) {
      setCurrentStepType(currentStep.type);
      const restartMessage = dialogueService.generateMessage('system', currentStep.message);
      setCurrentMessage(restartMessage);
      setMessages([restartMessage]);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">プロジェクト振り返り対話システム</h1>
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
        />
        <HistoryPanel messages={messages} />
      </div>

      <InputPanel
        onSubmit={handleTextSubmit}
        onVoiceInput={handleVoiceInput}
        isProcessing={isProcessing}
        isListening={isListening}
        interimTranscript={interimTranscript}
        isDisabled={currentStepType === 'notice'}
      />

      {showProjectScore && (
        <ProjectScoreView
          projectInfo={ProjectAnalyzer.analyzeAndComplete(dialogueService.getProjectInfo())}
          onClose={handleCloseProjectScore}
        />
      )}
    </div>
  );
}

export default App;