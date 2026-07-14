"""
LangGraph StateGraph definition.

Flow:
    START -> classify_intent -> route to one of 5 tool nodes -> END

The agent's job: read the rep's free-text chat message, decide which
of the 5 tools applies (log / edit / search / follow-up / summarize),
run it, and return a natural-language reply.
"""
from langgraph.graph import StateGraph, END
from agent.state import AgentState
from agent.tools.log_interaction_tool import log_interaction_tool
from agent.tools.edit_interaction_tool import edit_interaction_tool
from agent.tools.search_hcp_tool import search_hcp_tool
from agent.tools.schedule_followup_tool import schedule_followup_tool
from agent.tools.summarize_notes_tool import summarize_notes_tool

INTENT_PROMPT = """Classify the field rep's message into exactly one intent:
"log", "edit", "search", "followup", or "summarize".

- log: describing a new interaction with a doctor/HCP that should be recorded
- edit: correcting or updating something already logged (mentions an interaction id or "change"/"update")
- search: asking about a HCP's past history/notes
- followup: wants to schedule a reminder / follow-up call
- summarize: pastes long notes and wants a quick summary only (no DB write)

Reply with ONLY the single word intent, nothing else.

Message: "{message}"
"""


def classify_intent_node(state: AgentState) -> AgentState:
    text = state["user_message"].lower().strip()
    intent = "log"
    
    if text.startswith("edit") or text.startswith("update") or text.startswith("change") or text.startswith("correct"):
        intent = "edit"
    elif text.startswith("search") or text.startswith("find") or text.startswith("show history"):
        intent = "search"
    elif text.startswith("add followup") or text.startswith("add follow up") or text.startswith("schedule followup for interaction"):
        intent = "followup"
    elif text.startswith("summarize") or text.startswith("summary of"):
        intent = "summarize"
        
    state["intent"] = intent
    return state


def log_node(state: AgentState) -> AgentState:
    out = log_interaction_tool(state["user_message"], state.get("rep_id"))
    state["reply"] = out["reply"]
    state["interaction_id"] = out.get("interaction_id")
    state["tool_used"] = "log_interaction"
    return state


def edit_node(state: AgentState) -> AgentState:
    # Expect the caller (chat router) to have parsed an interaction_id into state
    interaction_id = state.get("interaction_id")
    if not interaction_id:
        state["reply"] = "Please specify which interaction id you'd like to edit."
        state["tool_used"] = "edit_interaction"
        return state
    out = edit_interaction_tool(interaction_id, new_text=state["user_message"])
    state["reply"] = out["reply"]
    state["tool_used"] = "edit_interaction"
    return state


def search_node(state: AgentState) -> AgentState:
    out = search_hcp_tool(state["user_message"])
    state["reply"] = out["reply"]
    state["tool_used"] = "search_hcp"
    return state


def followup_node(state: AgentState) -> AgentState:
    interaction_id = state.get("interaction_id")
    if not interaction_id:
        state["reply"] = "Please specify which interaction id needs a follow-up date."
        state["tool_used"] = "schedule_followup"
        return state
    # naive date parse placeholder — production version would use an LLM date-parser
    out = schedule_followup_tool(interaction_id, state["user_message"])
    state["reply"] = out["reply"]
    state["tool_used"] = "schedule_followup"
    return state


def summarize_node(state: AgentState) -> AgentState:
    out = summarize_notes_tool(state["user_message"])
    state["reply"] = out["reply"]
    state["tool_used"] = "summarize_notes"
    return state


def route_intent(state: AgentState) -> str:
    return state["intent"]


def build_graph():
    graph = StateGraph(AgentState)

    graph.add_node("classify_intent", classify_intent_node)
    graph.add_node("log", log_node)
    graph.add_node("edit", edit_node)
    graph.add_node("search", search_node)
    graph.add_node("followup", followup_node)
    graph.add_node("summarize", summarize_node)

    graph.set_entry_point("classify_intent")
    graph.add_conditional_edges(
        "classify_intent",
        route_intent,
        {
            "log": "log",
            "edit": "edit",
            "search": "search",
            "followup": "followup",
            "summarize": "summarize",
        },
    )
    graph.add_edge("log", END)
    graph.add_edge("edit", END)
    graph.add_edge("search", END)
    graph.add_edge("followup", END)
    graph.add_edge("summarize", END)

    return graph.compile()


# Compiled once at import time, reused across requests
agent_graph = build_graph()
