"""
Tool 1 (MANDATORY): Log Interaction
Captures a free-text interaction (from chat), runs LLM entity extraction
+ summarization, and persists it as a new Interaction row.
"""
from database.db import SessionLocal
from database.models import HCP, Interaction
from utils.entity_extraction import extract_entities
from datetime import datetime


def log_interaction_tool(text: str, rep_id: int | None = None) -> dict:
    entities = extract_entities(text)
    db = SessionLocal()
    try:
        hcp_name = entities.get("hcp_name") or "Unknown HCP"
        hcp = db.query(HCP).filter(HCP.name == hcp_name).first()
        if not hcp:
            hcp = HCP(name=hcp_name)
            db.add(hcp)
            db.commit()
            db.refresh(hcp)

        interaction = Interaction(
            hcp_id=hcp.id,
            rep_id=rep_id,
            mode="chat",
            summary=entities.get("summary"),
            topics_discussed=entities.get("topics_discussed"),
            sentiment=entities.get("sentiment"),
            raw_transcript=text,
            date=datetime.utcnow(),
        )
        db.add(interaction)
        db.commit()
        db.refresh(interaction)

        return {
            "interaction_id": interaction.id,
            "reply": f"Logged interaction with {hcp_name}. Summary: {entities.get('summary')}",
        }
    finally:
        db.close()
