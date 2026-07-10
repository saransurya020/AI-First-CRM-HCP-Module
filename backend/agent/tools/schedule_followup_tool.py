"""
Tool 4: Schedule Follow-up
Sets/updates a follow_up_date on an existing interaction so reps get
reminded to reconnect with an HCP.
"""
from database.db import SessionLocal
from database.models import Interaction
from datetime import datetime


def schedule_followup_tool(interaction_id: int, follow_up_date: str) -> dict:
    """follow_up_date expected as ISO string, e.g. '2026-08-01'"""
    db = SessionLocal()
    try:
        interaction = db.query(Interaction).filter(Interaction.id == interaction_id).first()
        if not interaction:
            return {"reply": f"No interaction found with id {interaction_id}."}

        interaction.follow_up_date = datetime.fromisoformat(follow_up_date)
        db.commit()

        return {"reply": f"Follow-up for interaction {interaction_id} scheduled on {follow_up_date}."}
    finally:
        db.close()
