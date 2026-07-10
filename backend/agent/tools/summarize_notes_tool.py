"""
Tool 5: Summarize Notes
Given a long free-text transcript (e.g. pasted call notes), returns a
short structured summary — useful right after a call, before formal logging.
"""
from agent.llm import llm_context

SUMMARY_PROMPT = """Summarize the following field-rep call notes into 3 short
bullet points covering: key discussion topics, HCP's stance/sentiment,
and any action items. Be concise.

Notes:
\"\"\"{text}\"\"\"
"""


def summarize_notes_tool(text: str) -> dict:
    prompt = SUMMARY_PROMPT.format(text=text)
    response = llm_context.invoke(prompt)
    return {"reply": response.content.strip()}
