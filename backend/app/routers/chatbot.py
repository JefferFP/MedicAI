from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import Conversacion, Mensaje
from app.schemas.chatbot import ChatbotRequest, ChatbotResponse, ConversacionOut
from app.services.ai_service import ChatbotService

router = APIRouter(prefix="/api/chatbot", tags=["Chatbot IA"])
service = ChatbotService()

@router.post("/mensaje", response_model=ChatbotResponse)
def enviar_mensaje(req: ChatbotRequest, db: Session = Depends(get_db)):
    # 1. Obtener o crear la conversación
    conversacion = None
    if req.conversacion_id:
        conversacion = db.query(Conversacion).filter(Conversacion.id == req.conversacion_id).first()
        if not conversacion:
            raise HTTPException(404, "Conversación no encontrada")
    else:
        conversacion = Conversacion(paciente_id=req.paciente_id)
        db.add(conversacion)
        db.commit()
        db.refresh(conversacion)

    # 2. Guardar el mensaje del usuario
    msg_user = Mensaje(conversacion_id=conversacion.id, rol="user", contenido=req.mensaje)
    db.add(msg_user)
    db.commit()

    # 3. Recuperar el historial reciente de esta conversación para la IA
    historial_db = db.query(Mensaje).filter(
        Mensaje.conversacion_id == conversacion.id
    ).order_by(Mensaje.fecha.asc()).all()
    
    historial_dicts = [{"rol": m.rol, "contenido": m.contenido} for m in historial_db]

    # 4. Obtener la respuesta de la IA
    respuesta_ia = service.responder(historial_dicts, db, req.paciente_id)

    # 5. Guardar la respuesta de la IA
    msg_ia = Mensaje(conversacion_id=conversacion.id, rol="assistant", contenido=respuesta_ia)
    db.add(msg_ia)
    db.commit()
    db.refresh(msg_ia)

    # 6. Devolver la respuesta junto con el ID de la conversación
    return ChatbotResponse(
        respuesta=respuesta_ia,
        conversacion_id=conversacion.id,
        mensaje_id=msg_ia.id
    )

@router.get("/conversaciones/{paciente_id}", response_model=List[ConversacionOut])
def listar_conversaciones(paciente_id: int, db: Session = Depends(get_db)):
    return db.query(Conversacion).filter(
        Conversacion.paciente_id == paciente_id
    ).order_by(Conversacion.fecha_inicio.desc()).all()

@router.get("/conversacion/{conversacion_id}", response_model=ConversacionOut)
def obtener_conversacion(conversacion_id: int, db: Session = Depends(get_db)):
    conversacion = db.query(Conversacion).filter(
        Conversacion.id == conversacion_id
    ).first()
    if not conversacion:
        raise HTTPException(404, "Conversación no encontrada")
    return conversacion
