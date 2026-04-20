import os
import logging
from dotenv import load_dotenv
from groq import Groq
from sqlalchemy.orm import Session
from app.models import Paciente

load_dotenv()
logger = logging.getLogger("medicai.ai")

API_KEY = os.getenv("CHATBOT_API_KEY")
MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

if not API_KEY:
    logger.error("CHATBOT_API_KEY no encontrada en .env")

client = Groq(api_key=API_KEY) if API_KEY else None

class ChatbotService:
    SYSTEM_PROMPT = (
        "Eres MediBot, un asistente médico de IA conversacional para orientar a pacientes. "
        "NO eres un médico humano y NO puedes dar diagnósticos definitivos. "
        "Tu objetivo es hacer preguntas de seguimiento para entender los síntomas, "
        "ofrecer orientación médica básica y sugerir acciones (ej. acudir a urgencias, tomar reposo). "
        "SIEMPRE debes dejar claro que la información es orientativa y no reemplaza a un profesional.\n\n"
        "REGLAS:\n"
        "1. Revisa la información básica del paciente para personalizar tus respuestas (ej. alergias).\n"
        "2. Mantén la conversación enfocada en la salud y el bienestar.\n"
        "3. Si detectas síntomas graves (emergencia), insta al paciente a buscar atención médica de inmediato.\n"
        "4. Responde con empatía, de forma conversacional, amable y concisa.\n"
        "5. Analiza los mensajes anteriores para mantener el hilo de la conversación."
    )

    def responder(self, historial_mensajes: list[dict], db: Session, paciente_id: int) -> str:
        if not client:
            return "El servicio de IA no está configurado. Por favor contacte soporte."

        # Construir contexto super básico
        contexto_paciente = "Información del paciente no disponible."
        if paciente_id:
            p = db.query(Paciente).filter(Paciente.id == paciente_id).first()
            if p:
                contexto_paciente = (
                    f"Paciente: {p.nombres} {p.apellidos}. "
                    f"Sexo: {p.sexo or 'N/D'}. "
                    f"Alergias: {p.alergias or 'Ninguna'}. "
                    f"Antecedentes: {p.antecedentes or 'Ninguno'}."
                )

        messages = [
            {"role": "system", "content": f"{self.SYSTEM_PROMPT}\n\n=== INFO PACIENTE ===\n{contexto_paciente}"}
        ]
        
        # Añadir el historial de la conversación que viene desde el frontend
        for msg in historial_mensajes[-15:]:
            if msg.get("rol") in ["user", "assistant"]:
                messages.append({"role": msg["rol"], "content": msg["contenido"]})

        try:
            completion = client.chat.completions.create(
                model=MODEL,
                messages=messages,
                temperature=0.6,
                max_tokens=800,
            )
            return completion.choices[0].message.content
        except Exception as e:
            logger.exception(f"Error en servicio Groq Chatbot: {e}")
            return "Lo siento, ha ocurrido un error al comunicarme con el servidor. Inténtelo de nuevo más tarde."
