"""
Tool 3: Search HCP
Finds an HCP by name/specialty and returns their interaction history.
Useful for reps who want context before a call ("what did we last discuss?").
"""
from database.db import SessionLocal
from database.models import HCP, Interaction


def search_hcp_tool(query: str) -> dict:
    db = SessionLocal()
    try:
        hcp = (
            db.query(HCP)
            .filter(HCP.name.ilike(f"%{query}%"))
            .first()
        )
        if not hcp:
            return {"reply": f"No HCP found matching '{query}'."}

        history = (
            db.query(Interaction)
            .filter(Interaction.hcp_id == hcp.id)
            .order_by(Interaction.date.desc())
            .limit(5)
            .all()
        )
        summary_lines = [
            f"- {i.date.strftime('%Y-%m-%d')}: {i.summary}" for i in history
        ] or ["No past interactions logged."]

        return {
            "reply": f"HCP: {hcp.name} ({hcp.specialty or 'specialty unknown'})\n"
                     f"Recent interactions:\n" + "\n".join(summary_lines)
        }
    finally:
        db.close()
