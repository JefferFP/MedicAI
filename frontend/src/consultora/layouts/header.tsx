import { useLocation } from 'react-router-dom';
import { Activity } from 'lucide-react';

const meta: Record<string, { title: string; subtitle: string }> = {
  '/chatbot':         { title: 'Chatbot IA',        subtitle: 'Asistente de triaje médico inteligente' },
  '/pacientes':       { title: 'Pacientes',         subtitle: 'Gestión de fichas clínicas' },
  '/calendario':      { title: 'Calendario',        subtitle: 'Agenda de citas médicas' },
  '/historialtriaje': { title: 'Historial Triaje',  subtitle: 'Evaluaciones IA registradas' },
  '/historialmedico': { title: 'Historial Médico',  subtitle: 'Consultas y diagnósticos clínicos' },
};

export const Header = () => {
  const { pathname } = useLocation();
  const info = meta[pathname] || { title: 'MedicAI', subtitle: 'Consultora médica' };

  return (
    <header className="sticky top-0 w-full px-8 py-5 flex items-center justify-between bg-white/80 backdrop-blur-lg border-b border-slate-100 z-20">
      <div>
        <h1 className="text-[22px] font-semibold text-slate-900 tracking-tight leading-tight">
          {info.title}
        </h1>
        <p className="text-[13px] text-slate-500 font-normal">{info.subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[11px] font-semibold tracking-wide">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <Activity size={12} />
          SISTEMA ACTIVO
        </div>
      </div>
    </header>
  );
};
