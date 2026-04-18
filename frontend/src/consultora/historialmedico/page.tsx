import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Stethoscope, Pill, Activity, FileText, Filter, RefreshCw } from 'lucide-react';
import { listarHistorial, type Historial } from '../../api/historialApi';
import { listarPacientes, type Paciente } from '../../api/pacientesApi';

const HistorialMedicoPage = () => {
  const [items, setItems] = useState<Historial[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pacienteId, setPacienteId] = useState<number | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargar = async () => {
    setLoading(true); setError('');
    try {
      const { data } = await listarHistorial(pacienteId || undefined);
      setItems(data);
    } catch { setError('No se pudo cargar el historial clínico.'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    listarPacientes().then(r => setPacientes(r.data)).catch(() => {});
  }, []);

  useEffect(() => { cargar(); }, [pacienteId]);

  const pacienteName = (id: number) => {
    const p = pacientes.find(x => x.id === id);
    return p ? `${p.nombres} ${p.apellidos}` : `Paciente #${id}`;
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <select
            className="w-full bg-white border border-slate-100 rounded-2xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-100 text-sm font-medium"
            value={pacienteId}
            onChange={e => setPacienteId(e.target.value ? Number(e.target.value) : '')}
          >
            <option value="">Todas las consultas</option>
            {pacientes.map(p => (
              <option key={p.id} value={p.id}>{p.nombres} {p.apellidos} — {p.dni}</option>
            ))}
          </select>
        </div>
        <button onClick={cargar} className="p-3 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {error && <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl mb-4 text-sm">{error}</div>}
      {loading && <div className="text-center text-slate-400 py-10 text-sm">Cargando...</div>}
      {!loading && items.length === 0 && !error && (
        <div className="text-center text-slate-400 py-16 text-sm">Sin consultas registradas</div>
      )}

      <div className="space-y-4">
        {items.map(h => (
          <div key={h.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Stethoscope className="text-blue-600" size={20} />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{pacienteName(h.paciente_id)}</div>
                  <div className="text-xs text-slate-500">{format(parseISO(h.fecha), 'dd/MM/yyyy HH:mm')}</div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Síntomas</div>
                <p className="text-sm text-slate-700">{h.sintomas}</p>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Diagnóstico</div>
                <p className="text-sm text-slate-700 font-medium">{h.diagnostico}</p>
              </div>
            </div>

            {h.tratamiento && (
              <div className="mb-3">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tratamiento</div>
                <p className="text-sm text-slate-700">{h.tratamiento}</p>
              </div>
            )}

            {h.signos_vitales && Object.keys(h.signos_vitales).length > 0 && (
              <div className="mb-3 p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  <Activity size={12} /> Signos vitales
                </div>
                <div className="flex flex-wrap gap-3 text-xs">
                  {Object.entries(h.signos_vitales).map(([k, v]) => (
                    <span key={k} className="text-slate-700">
                      <b className="text-slate-500">{k}:</b> {String(v)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {h.medicamentos && h.medicamentos.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  <Pill size={12} /> Medicamentos recetados
                </div>
                <div className="space-y-1.5">
                  {h.medicamentos.map(m => (
                    <div key={m.id} className="flex items-center gap-2 text-sm p-2 bg-blue-50/60 rounded-lg">
                      <span className="font-semibold text-blue-700">{m.nombre}</span>
                      {m.dosis && <span className="text-slate-600">{m.dosis}</span>}
                      {m.frecuencia && <span className="text-slate-500 text-xs">· {m.frecuencia}</span>}
                      {m.duracion_dias && <span className="text-slate-500 text-xs">· {m.duracion_dias} días</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {h.observaciones && (
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  <FileText size={12} /> Observaciones
                </div>
                <p className="text-xs text-slate-600 italic">{h.observaciones}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistorialMedicoPage;
