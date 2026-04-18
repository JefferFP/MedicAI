import { api } from './client';

export interface Medico {
  id: number;
  usuario_id: number;
  cmp: string;
  especialidad: string;
  telefono?: string | null;
  horario?: string | null;
}

export const listarMedicos = () => api.get<Medico[]>('/medicos/');
