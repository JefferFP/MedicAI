import { api } from './client';

export interface Paciente {
  id: number;
  dni: string;
  nombres: string;
  apellidos: string;
  fecha_nacimiento?: string | null;
  sexo?: 'M' | 'F' | 'O' | null;
  telefono?: string | null;
  email?: string | null;
  direccion?: string | null;
  tipo_sangre?: string | null;
  alergias?: string | null;
  antecedentes?: string | null;
  medicamentos_actuales?: string | null;
  activo: boolean;
  fecha_registro: string;
}

export type PacienteCreate = Omit<Paciente, 'id' | 'activo' | 'fecha_registro'>;
export type PacienteUpdate = Partial<PacienteCreate>;

export const listarPacientes = (q?: string) =>
  api.get<Paciente[]>('/pacientes/', { params: q ? { q } : {} });

export const getPaciente = (id: number) =>
  api.get<Paciente>(`/pacientes/${id}`);

export const crearPaciente = (data: PacienteCreate) =>
  api.post<Paciente>('/pacientes/', data);

export const actualizarPaciente = (id: number, data: PacienteUpdate) =>
  api.put<Paciente>(`/pacientes/${id}`, data);

export const eliminarPaciente = (id: number) =>
  api.delete(`/pacientes/${id}`);
