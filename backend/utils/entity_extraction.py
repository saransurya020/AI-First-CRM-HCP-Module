"""
Helper: uses the LLM to pull structured fields out of free-text
(chat message or call transcript) — HCP name, topics, sentiment, summary.
"""
import json
from agent.llm import llm_primary

EXTRACTION_PROMPT = """You are a data-extraction assistant for a pharma CRM.
From the text below, extract these fields as strict JSON only (no prose):

{{
  "hcp_name": "<name of the healthcare professional mentioned, or null>",
  "summary": "<1-2 sentence summary of what was discussed>",
  "topics_discussed": "<comma-separated key topics>",
  "sentiment": "<positive | neutral | negative>"
}}

Text:
\"\"\"{text}\"\"\"
"""


def extract_entities(text: str) -> dict:
    prompt = EXTRACTION_PROMPT.format(text=text)
    response = llm_primary.invoke(prompt)
    raw = response.content.strip()

    # Models sometimes wrap JSON in ```json fences — strip them defensively.
    if raw.startswith("```"):
        raw = raw.strip("`")
        raw = raw.replace("json\n", "", 1)

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        # Fallback so the pipeline never hard-crashes on a malformed LLM reply
        return {
            "hcp_name": None,
            "summary": text[:200],
            "topics_discussed": "",
            "sentiment": "neutral",
        }
