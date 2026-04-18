import { useEffect, useState } from 'react';
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth,
  startOfWeek, endOfWeek, isSameMonth, isSameDay,
  eachDayOfInterval, parseISO,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, X, Clock, CalendarDays, Trash2, AlertCircle, FileText } from 'lucide-react';

import { listarCitas, crearCita, eliminarCita, type Cita } from '../../api/citasApi';
import { listarPacientes, type Paciente } from '../../api/pacientesApi';
import { listarMedicos, type Medico } from '../../api/medicosApi';

const estadoColor: Record<string, string> = {
  pendiente:   'bg-amber-100 text-amber-700',
  confirmada:  'bg-emerald-100 text-emerald-700',
  atendida:    'bg-blue-100 text-blue-700',
  cancelada:   'bg-rose-100 text-rose-700',
  no_asistio:  'bg-slate-200 text-slate-600',
};

const CalendarioPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ paciente_id: '', medico_id: '', hora: '09:00', motivo: '' });

  const cargar = async () => {
    try {
      const { data } = await listarCitas();
      setCitas(data);
    } catch { setError('No se pudieron cargar las citas'); }
  };

  useEffect(() => {
    cargar();
    listarPacientes().then(r => setPacientes(r.data)).catch(console.error);
    listarMedicos().then(r => setMedicos(r.data)).catch(console.error);
  }, []);

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.paciente_id || !form.medico_id) { setError('Selecciona paciente y médico'); return; }
    setLoading(true); setError('');
    try {
      const [h, m] = form.hora.split(':').map(Number);
      const fecha = new Date(selectedDate);
      fecha.setHours(h, m, 0, 0);
      await crearCita({
        paciente_id: Number(form.paciente_id),
        medico_id: Number(form.medico_id),
        fecha_hora: fecha.toISOString(),
        motivo: form.motivo || undefined,
      });
      await cargar();
      setShowModal(false);
      setForm({ paciente_id: '', medico_id: '', hora: '09:00', motivo: '' });
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Error al guardar cita');
    } finally { setLoading(false); }
  };

  const borrar = async (id: number) => {
    if (!confirm('¿Eliminar esta cita?')) return;
    await eliminarCita(id); await cargar();
  };

  const citasDelDia = citas.filter(c => isSameDay(parseISO(c.fecha_hora), selectedDate));
  const pacienteName = (id: number) => { const p = pacientes.find(x => x.id === id); return p ? `${p.nombres} ${p.apellidos}` : `#${id}`; };
  const medicoName = (id: number) => medicos.find(x => x.id === id)?.especialidad || `Médico #${id}`;

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const days = eachDayOfInterval({ start: startOfWeek(monthStart), end: endOfWeek(monthEnd) });

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendario */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900 capitalize">
              {format(currentMonth, 'MMMM yyyy', { locale: es })}
            </h2>
            <div className="flex gap-2">
              <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition"><ChevronLeft size={18} /></button>
              <button onClick={() => setCurrentMonth(new Date())} className="px-3 text-xs font-semibold bg-slate-50 hover:bg-slate-100 rounded-xl transition">Hoy</button>
              <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition"><ChevronRight size={18} /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 mb-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => <div key={d}>{d}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {days.map((day, idx) => {
              const tiene = citas.some(c => isSameDay(parseISO(c.fecha_hora), day));
              const sel = isSameDay(day, selectedDate);
              const mismoMes = isSameMonth(day, monthStart);
              const today = isSameDay(day, new Date());
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(day)}
                  className={`aspect-square p-2 rounded-xl flex flex-col items-start justify-start text-left transition-all
                    ${!mismoMes ? 'text-slate-300' : 'text-slate-700'}
                    ${sel ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-4 ring-blue-50' :
                      today ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50'}`}
                >
                  <span className="text-sm font-semibold">{format(day, 'd')}</span>
                  {tiene && (
                    <span className={`mt-auto w-1.5 h-1.5 rounded-full ${sel ? 'bg-white' : 'bg-blue-500'}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Panel lateral: citas del día */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Citas del día</div>
              <div className="text-base font-semibold text-slate-900 capitalize">
                {format(selectedDate, "d 'de' MMMM", { locale: es })}
              </div>
            </div>
            <button onClick={() => setShowModal(true)} className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition">
              <Plus size={16} />
            </button>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto">
            {citasDelDia.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-sm">Sin citas agendadas</div>
            ) : citasDelDia.map(c => (
              <div key={c.id} className="p-3 rounded-xl border border-slate-100 hover:border-blue-200 transition">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <Clock size={12} />
                      {format(parseISO(c.fecha_hora), 'HH:mm')}
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${estadoColor[c.estado]}`}>{c.estado}</span>
                    </div>
                    <div className="font-semibold text-sm text-slate-800 truncate">{pacienteName(c.paciente_id)}</div>
                    <div className="text-xs text-slate-500">{medicoName(c.medico_id)}</div>
                    {c.motivo && <div className="text-xs text-slate-600 mt-1 flex gap-1 items-start"><FileText size={11} className="mt-0.5 shrink-0" /> {c.motivo}</div>}
                  </div>
                  <button onClick={() => borrar(c.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-7">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Agendar cita</h3>
                <p className="text-xs text-slate-500 mt-1">Se guardará en la base de datos</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 text-slate-400 rounded-full transition"><X size={20} /></button>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 p-3 bg-rose-50 text-rose-600 rounded-xl text-sm">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <form onSubmit={guardar} className="space-y-3">
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Fecha</label>
                <div className="relative mt-1.5">
                  <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={16} />
                  <input
                    type="date" required
                    className="w-full bg-slate-50 rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-100 text-sm font-medium"
                    value={format(selectedDate, 'yyyy-MM-dd')}
                    onChange={e => { const [y, m, d] = e.target.value.split('-').map(Number); setSelectedDate(new Date(y, m - 1, d)); }}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Paciente</label>
                <select required className="mt-1.5 w-full bg-slate-50 rounded-xl py-3 px-4 outline-none text-sm"
                  value={form.paciente_id} onChange={e => setForm({ ...form, paciente_id: e.target.value })}>
                  <option value="">Seleccionar paciente...</option>
                  {pacientes.map(p => <option key={p.id} value={p.id}>{p.nombres} {p.apellidos} ({p.dni})</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Médico</label>
                <select required className="mt-1.5 w-full bg-slate-50 rounded-xl py-3 px-4 outline-none text-sm"
                  value={form.medico_id} onChange={e => setForm({ ...form, medico_id: e.target.value })}>
                  <option value="">Seleccionar médico...</option>
                  {medicos.map(m => <option key={m.id} value={m.id}>{m.especialidad} (CMP {m.cmp})</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Hora</label>
                <div className="relative mt-1.5">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="time" required className="w-full bg-slate-50 rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-100 text-sm"
                    value={form.hora} onChange={e => setForm({ ...form, hora: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Motivo</label>
                <input className="mt-1.5 w-full bg-slate-50 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-100 text-sm"
                  placeholder="Motivo de la consulta" value={form.motivo} onChange={e => setForm({ ...form, motivo: e.target.value })} />
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-slate-900 text-white py-3.5 rounded-2xl font-semibold text-sm hover:bg-slate-800 disabled:opacity-60 transition mt-2">
                {loading ? 'Guardando...' : 'Guardar cita'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarioPage;
