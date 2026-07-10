"""
Tool 2 (MANDATORY): Edit Interaction
Allows modification of an already-logged interaction. If new free text is
supplied, the LLM re-extracts/re-summarizes before saving the update.
"""
from database.db import SessionLocal
from database.models import Interaction
from utils.entity_extraction import extract_entities


def edit_interaction_tool(interaction_id: int, new_text: str | None = None,
                           fields: dict | None = None) -> dict:
    db = SessionLocal()
    try:
        interaction = db.query(Interaction).filter(Interaction.id == interaction_id).first()
        if not interaction:
            return {"reply": f"No interaction found with id {interaction_id}."}

        if new_text:
            entities = extract_entities(new_text)
            interaction.summary = entities.get("summary", interaction.summary)
            interaction.topics_discussed = entities.get("topics_discussed", interaction.topics_discussed)
            interaction.sentiment = entities.get("sentiment", interaction.sentiment)
            interaction.raw_transcript = new_text

        if fields:
            for key, value in fields.items():
                if hasattr(interaction, key):
                    setattr(interaction, key, value)

        db.commit()
        db.refresh(interaction)

        return {
            "interaction_id": interaction.id,
            "reply": f"Interaction {interaction_id} updated. New summary: {interaction.summary}",
        }
    finally:
        db.close()
