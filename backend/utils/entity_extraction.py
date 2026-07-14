import re

def extract_entities(text: str) -> dict:
    hcp_match = re.search(r'(Dr\.\s+[a-zA-Z]+|Doctor\s+[a-zA-Z]+|[a-zA-Z]+\s+Clinic|Prof\.\s+[a-zA-Z]+)', text, re.IGNORECASE)
    hcp_name = hcp_match.group(1).title() if hcp_match else "Unknown HCP"
    
    lower_text = text.lower()
    if any(word in lower_text for word in ["positive", "great", "excellent", "good", "happy", "interested", "success", "agreed"]):
        sentiment = "positive"
    elif any(word in lower_text for word in ["negative", "bad", "angry", "upset", "poor", "issue", "problem", "disagreed"]):
        sentiment = "negative"
    else:
        sentiment = "neutral"
        
    topics = []
    if "trial" in lower_text or "dosage" in lower_text or "efficacy" in lower_text: topics.append("Clinical Trials")
    if "price" in lower_text or "cost" in lower_text or "discount" in lower_text: topics.append("Pricing")
    if "side effect" in lower_text or "safety" in lower_text: topics.append("Safety")
    if "brochure" in lower_text or "samples" in lower_text or "inventory" in lower_text: topics.append("Materials")
    if "product" in lower_text or "prodo" in lower_text: topics.append("Product Information")

    # Extract follow-up actions (avoid splitting by '.' to protect 'Dr.')
    sentences = re.split(r'[\n|;]', text)
    follow_ups = []
    summary_sentences = []
    for s in sentences:
        s = s.strip()
        if not s: continue
        lower_s = s.lower()
        if any(keyword in lower_s for keyword in ["follow up", "follow-up", "schedule", "remind", "next meeting"]):
            follow_ups.append(f"- {s}")
        else:
            summary_sentences.append(s)
            
    follow_up_date = "\n".join(follow_ups) if follow_ups else None
    
    if summary_sentences:
        summary = ". ".join(summary_sentences) + "."
    else:
        summary = "Follow-up scheduled." if follow_ups else text[:200]
    # Extract explicit dates and times if provided
    date_match = re.search(r'\b(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})\b', text)
    if date_match:
        m, d, y = date_match.groups()
        if len(y) == 2: y = "20" + y
        interaction_date = f"{y}-{m.zfill(2)}-{d.zfill(2)}"
    else:
        interaction_date = None
    
    time_match = re.search(r'\b(\d{1,2}:\d{2})\s*(?:AM|PM|am|pm)?\b', text, re.IGNORECASE)
    interaction_time = time_match.group(1) if time_match else None
    
    return {
        "hcp_name": hcp_name,
        "summary": summary, 
        "topics_discussed": ", ".join(topics) if topics else "General Discussion",
        "sentiment": sentiment,
        "follow_up_date": follow_up_date,
        "interaction_date": interaction_date,
        "interaction_time": interaction_time
    }
