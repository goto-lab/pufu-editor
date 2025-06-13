import React, { useState, useRef, useEffect } from 'react';
import { AudioDeviceManager, AudioDevice } from '../services/AudioDeviceManager';

interface InputPanelProps {
  onSubmit: (text: string) => void;
  onVoiceInput: () => void;
  onClearVoiceTranscript?: () => void;
  isProcessing: boolean;
  isListening: boolean;
  interimTranscript?: string;
  voiceTranscript?: string; // 音声認識結果
  isDisabled?: boolean;
  allowSpeakingInterruption?: boolean; // 発話中の回答を許可するか
  isSpeaking?: boolean; // 現在発話中か
}

export const InputPanel: React.FC<InputPanelProps> = ({
  onSubmit,
  onVoiceInput,
  onClearVoiceTranscript,
  isProcessing,
  isListening,
  interimTranscript,
  voiceTranscript,
  isDisabled = false,
  allowSpeakingInterruption = false,
  isSpeaking = false
}) => {
  const [inputText, setInputText] = useState('');
  
  // 音声認識結果を入力欄に反映
  useEffect(() => {
    if (voiceTranscript && !isListening) {
      setInputText(prev => {
        const prevTrim = prev.trim();
        const voiceTrim = voiceTranscript.trim();
        return prevTrim ? `${prevTrim} ${voiceTrim}` : voiceTrim;
      });
      // 音声認識結果をクリア
      if (onClearVoiceTranscript) {
        onClearVoiceTranscript();
      }
    }
  }, [voiceTranscript, isListening, onClearVoiceTranscript]);
  const [audioDevices, setAudioDevices] = useState<AudioDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('default');
  const [showDeviceSelector, setShowDeviceSelector] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const audioDeviceManager = AudioDeviceManager.getInstance();

  // 表示用の値を計算（簡素化）
  const getDisplayValue = () => {
    if (isListening && interimTranscript) {
      // 音声入力中: 入力欄の現在値 + 中間結果
      return inputText ? `${inputText} ${interimTranscript}` : interimTranscript;
    }
    // 通常時: 入力欄の値のみ
    return inputText;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const textToSubmit = inputText.trim();
    
    if (textToSubmit && !isProcessing) {
      onSubmit(textToSubmit);
      setInputText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      // Ctrl+Enterで送信
      e.preventDefault();
      handleSubmit(e as React.FormEvent);
    }
    // Enterは通常の改行動作（preventDefaultしない）
  };

  useEffect(() => {
    loadAudioDevices();
  }, []);

  const loadAudioDevices = async () => {
    const devices = await audioDeviceManager.getAudioInputDevices();
    setAudioDevices(devices);
  };

  const handleDeviceChange = async (deviceId: string) => {
    try {
      await audioDeviceManager.setAudioDevice(deviceId);
      setSelectedDeviceId(deviceId);
      setShowDeviceSelector(false);
    } catch (error) {
      console.error('デバイスの切り替えに失敗:', error);
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              rows={3}
              value={getDisplayValue()}
              onChange={(e) => {
                // 音声入力中でない場合のみ入力を受け付ける
                if (!isListening) {
                  setInputText(e.target.value);
                }
              }}
              onKeyDown={handleKeyDown}
              disabled={isProcessing || (isDisabled && !(allowSpeakingInterruption && isSpeaking))}
              placeholder={
                isListening 
                  ? '音声を聞き取っています...' 
                  : 'メッセージを入力してください（Ctrl+Enterで送信）'
              }
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 resize-none"
            />
            {isListening && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
          </div>
          
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDeviceSelector(!showDeviceSelector)}
              className="px-3 py-2 h-12 rounded-lg font-medium transition-colors bg-gray-200 hover:bg-gray-300 text-gray-700"
              title="マイクを選択"
            >
              ⚙️
            </button>
            
            {showDeviceSelector && (
              <div className="absolute bottom-full mb-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-[200px]">
                <div className="text-sm font-medium text-gray-700 mb-2">マイクを選択:</div>
                {audioDevices.map((device) => (
                  <button
                    key={device.deviceId}
                    type="button"
                    onClick={() => handleDeviceChange(device.deviceId)}
                    className={`block w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm ${
                      selectedDeviceId === device.deviceId ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    {device.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button
            type="button"
            onClick={onVoiceInput}
            disabled={isProcessing || (isDisabled && !(allowSpeakingInterruption && isSpeaking))}
            className={`px-4 py-2 h-12 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
            title={isListening ? '録音停止' : '音声入力'}
          >
            {isListening ? '🔴' : '🎤'}
          </button>
          
          <button
            type="submit"
            disabled={isProcessing || isListening || !inputText.trim() || (isDisabled && !(allowSpeakingInterruption && isSpeaking))}
            className="px-6 py-2 h-12 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            送信
          </button>
        </div>
      </form>
    </div>
  );
};