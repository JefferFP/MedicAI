import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  rol: 'user' | 'assistant' | 'system';
  contenido: string;
}

export default function ChatMessage({ rol, contenido }: ChatMessageProps) {
  if (rol === 'system') return null;
  
  const isUser = rol === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`flex max-w-[80%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg
          ${isUser ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-emerald-500 to-teal-600'}
        `}>
          {isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-6 h-6 text-white" />}
        </div>

        {/* Bubble */}
        <div className={`px-5 py-3.5 rounded-2xl text-sm md:text-base leading-relaxed shadow-md
          ${isUser 
            ? 'bg-blue-600 text-white rounded-br-sm' 
            : 'bg-slate-800 text-slate-200 border border-slate-700/50 rounded-bl-sm'
          }`}
        >
          {contenido.split('\n').map((line, i) => (
            <p key={i} className="mb-1 last:mb-0">
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
