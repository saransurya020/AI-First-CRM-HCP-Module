"""
Chat endpoint — the conversational path for the Log Interaction Screen.
Invokes the compiled LangGraph agent for each message.
"""
from fastapi import APIRouter
from schemas.interaction_schema import ChatRequest, ChatResponse
from agent.graph import agent_graph

router = APIRouter(prefix="/chat", tags=["chat"])

# very simple in-memory session store — swap for Redis in production
_sessions: dict[str, list[dict]] = {}


@router.post("/", response_model=ChatResponse)
def chat(payload: ChatRequest):
    history = _sessions.setdefault(payload.session_id, [])
    history.append({"role": "user", "content": payload.message})

    result = agent_graph.invoke({
        "user_message": payload.message,
        "session_id": payload.session_id,
        "rep_id": payload.rep_id,
        "chat_history": history,
    })

    history.append({"role": "assistant", "content": result["reply"]})

    return ChatResponse(
        reply=result["reply"],
        tool_used=result.get("tool_used"),
        interaction_id=result.get("interaction_id"),
    )
