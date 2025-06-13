import React from "react";
import ReactMarkdown from "react-markdown";
import { DialogueMessage } from "../types";

interface DialogueViewProps {
  currentMessage: DialogueMessage | null;
  isProcessing: boolean;
  currentStepType?: string;
  onNextClick?: () => void;
  isSpeaking?: boolean;
}

export const DialogueView: React.FC<DialogueViewProps> = ({
  currentMessage,
  isProcessing,
  currentStepType,
  onNextClick,
  isSpeaking,
}) => {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        {currentMessage ? (
          <div
            className={`transform transition-all duration-300 ${
              currentMessage.speaker === "system"
                ? "slide-in-left"
                : "slide-in-right"
            }`}
          >
            <div
              className={`flex items-start gap-4 ${
                currentMessage.speaker === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold ${
                  currentMessage.speaker === "system"
                    ? "bg-green-500"
                    : "bg-blue-500"
                }`}
              >
                {currentMessage.speaker === "system" ? "🤖" : "👤"}
              </div>
              <div
                className={`flex-1 p-6 rounded-lg ${
                  currentMessage.speaker === "system"
                    ? "bg-gray-100 rounded-tl-none"
                    : "bg-blue-100 rounded-tr-none"
                }`}
              >
                <div className="text-lg prose prose-sm max-w-none">
                  <ReactMarkdown>{currentMessage.text}</ReactMarkdown>
                </div>
                {currentMessage.speaker === "system" &&
                  currentStepType === "notice" &&
                  !currentMessage.text.includes("ありがとうございました") && (
                    <div className="mt-4 text-right">
                      {onNextClick && (
                        <button
                          onClick={onNextClick}
                          className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          次へ
                        </button>
                      )}
                    </div>
                  )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            {isProcessing ? (
              <div className="flex items-center justify-center gap-2">
                <div
                  className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            ) : (
              <p>対話を開始してください</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
