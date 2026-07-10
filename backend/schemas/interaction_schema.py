"""
Pydantic request/response schemas for the Interaction API.
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class HCPBase(BaseModel):
    name: str
    specialty: Optional[str] = None
    hospital: Optional[str] = None
    contact_info: Optional[str] = None


class HCPOut(HCPBase):
    id: int

    class Config:
        from_attributes = True


class InteractionCreate(BaseModel):
    hcp_name: str                       # looked up / created if not found
    rep_id: Optional[int] = None
    mode: str = "form"                  # "form" or "chat"
    summary: Optional[str] = None
    topics_discussed: Optional[str] = None
    sentiment: Optional[str] = None
    follow_up_date: Optional[str] = None
    raw_transcript: Optional[str] = None
    interaction_type: Optional[str] = "Meeting"
    interaction_date: Optional[str] = None
    interaction_time: Optional[str] = None
    attendees: Optional[str] = None
    materials_shared: Optional[str] = None
    samples_distributed: Optional[str] = None

class InteractionUpdate(BaseModel):
    summary: Optional[str] = None
    topics_discussed: Optional[str] = None
    sentiment: Optional[str] = None
    follow_up_date: Optional[str] = None
    interaction_type: Optional[str] = None
    interaction_date: Optional[str] = None
    interaction_time: Optional[str] = None
    attendees: Optional[str] = None
    materials_shared: Optional[str] = None
    samples_distributed: Optional[str] = None
    hcp_name: Optional[str] = None

class InteractionOut(BaseModel):
    id: int
    hcp_id: int
    rep_id: Optional[int]
    date: datetime
    mode: str
    summary: Optional[str]
    topics_discussed: Optional[str]
    sentiment: Optional[str]
    follow_up_date: Optional[str]
    raw_transcript: Optional[str]
    interaction_type: Optional[str]
    interaction_date: Optional[str]
    interaction_time: Optional[str]
    attendees: Optional[str]
    materials_shared: Optional[str]
    samples_distributed: Optional[str]
    hcp_name: Optional[str]

    class Config:
        from_attributes = True


class ChatRequest(BaseModel):
    message: str
    rep_id: Optional[int] = None
    session_id: Optional[str] = "default"


class ChatResponse(BaseModel):
    reply: str
    tool_used: Optional[str] = None
    interaction_id: Optional[int] = None
