import { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, AlertCircle, UserCircle2 } from 'lucide-react';
import {
  listarPacientes, crearPaciente, actualizarPaciente, eliminarPaciente,
  type Paciente, type PacienteCreate,
} from '../../api/pacientesApi';

const emptyForm: PacienteCreate = {
  dni: '', nombres: '', apellidos: '',
  fecha_nacimiento: null, sexo: null, telefono: '', email: '',
  direccion: '', tipo_sangre: '', alergias: '', antecedentes: '',
  medicamentos_actuales: '',
};

const PacientesPage = () => {
  const [items, setItems] = useState<Paciente[]>([]);
  const [q, setQ] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Paciente | null>(null);
  const [form, setForm] = useState<PacienteCreate>(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const cargar = async () => {
    try {
      const { data } = await listarPacientes(q || undefined);
      setItems(data);
      setError('');
    } catch {
      setError('Error al cargar pacientes. Verifica el backend.');
    }
  };

  useEffect(() => { cargar(); }, []);

  const abrirCrear = () => { setEditing(null); setForm(emptyForm); setError(''); setShowModal(true); };
  const abrirEditar = (p: Paciente) => {
    setEditing(p);
    setForm({
      dni: p.dni, nombres: p.nombres, apellidos: p.apellidos,
      fecha_nacimiento: p.fecha_nacimiento, sexo: p.sexo,
      telefono: p.telefono || '', email: p.email || '',
      direccion: p.direccion || '', tipo_sangre: p.tipo_sangre || '',
      alergias: p.alergias || '', antecedentes: p.antecedentes || '',
      medicamentos_actuales: p.medicamentos_actuales || '',
    });
    setError(''); setShowModal(true);
  };

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const payload: any = { ...form };
      if (!payload.fecha_nacimiento) delete payload.fecha_nacimiento;
      if (!payload.email) delete payload.email;
      if (editing) await actualizarPaciente(editing.id, payload);
      else await crearPaciente(payload);
      setShowModal(false);
      await cargar();
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Error al guardar');
    } finally { setLoading(false); }
  };

  const borrar = async (id: number) => {
    if (!confirm('¿Eliminar paciente?')) return;
    await eliminarPaciente(id);
    cargar();
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Barra de acciones */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            className="w-full bg-white rounded-2xl py-3 pl-12 pr-4 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-100 text-sm font-medium"
            placeholder="Buscar por DNI, nombre o apellido..."
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && cargar()}
          />
        </div>
        <button onClick={cargar} className="px-5 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-medium hover:bg-slate-50 transition">
          Buscar
        </button>
        <button onClick={abrirCrear} className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-2xl hover:bg-slate-800 transition text-sm font-medium">
          <Plus size={18} /> Nuevo paciente
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 p-3 bg-rose-50 text-rose-600 rounded-xl text-sm">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="text-left px-5 py-3 font-semibold">Paciente</th>
              <th className="text-left px-5 py-3 font-semibold">DNI</th>
              <th className="text-left px-5 py-3 font-semibold">Teléfono</th>
              <th className="text-left px-5 py-3 font-semibold">Sangre</th>
              <th className="text-left px-5 py-3 font-semibold">Alergias</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {items.map(p => (
              <tr key={p.id} className="border-t border-slate-50 hover:bg-slate-50/50 transition">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                      <UserCircle2 className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">{p.nombres} {p.apellidos}</div>
                      {p.email && <div className="text-xs text-slate-500">{p.email}</div>}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 font-mono text-sm text-slate-600">{p.dni}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{p.telefono || '—'}</td>
                <td className="px-5 py-4 text-sm">
                  {p.tipo_sangre ? (
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded-md text-xs font-bold">{p.tipo_sangre}</span>
                  ) : '—'}
                </td>
                <td className="px-5 py-4 text-sm text-slate-600 max-w-xs truncate">{p.alergias || '—'}</td>
                <td className="px-5 py-4 flex gap-1 justify-end">
                  <button onClick={() => abrirEditar(p)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition"><Edit2 size={15} /></button>
                  <button onClick={() => borrar(p.id)} className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={6} className="text-center text-slate-400 py-12 text-sm">Sin pacientes registrados</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{editing ? 'Editar' : 'Nuevo'} paciente</h3>
                <p className="text-xs text-slate-500 mt-1">Los campos marcados con * son obligatorios</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-full transition"><X size={20} /></button>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 p-3 bg-rose-50 text-rose-600 rounded-xl text-sm">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <form onSubmit={guardar} className="grid grid-cols-2 gap-3">
              <input required placeholder="DNI *" className="col-span-1 bg-slate-50 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-100 text-sm" value={form.dni} onChange={e => setForm({ ...form, dni: e.target.value })} disabled={!!editing} />
              <select className="col-span-1 bg-slate-50 rounded-xl py-3 px-4 outline-none text-sm" value={form.sexo || ''} onChange={e => setForm({ ...form, sexo: (e.target.value || null) as any })}>
                <option value="">Sexo</option><option value="M">Masculino</option><option value="F">Femenino</option><option value="O">Otro</option>
              </select>
              <input required placeholder="Nombres *" className="col-span-1 bg-slate-50 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-100 text-sm" value={form.nombres} onChange={e => setForm({ ...form, nombres: e.target.value })} />
              <input required placeholder="Apellidos *" className="col-span-1 bg-slate-50 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-100 text-sm" value={form.apellidos} onChange={e => setForm({ ...form, apellidos: e.target.value })} />
              <input type="date" className="col-span-1 bg-slate-50 rounded-xl py-3 px-4 outline-none text-sm" value={form.fecha_nacimiento || ''} onChange={e => setForm({ ...form, fecha_nacimiento: e.target.value || null })} />
              <input placeholder="Tipo sangre (O+, A-, ...)" className="col-span-1 bg-slate-50 rounded-xl py-3 px-4 outline-none text-sm" value={form.tipo_sangre || ''} onChange={e => setForm({ ...form, tipo_sangre: e.target.value })} />
              <input placeholder="Teléfono" className="col-span-1 bg-slate-50 rounded-xl py-3 px-4 outline-none text-sm" value={form.telefono || ''} onChange={e => setForm({ ...form, telefono: e.target.value })} />
              <input type="email" placeholder="Email" className="col-span-1 bg-slate-50 rounded-xl py-3 px-4 outline-none text-sm" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} />
              <input placeholder="Dirección" className="col-span-2 bg-slate-50 rounded-xl py-3 px-4 outline-none text-sm" value={form.direccion || ''} onChange={e => setForm({ ...form, direccion: e.target.value })} />
              <textarea placeholder="Alergias" className="col-span-2 bg-slate-50 rounded-xl py-3 px-4 outline-none text-sm resize-none" rows={2} value={form.alergias || ''} onChange={e => setForm({ ...form, alergias: e.target.value })} />
              <textarea placeholder="Antecedentes médicos (relevante para la IA)" className="col-span-2 bg-slate-50 rounded-xl py-3 px-4 outline-none text-sm resize-none" rows={2} value={form.antecedentes || ''} onChange={e => setForm({ ...form, antecedentes: e.target.value })} />
              <textarea placeholder="Medicamentos actuales" className="col-span-2 bg-slate-50 rounded-xl py-3 px-4 outline-none text-sm resize-none" rows={2} value={form.medicamentos_actuales || ''} onChange={e => setForm({ ...form, medicamentos_actuales: e.target.value })} />

              <button type="submit" disabled={loading} className="col-span-2 bg-slate-900 text-white py-3.5 rounded-2xl font-semibold text-sm hover:bg-slate-800 disabled:opacity-60 transition mt-2">
                {loading ? 'Guardando...' : (editing ? 'Actualizar paciente' : 'Crear paciente')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PacientesPage;
