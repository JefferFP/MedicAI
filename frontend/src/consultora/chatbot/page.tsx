import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2, User2, Bot } from 'lucide-react';

import { ChatInput } from '../components/ChatInput';
import { analizarSintomas } from '../../api/triageApi';
import { listarPacientes, type Paciente } from '../../api/pacientesApi';
import type { Message } from '../../types/triage';

const nivelStyle = (n?: string) => {
  if (n === 'EMERGENCIA') return { bg: 'bg-rose-50',    border: 'border-l-rose-500',    text: 'text-rose-700',    icon: AlertTriangle };
  if (n === 'URGENCIA')   return { bg: 'bg-amber-50',   border: 'border-l-amber-500',   text: 'text-amber-700',   icon: AlertCircle };
  return                         { bg: 'bg-emerald-50', border: 'border-l-emerald-500', text: 'text-emerald-700', icon: CheckCircle2 };
};

const ChatbotPage = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pacienteId, setPacienteId] = useState<number | undefined>();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listarPacientes().then(r => setPacientes(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    const current = input;
    setInput('');
    setIsTyping(true);

    try {
      const { data } = await analizarSintomas(current, pacienteId);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: data.resumen,
        timestamp: new Date(),
        metadata: {
          nivel: data.nivel,
          accion: data.accion_sugerida,
          especialidad: data.especialidad_sugerida || undefined,
          sintomas: data.sintomas_detectados,
        },
      }]);
    } catch (error) {
      console.error('Error triaje:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: 'Hubo un error al comunicarse con el servidor. Verifica que el backend esté activo.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const pacienteSel = pacientes.find(p => p.id === pacienteId);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-6 md:px-10 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Selector de paciente */}
          <div className="mb-6 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.15em]">
              Contexto clínico
            </label>
            <select
              className="mt-2 w-full bg-slate-50 rounded-xl py-3 px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-100 transition"
              value={pacienteId ?? ''}
              onChange={e => setPacienteId(e.target.value ? Number(e.target.value) : undefined)}
            >
              <option value="">Consulta anónima (sin historial)</option>
              {pacientes.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nombres} {p.apellidos} — DNI {p.dni}
                </option>
              ))}
            </select>
            {pacienteSel && (
              <p className="mt-2 text-[11px] text-slate-500">
                La IA usará: alergias, antecedentes, medicación y triajes previos.
              </p>
            )}
          </div>

          {messages.length === 0 ? (
            <div className="py-20 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-5 shadow-lg shadow-blue-500/30">
                <Bot className="text-white" size={32} />
              </div>
              <h2 className="text-3xl font-light text-slate-700 leading-tight">
                ¡Hola! Soy <span className="font-semibold text-slate-900">MedicAI</span>
              </h2>
              <p className="text-slate-500 mt-2 text-sm max-w-sm">
                Describe tus síntomas con claridad y te ayudaré a determinar la urgencia.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {messages.map(m => {
                const s = nivelStyle(m.metadata?.nivel);
                const Icon = s.icon;
                return (
                  <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {m.role === 'bot' && (
                      <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
                        <Bot className="text-white" size={18} />
                      </div>
                    )}
                    <div className={`max-w-[80%] ${m.role === 'user' ? 'order-1' : ''}`}>
                      <div className={`p-4 rounded-2xl shadow-sm transition-all ${
                        m.role === 'user'
                          ? 'bg-slate-900 text-white rounded-tr-sm'
                          : 'bg-white border border-slate-100 text-slate-800 rounded-tl-sm'
                      }`}>
                        <p className="text-[14px] leading-relaxed">{m.content}</p>
                        {m.metadata?.nivel && (
                          <div className={`mt-3 p-3 rounded-xl border-l-4 ${s.bg} ${s.border} ${s.text}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <Icon size={14} />
                              <span className="text-[10px] font-bold uppercase tracking-wider">{m.metadata.nivel}</span>
                            </div>
                            {m.metadata.accion && (
                              <p className="text-xs font-medium leading-relaxed">{m.metadata.accion}</p>
                            )}
                            {m.metadata.especialidad && (
                              <p className="text-[11px] mt-1 opacity-80">
                                Derivar a: <b>{m.metadata.especialidad}</b>
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    {m.role === 'user' && (
                      <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 order-2">
                        <User2 className="text-blue-700" size={18} />
                      </div>
                    )}
                  </div>
                );
              })}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center">
                    <Bot className="text-white" size={18} />
                  </div>
                  <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          )}
        </div>
      </div>

      <ChatInput
        input={input}
        setInput={setInput}
        onSend={handleSend}
        isTyping={isTyping}
        hasMessages={messages.length > 0}
        lastBotMessage={(() => {
          const bot = [...messages].reverse().find(m => m.role === 'bot');
          if (!bot) return undefined;
          const acc = bot.metadata?.accion ? ` Recomendación: ${bot.metadata.accion}` : '';
          const niv = bot.metadata?.nivel ? ` Nivel ${bot.metadata.nivel}.` : '';
          return `${bot.content}.${niv}${acc}`;
        })()}
      />
    </div>
  );
};

export default ChatbotPage;
