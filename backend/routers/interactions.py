"""
CRUD endpoints for the structured-form path (non-chat logging/editing).
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.db import get_db
from database.models import HCP, Interaction
from schemas.interaction_schema import InteractionCreate, InteractionUpdate, InteractionOut

router = APIRouter(prefix="/interactions", tags=["interactions"])


@router.post("/", response_model=InteractionOut)
def create_interaction(payload: InteractionCreate, db: Session = Depends(get_db)):
    hcp = db.query(HCP).filter(HCP.name == payload.hcp_name).first()
    if not hcp:
        hcp = HCP(name=payload.hcp_name)
        db.add(hcp)
        db.commit()
        db.refresh(hcp)

    interaction = Interaction(
        hcp_id=hcp.id,
        rep_id=payload.rep_id,
        mode=payload.mode,
        summary=payload.summary,
        topics_discussed=payload.topics_discussed,
        sentiment=payload.sentiment,
        follow_up_date=payload.follow_up_date,
        raw_transcript=payload.raw_transcript,
    )
    db.add(interaction)
    db.commit()
    db.refresh(interaction)
    return interaction


@router.get("/", response_model=list[InteractionOut])
def list_interactions(db: Session = Depends(get_db)):
    return db.query(Interaction).order_by(Interaction.date.desc()).all()


@router.get("/{interaction_id}", response_model=InteractionOut)
def get_interaction(interaction_id: int, db: Session = Depends(get_db)):
    interaction = db.query(Interaction).filter(Interaction.id == interaction_id).first()
    if not interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")
    return interaction


@router.put("/{interaction_id}", response_model=InteractionOut)
def update_interaction(interaction_id: int, payload: InteractionUpdate, db: Session = Depends(get_db)):
    interaction = db.query(Interaction).filter(Interaction.id == interaction_id).first()
    if not interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")

    for field, value in payload.dict(exclude_unset=True).items():
        setattr(interaction, field, value)

    db.commit()
    db.refresh(interaction)
    return interaction


@router.delete("/{interaction_id}")
def delete_interaction(interaction_id: int, db: Session = Depends(get_db)):
    interaction = db.query(Interaction).filter(Interaction.id == interaction_id).first()
    if not interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")
    db.delete(interaction)
    db.commit()
    return {"detail": "deleted"}
