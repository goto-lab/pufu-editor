import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { DialogueMessage } from '../types';

interface HistoryPanelProps {
  messages: DialogueMessage[];
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ messages }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700">対話履歴</h2>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-sm text-gray-500 text-center">履歴はまだありません</p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`text-sm p-3 rounded-lg ${
                message.speaker === 'system'
                  ? 'bg-white border border-gray-200'
                  : 'bg-blue-50 border border-blue-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`font-medium ${
                  message.speaker === 'system' ? 'text-gray-600' : 'text-blue-600'
                }`}>
                  {message.speaker === 'system' ? 'システム' : 'あなた'}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleTimeString('ja-JP', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="text-gray-700 prose prose-xs max-w-none">
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};