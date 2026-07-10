import sys
from agent.graph import agent_graph

try:
    result = agent_graph.invoke({
        "user_message": "Schedule a follow up with Dr. Smith next week",
        "session_id": "default",
        "rep_id": None,
        "chat_history": [],
    })
    print(result)
except Exception as e:
    import traceback
    traceback.print_exc()
