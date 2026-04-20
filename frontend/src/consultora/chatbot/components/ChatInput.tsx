import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (mensaje: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [text]);

  const handleSend = () => {
    if (text.trim() && !isLoading) {
      onSendMessage(text.trim());
      setText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-slate-900 border-t border-slate-800 p-4">
      <div className="max-w-3xl mx-auto relative flex items-end gap-3 bg-slate-800 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all shadow-inner">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe tus síntomas aquí..."
          className="flex-1 max-h-[150px] bg-transparent text-slate-200 placeholder-slate-500 resize-none outline-none py-2 px-3 min-h-[44px] scrollbar-thin scrollbar-thumb-slate-600"
          rows={1}
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || isLoading}
          className={`shrink-0 p-3 rounded-xl transition-all duration-300 flex items-center justify-center ${
            text.trim() && !isLoading
              ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/50'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      <div className="text-center mt-2">
         <span className="text-xs text-slate-500">
           MediBot puede cometer errores. Considera consultar la información con un profesional de la salud.
         </span>
      </div>
    </div>
  );
}
