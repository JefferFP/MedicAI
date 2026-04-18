import { useEffect, useRef, useState } from 'react';
import { Mic, AudioLines, Send, Square, VolumeX } from 'lucide-react';

interface Props {
  input: string;
  setInput: (val: string) => void;
  onSend: () => void;
  isTyping: boolean;
  hasMessages: boolean;
  lastBotMessage?: string;
}

// Tipos del Web Speech API (no vienen en lib.dom de TS por defecto)
type SpeechRecognitionEvent = any;
type SpeechRecognitionErrorEvent = any;

const getRecognition = (): any | null => {
  const SR: any =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SR) return null;
  const r = new SR();
  r.lang = 'es-PE';
  r.continuous = false;
  r.interimResults = true;
  return r;
};

export const ChatInput = ({
  input, setInput, onSend, isTyping, hasMessages, lastBotMessage,
}: Props) => {
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [supportsSTT, setSupportsSTT] = useState(true);
  const [sttError, setSttError] = useState('');
  const recognitionRef = useRef<any>(null);
  const baseTextRef = useRef<string>('');

  useEffect(() => {
    const r = getRecognition();
    if (!r) { setSupportsSTT(false); return; }
    recognitionRef.current = r;

    r.onresult = (e: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t;
        else interim += t;
      }
      const combined = (baseTextRef.current + ' ' + final + interim).trim();
      setInput(combined);
      if (final) baseTextRef.current = (baseTextRef.current + ' ' + final).trim();
    };
    r.onerror = (e: SpeechRecognitionErrorEvent) => {
      console.error('STT error:', e.error);
      setListening(false);
      const msg =
        e.error === 'network'        ? 'Sin conexión a internet. El dictado de Chrome requiere internet (usa Google Cloud).' :
        e.error === 'not-allowed'    ? 'Permiso de micrófono denegado. Habilítalo en la barra de direcciones.' :
        e.error === 'no-speech'      ? 'No detecté tu voz. Intenta hablar más fuerte.' :
        e.error === 'audio-capture'  ? 'No se encontró un micrófono en tu equipo.' :
        e.error === 'service-not-allowed' ? 'Servicio de voz bloqueado por el navegador.' :
        `Error de voz: ${e.error}`;
      setSttError(msg);
      setTimeout(() => setSttError(''), 6000);
    };
    r.onend = () => setListening(false);

    return () => {
      try { r.stop(); } catch {}
      try { window.speechSynthesis?.cancel(); } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }
    if (!navigator.onLine) {
      setSttError('Sin internet. El dictado de Chrome requiere conexión.');
      setTimeout(() => setSttError(''), 6000);
      return;
    }
    setSttError('');
    baseTextRef.current = input;
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSpeak = () => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    if (speaking) { synth.cancel(); setSpeaking(false); return; }
    if (!lastBotMessage) return;

    synth.cancel();
    const utt = new SpeechSynthesisUtterance(lastBotMessage);
    utt.lang = 'es-ES';
    utt.rate = 1;
    utt.pitch = 1;
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    setSpeaking(true);
    synth.speak(utt);
  };

  const canSend = !isTyping && input.trim().length > 0;

  return (
    <div className="p-6 w-full flex justify-center bg-gradient-to-t from-white via-white/90 to-transparent">
      <div className="w-full max-w-2xl">
        <div className={`bg-[#0B0F19] rounded-full p-2 flex items-center shadow-2xl ring-4 transition-all
          ${listening ? 'ring-rose-200' : speaking ? 'ring-blue-200' : 'ring-slate-100'}
          focus-within:ring-blue-100`}>

          <input
            className="flex-1 bg-transparent text-white px-5 py-3 outline-none text-[14px] placeholder:text-slate-500 font-normal"
            placeholder={
              listening
                ? '🎙️  Escuchando... habla ahora'
                : hasMessages ? 'Escribe aquí tus síntomas...' : '¿Indícame su malestar?'
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && canSend && onSend()}
          />

          <div className="flex items-center gap-1 pr-1">
            {/* Micrófono (STT) */}
            <button
              onClick={toggleMic}
              disabled={!supportsSTT}
              title={supportsSTT ? (listening ? 'Detener dictado' : 'Dictar síntomas') : 'Tu navegador no soporta dictado'}
              className={`relative p-2.5 rounded-full transition-colors
                ${!supportsSTT ? 'text-slate-600 cursor-not-allowed' :
                  listening ? 'text-rose-400 bg-rose-500/10' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
            >
              {listening ? <Square size={18} fill="currentColor" /> : <Mic size={18} />}
              {listening && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
              )}
            </button>

            {/* Audio TTS */}
            <button
              onClick={toggleSpeak}
              disabled={!lastBotMessage}
              title={speaking ? 'Detener lectura' : 'Escuchar última respuesta de MedicAI'}
              className={`p-2.5 rounded-full transition-colors
                ${!lastBotMessage ? 'text-slate-600 cursor-not-allowed' :
                  speaking ? 'text-blue-400 bg-blue-500/10 animate-pulse' : 'text-slate-400 hover:text-blue-400 hover:bg-white/10'}`}
            >
              {speaking ? <VolumeX size={18} /> : <AudioLines size={18} />}
            </button>

            {/* Enviar */}
            <button
              onClick={onSend}
              disabled={!canSend}
              className={`p-3 rounded-full transition-all flex items-center justify-center shadow-lg active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed
                ${isTyping ? 'bg-blue-600 text-white animate-pulse' : 'bg-white text-black hover:bg-slate-200'}`}
            >
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* Error visible del dictado */}
        {sttError && (
          <div className="mt-2 mx-auto max-w-lg text-center text-[12px] text-rose-600 bg-rose-50 border border-rose-100 rounded-full px-4 py-1.5">
            {sttError}
          </div>
        )}
        {!supportsSTT && !sttError && (
          <p className="text-[11px] text-slate-400 text-center mt-2">
            El dictado por voz requiere Chrome, Edge o Safari.
          </p>
        )}
      </div>
    </div>
  );
};
