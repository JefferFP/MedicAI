import { api } from './client';

export interface TriajeResult {
  id?: number;
  nivel: 'EMERGENCIA' | 'URGENCIA' | 'ESTABLE';
  resumen: string;
  accion_sugerida: string;
  especialidad_sugerida?: string | null;
  sintomas_detectados?: string[];
}

export interface TriajeRecord extends TriajeResult {
  id: number;
  paciente_id: number | null;
  mensaje_usuario: string;
  fecha_creacion: string;
}

export const analizarSintomas = (mensaje: string, paciente_id?: number) =>
  api.post<TriajeResult>('/triaje/analizar', { mensaje, paciente_id });

export const getHistorialTriaje = (paciente_id?: number) =>
  api.get<TriajeRecord[]>('/triaje/historial', { params: { paciente_id } });

export const deleteTriaje = (id: number) => api.delete(`/triaje/${id}`);
