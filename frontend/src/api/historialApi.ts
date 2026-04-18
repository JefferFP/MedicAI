import { api } from './client';

export interface Medicamento {
  id: number;
  historial_id: number;
  nombre: string;
  dosis?: string | null;
  frecuencia?: string | null;
  duracion_dias?: number | null;
  indicaciones?: string | null;
}

export interface Historial {
  id: number;
  paciente_id: number;
  medico_id: number;
  cita_id?: number | null;
  fecha: string;
  sintomas: string;
  diagnostico: string;
  tratamiento?: string | null;
  observaciones?: string | null;
  signos_vitales?: Record<string, any> | null;
  medicamentos: Medicamento[];
}

export const listarHistorial = (paciente_id?: number) =>
  api.get<Historial[]>('/historial/', { params: paciente_id ? { paciente_id } : {} });

export const eliminarHistorial = (id: number) => api.delete(`/historial/${id}`);
