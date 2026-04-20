from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class MensajeBase(BaseModel):
    rol: str
    contenido: str

class MensajeOut(MensajeBase):
    id: int
    fecha: datetime

    class Config:
        from_attributes = True

class ConversacionBase(BaseModel):
    paciente_id: int

class ConversacionOut(ConversacionBase):
    id: int
    fecha_inicio: datetime
    mensajes: List[MensajeOut] = []

    class Config:
        from_attributes = True

class ChatbotRequest(BaseModel):
    mensaje: str
    paciente_id: int
    conversacion_id: Optional[int] = None

class ChatbotResponse(BaseModel):
    respuesta: str
    conversacion_id: int
    mensaje_id: int
