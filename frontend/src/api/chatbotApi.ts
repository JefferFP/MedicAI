import axios from 'axios';

const API_URL = 'http://localhost:8000/api/chatbot';

export interface Mensaje {
  id: number;
  rol: 'user' | 'assistant' | 'system';
  contenido: string;
  fecha: string;
}

export interface Conversacion {
  id: number;
  paciente_id: number;
  fecha_inicio: string;
  mensajes: Mensaje[];
}

export const chatbotApi = {
  enviarMensaje: async (mensaje: string, pacienteId: number, conversacionId?: number) => {
    const payload = {
      mensaje,
      paciente_id: pacienteId,
      conversacion_id: conversacionId || null,
    };
    const response = await axios.post(`${API_URL}/mensaje`, payload);
    return response.data;
  },

  obtenerConversacion: async (conversacionId: number): Promise<Conversacion> => {
    const response = await axios.get(`${API_URL}/conversacion/${conversacionId}`);
    return response.data;
  },
  
  listarConversaciones: async (pacienteId: number): Promise<Conversacion[]> => {
    const response = await axios.get(`${API_URL}/conversaciones/${pacienteId}`);
    return response.data;
  }
};
