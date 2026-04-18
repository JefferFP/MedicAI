import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { AlertTriangle, AlertCircle, CheckCircle2, Trash2, RefreshCw, Filter } from 'lucide-react';
import { getHistorialTriaje, deleteTriaje, type TriajeRecord } from '../../api/triageApi';
import { listarPacientes, type Paciente } from '../../api/pacientesApi';

const nivelMeta = (n: string) =>
  n === 'EMERGENCIA' ? { icon: AlertTriangle, cls: 'bg-rose-50 border-l-rose-500 text-rose-700' } :
  n === 'URGENCIA'   ? { icon: AlertCircle,   cls: 'bg-amber-50 border-l-amber-500 text-amber-700' } :
                       { icon: CheckCircle2,  cls: 'bg-emerald-50 border-l-emerald-500 text-emerald-700' };

const HistorialTriajePage = () => {
  const [items, setItems] = useState<TriajeRecord[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pacienteId, setPacienteId] = useState<number | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargar = async () => {
    setLoading(true); setError('');
    try {
      const { data } = await getHistorialTriaje(pacienteId || undefined);
      setItems(data);
    } catch { setError('No se pudo cargar el historial. ¿Backend activo?'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    listarPacientes().then(r => setPacientes(r.data)).catch(() => {});
    cargar();
  }, []);

  useEffect(() => { cargar(); }, [pacienteId]);

  const borrar = async (id: number) => {
    if (!confirm('¿Eliminar este registro?')) return;
    await deleteTriaje(id); cargar();
  };

  const pacienteName = (id: number | null) => {
    if (!id) return 'Anónimo';
    const p = pacientes.find(x => x.id === id);
    return p ? `${p.nombres} ${p.apellidos}` : `#${id}`;
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
            <option value="">Todos los triajes</option>
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
        <div className="text-center text-slate-400 py-16 text-sm">Sin registros</div>
      )}

      <div className="space-y-3">
        {items.map(t => {
          const { icon: Icon, cls } = nivelMeta(t.nivel);
          return (
            <div key={t.id} className={`p-5 rounded-2xl border-l-4 shadow-sm ${cls}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <Icon size={20} className="shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider">{t.nivel}</span>
                      <span className="text-[10px] opacity-60">·</span>
                      <span className="text-xs opacity-70">{format(parseISO(t.fecha_creacion), 'dd/MM/yyyy HH:mm')}</span>
                      <span className="text-[10px] opacity-60">·</span>
                      <span className="text-xs font-semibold opacity-80">{pacienteName(t.paciente_id)}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-800 mb-1">"{t.mensaje_usuario}"</p>
                    {t.resumen && <p className="text-sm text-slate-700">{t.resumen}</p>}
                    {t.accion_sugerida && (
                      <p className="text-xs mt-2 opacity-80"><b>Acción:</b> {t.accion_sugerida}</p>
                    )}
                    {t.especialidad_sugerida && (
                      <p className="text-xs opacity-70"><b>Especialidad:</b> {t.especialidad_sugerida}</p>
                    )}
                  </div>
                </div>
                <button onClick={() => borrar(t.id)} className="p-2 hover:bg-white/50 rounded-lg transition shrink-0">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistorialTriajePage;
