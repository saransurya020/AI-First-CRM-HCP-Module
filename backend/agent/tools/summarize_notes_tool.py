"""
Tool 5: Summarize Notes
Given a long free-text transcript (e.g. pasted call notes), returns a
short structured summary — useful right after a call, before formal logging.
"""
import re

def summarize_notes_tool(text: str) -> dict:
    topics = []
    lower_text = text.lower()
    if "trial" in lower_text: topics.append("Clinical Trial details discussed")
    if "safety" in lower_text or "side effect" in lower_text: topics.append("Safety concerns addressed")
    if "price" in lower_text or "discount" in lower_text: topics.append("Pricing options provided")
    
    action_items = []
    if "schedule" in lower_text or "follow up" in lower_text: action_items.append("Follow-up meeting needed")
    if "send" in lower_text or "email" in lower_text: action_items.append("Information to be sent to HCP")
    
    bullets = []
    bullets.append(f"- Topics: {', '.join(topics) if topics else 'General product overview'}")
    
    sentiment = "Positive" if any(w in lower_text for w in ["great", "good", "happy", "interested"]) else "Neutral"
    bullets.append(f"- Stance: {sentiment} reception")
    
    bullets.append(f"- Actions: {', '.join(action_items) if action_items else 'None explicitly noted'}")
    
    return {"reply": "Here is a quick summary of the notes:\n\n" + "\n".join(bullets)}
