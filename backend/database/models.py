"""
ORM models: HCP (Healthcare Professional), User (field rep), Interaction.
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database.db import Base


class HCP(Base):
    __tablename__ = "hcps"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    specialty = Column(String(255))
    hospital = Column(String(255))
    contact_info = Column(String(255))

    interactions = relationship("Interaction", back_populates="hcp")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    role = Column(String(100), default="field_rep")

    interactions = relationship("Interaction", back_populates="rep")


class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    hcp_id = Column(Integer, ForeignKey("hcps.id"), nullable=False)
    rep_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    date = Column(DateTime, default=datetime.utcnow)
    mode = Column(String(20), default="form")          # "form" or "chat"
    summary = Column(Text)
    topics_discussed = Column(Text)                     # comma-separated or JSON string
    sentiment = Column(String(50))                      # positive / neutral / negative
    follow_up_date = Column(DateTime, nullable=True)
    raw_transcript = Column(Text, nullable=True)         # full chat transcript, if mode == "chat"

    hcp = relationship("HCP", back_populates="interactions")
    rep = relationship("User", back_populates="interactions")
