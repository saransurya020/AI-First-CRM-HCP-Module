"""
Groq LLM client setup — used by every LangGraph tool for
summarization, entity extraction, and intent classification.
"""
from langchain_groq import ChatGroq
from config import GROQ_API_KEY, GROQ_MODEL_PRIMARY, GROQ_MODEL_CONTEXT

# Primary model — fast, used for most tool calls (gemma2-9b-it, per assignment spec)
llm_primary = ChatGroq(
    api_key=GROQ_API_KEY,
    model=GROQ_MODEL_PRIMARY,
    temperature=0.2,
)

# Larger context model — used when longer transcripts need summarizing
llm_context = ChatGroq(
    api_key=GROQ_API_KEY,
    model=GROQ_MODEL_CONTEXT,
    temperature=0.2,
)
