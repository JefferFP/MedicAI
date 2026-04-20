import { NavLink } from 'react-router-dom';
import {
  MessageSquare, Users, Settings,
} from 'lucide-react';
import logoMedicAI from '../../img/logo-medica.png';

type NavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  group: string;
};

const navigation: NavItem[] = [
  { to: '/chatbot',         label: 'Chatbot IA',        icon: MessageSquare, group: 'Asistencia' },
  { to: '/pacientes',       label: 'Pacientes',         icon: Users,         group: 'Gestión' },
];

const groupOrder = ['Asistencia', 'Gestión'];

export const Sidebar = () => {
  return (
    <aside className="group w-20 hover:w-72 h-screen bg-[#0B0F19] text-white flex flex-col py-6 z-30 transition-all duration-300 ease-in-out shadow-2xl overflow-hidden shrink-0">
      <div className="flex items-center px-5 mb-8 gap-3 shrink-0">
        <div className="min-w-[40px] w-10 h-10 rounded-xl overflow-hidden bg-white/5 ring-1 ring-white/10 shrink-0">
          <img src={logoMedicAI} alt="MedicAI" className="w-full h-full object-cover" />
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          <div className="font-semibold text-[15px] tracking-tight">MedicAI</div>
          <div className="text-[10px] text-white/50 uppercase tracking-[0.2em]">Consultora</div>
        </div>
      </div>

      <nav className="flex-1 px-3 overflow-y-auto">
        {groupOrder.map(group => (
          <div key={group} className="mb-4">
            <div className="px-3 pb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              {group}
            </div>
            <div className="flex flex-col gap-1">
              {navigation.filter(n => n.group === group).map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium
                    ${isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'}`
                  }
                >
                  <div className="min-w-[22px] flex justify-center"><Icon size={20} /></div>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    {label}
                  </span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 pt-4 border-t border-white/5">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-all text-sm">
          <div className="min-w-[22px] flex justify-center"><Settings size={20} /></div>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Configuración
          </span>
        </button>
      </div>
    </aside>
  );
};
