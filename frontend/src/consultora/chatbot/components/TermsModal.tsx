import { useState, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';

interface TermsModalProps {
  onAccept: () => void;
}

export default function TermsModal({ onAccept }: TermsModalProps) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-fade-in-up">
        <div className="flex items-center gap-3 mb-4 text-amber-400">
          <ShieldAlert className="w-8 h-8" />
          <h2 className="text-xl font-bold text-white">Términos y Condiciones</h2>
        </div>
        
        <div className="text-slate-300 space-y-3 mb-6 text-sm">
          <p>
            <strong>MediBot</strong> es un asistente de inteligencia artificial diseñado para orientar sobre síntomas y condiciones de salud, <strong>NO es un médico</strong>.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li>La información proporcionada es solo orientativa.</li>
            <li>No reemplaza un diagnóstico profesional ni consejo médico.</li>
            <li>En caso de emergencia, acuda inmediatamente a un centro de salud.</li>
          </ul>
          <p>
            Al continuar, aceptas el uso de esta herramienta bajo tu propia responsabilidad.
          </p>
        </div>

        <label className="flex items-start gap-3 cursor-pointer mb-6 group">
          <input 
            type="checkbox" 
            className="mt-1 w-5 h-5 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900 transition-colors"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
          />
          <span className="text-sm text-slate-300 group-hover:text-slate-200 transition-colors">
            He leído y acepto los términos y condiciones. Entiendo que esto no sustituye una consulta médica.
          </span>
        </label>

        <button 
          disabled={!accepted}
          onClick={onAccept}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
            accepted 
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          Aceptar y continuar
        </button>
      </div>
    </div>
  );
}
