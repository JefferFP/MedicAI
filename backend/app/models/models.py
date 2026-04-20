from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Date, DateTime, Enum, Boolean, ForeignKey
)
from sqlalchemy.orm import relationship
from app.core.database import Base


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(150), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    nombre = Column(String(150), nullable=False)
    rol = Column(Enum("admin", "recepcion"), nullable=False)
    activo = Column(Boolean, default=True, nullable=False)
    fecha_registro = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class Paciente(Base):
    __tablename__ = "pacientes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    dni = Column(String(20), unique=True, nullable=False, index=True)
    nombres = Column(String(100), nullable=False)
    apellidos = Column(String(100), nullable=False, index=True)
    fecha_nacimiento = Column(Date)
    sexo = Column(Enum("M", "F", "O"))
    telefono = Column(String(20))
    email = Column(String(150))
    direccion = Column(Text)
    tipo_sangre = Column(String(5))
    alergias = Column(Text)
    antecedentes = Column(Text)
    medicamentos_actuales = Column(Text)
    fecha_registro = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    activo = Column(Boolean, default=True, nullable=False)


class Conversacion(Base):
    __tablename__ = "conversaciones"

    id = Column(Integer, primary_key=True, autoincrement=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id", ondelete="CASCADE"), nullable=False, index=True)
    fecha_inicio = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    paciente = relationship("Paciente")
    mensajes = relationship("Mensaje", back_populates="conversacion", cascade="all, delete-orphan", order_by="Mensaje.fecha")


class Mensaje(Base):
    __tablename__ = "mensajes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    conversacion_id = Column(Integer, ForeignKey("conversaciones.id", ondelete="CASCADE"), nullable=False, index=True)
    rol = Column(Enum("user", "assistant", "system"), nullable=False)
    contenido = Column(Text, nullable=False)
    fecha = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    conversacion = relationship("Conversacion", back_populates="mensajes")

