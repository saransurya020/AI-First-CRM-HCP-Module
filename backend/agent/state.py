"""
Shared state object passed between LangGraph nodes.
"""
from typing import TypedDict, Optional, List


class AgentState(TypedDict, total=False):
    # conversation
    user_message: str
    session_id: str
    rep_id: Optional[int]
    chat_history: List[dict]          # [{"role": "user"/"assistant", "content": "..."}]

    # routing
    intent: str                        # "log" | "edit" | "search" | "followup" | "summarize"

    # working data (filled in by tools)
    hcp_name: Optional[str]
    interaction_id: Optional[int]
    extracted_summary: Optional[str]
    extracted_topics: Optional[str]
    extracted_sentiment: Optional[str]

    # output
    reply: str
    tool_used: Optional[str]
