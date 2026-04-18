from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import ConsultaTriaje
from app.schemas.triaje import TriajeRequest, TriajeResponse, TriajeOut
from app.services.ai_service import TriajeService, construir_contexto_paciente

router = APIRouter(prefix="/api/triaje", tags=["Triaje IA"])
service = TriajeService()


@router.post("/analizar", response_model=TriajeResponse)
def analizar(req: TriajeRequest, db: Session = Depends(get_db)):
    contexto = ""
    if req.paciente_id:
        contexto = construir_contexto_paciente(db, req.paciente_id)

    data = service.analizar(req.mensaje, contexto)

    registro = ConsultaTriaje(
        paciente_id=req.paciente_id,
        mensaje_usuario=req.mensaje,
        sintomas_detectados=data.get("sintomas_detectados"),
        nivel=data["nivel"],
        resumen=data.get("resumen"),
        accion_sugerida=data.get("accion_sugerida"),
        especialidad_sugerida=data.get("especialidad_sugerida"),
    )
    db.add(registro); db.commit(); db.refresh(registro)

    data["id"] = registro.id
    return data


@router.get("/historial", response_model=List[TriajeOut])
def historial(
    db: Session = Depends(get_db),
    paciente_id: Optional[int] = None,
    limit: int = 50,
):
    q = db.query(ConsultaTriaje)
    if paciente_id:
        q = q.filter(ConsultaTriaje.paciente_id == paciente_id)
    return q.order_by(ConsultaTriaje.fecha_creacion.desc()).limit(limit).all()


@router.get("/{triaje_id}", response_model=TriajeOut)
def obtener(triaje_id: int, db: Session = Depends(get_db)):
    t = db.query(ConsultaTriaje).filter(ConsultaTriaje.id == triaje_id).first()
    if not t:
        raise HTTPException(404, "Triaje no encontrado")
    return t


@router.delete("/{triaje_id}", status_code=204)
def eliminar(triaje_id: int, db: Session = Depends(get_db)):
    t = db.query(ConsultaTriaje).filter(ConsultaTriaje.id == triaje_id).first()
    if not t:
        raise HTTPException(404, "Triaje no encontrado")
    db.delete(t); db.commit()
