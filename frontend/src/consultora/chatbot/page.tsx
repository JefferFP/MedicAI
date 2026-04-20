import { useEffect, useRef, useState } from 'react';
import { Bot } from 'lucide-react';

import ChatInput from './components/ChatInput';
import ChatMessage from './components/ChatMessage';
import TermsModal from './components/TermsModal';
import { chatbotApi, type Mensaje } from '../../api/chatbotApi';
import { listarPacientes, type Paciente } from '../../api/pacientesApi';

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Mensaje[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pacienteId, setPacienteId] = useState<number>(1); // Default for testing
  const [conversacionId, setConversacionId] = useState<number | undefined>();
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const accepted = localStorage.getItem('termsAccepted') === 'true';
    setTermsAccepted(accepted);
    
    listarPacientes()
      .then(r => {
        setPacientes(r.data);
        if (r.data.length > 0) setPacienteId(r.data[0].id);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleAcceptTerms = () => {
    localStorage.setItem('termsAccepted', 'true');
    setTermsAccepted(true);
  };

  const handleSendMessage = async (contenido: string) => {
    if (!contenido.trim() || isTyping) return;

    const userMsg: Mensaje = {
      id: Date.now(),
      rol: 'user',
      contenido,
      fecha: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const data = await chatbotApi.enviarMensaje(contenido, pacienteId, conversacionId);
      
      if (!conversacionId) {
        setConversacionId(data.conversacion_id);
      }

      const botMsg: Mensaje = {
        id: data.mensaje_id,
        rol: 'assistant',
        contenido: data.respuesta,
        fecha: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        rol: 'assistant',
        contenido: 'Lo siento, ha ocurrido un error al comunicarse con el servidor. Verifica tu conexión.',
        fecha: new Date().toISOString()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const pacienteSel = pacientes.find(p => p.id === pacienteId);

  return (
    <div className="flex flex-col h-full bg-slate-950 relative">
      {!termsAccepted && <TermsModal onAccept={handleAcceptTerms} />}

      <div className="flex-1 overflow-y-auto px-4 md:px-10 py-6 scrollbar-thin scrollbar-thumb-slate-800">
        <div className="max-w-4xl mx-auto flex flex-col min-h-full">
          
          {/* Header & Patient Context Selector */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-500">
                <Bot size={24} />
              </div>
              <div>
                <h1 className="text-white font-semibold">MediBot Assistant</h1>
                <p className="text-xs text-slate-400">Orientación médica impulsada por IA</p>
              </div>
            </div>
            
            <div className="flex-1 max-w-xs">
              <select
                className="w-full bg-slate-800 border border-slate-700 text-slate-300 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={pacienteId}
                onChange={e => setPacienteId(Number(e.target.value))}
                disabled={messages.length > 0} // No cambiar paciente a mitad de charla
              >
                {pacientes.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nombres} {p.apellidos}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[10px] text-slate-500 text-right">
                {messages.length > 0 ? "Contexto bloqueado durante el chat" : "Selecciona paciente para contexto clínico"}
              </p>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 flex flex-col justify-end">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 my-auto py-20 opacity-80">
                <Bot className="w-16 h-16 text-blue-500/50" />
                <h2 className="text-2xl font-semibold text-slate-300">¿En qué te puedo ayudar hoy?</h2>
                <p className="text-slate-500 text-sm max-w-md">
                  Describe tus síntomas y MediBot te orientará sobre qué acciones tomar. 
                  El sistema revisará automáticamente el historial clínico de {pacienteSel?.nombres || 'este paciente'}.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {messages.map(m => (
                  <ChatMessage key={m.id} rol={m.rol} contenido={m.contenido} />
                ))}
                
                {isTyping && (
                  <div className="flex w-full justify-start mb-6 animate-pulse">
                    <div className="flex flex-row items-end gap-3">
                      <div className="shrink-0 w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-slate-500" />
                      </div>
                      <div className="px-5 py-3.5 rounded-2xl bg-slate-800 border border-slate-700/50 rounded-bl-sm">
                        <div className="flex gap-1.5 items-center h-5">
                          <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={scrollRef} className="h-4" />
              </div>
            )}
          </div>
        </div>
      </div>

      <ChatInput onSendMessage={handleSendMessage} isLoading={isTyping} />
    </div>
  );
}
