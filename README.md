# AI-First CRM — HCP Module (Log Interaction Screen)

An AI-first CRM tool for pharma field representatives to log interactions
with Healthcare Professionals (HCPs) via a **structured form** or a
**conversational chat interface** powered by a **LangGraph** agent.

## Architecture

```
frontend/   React + Redux (Toolkit)  — UI, structured form, chat window
backend/    Python + FastAPI         — REST API, DB, LangGraph agent
```

- **Frontend**: React (Redux Toolkit for state), Google Inter font.
- **Backend**: FastAPI + SQLAlchemy (MySQL/Postgres, defaults to SQLite for
  local dev so it runs with zero external setup).
- **AI Agent**: LangGraph `StateGraph` — classifies the rep's chat message
  into one of 5 intents, then routes to the matching tool.
- **LLM**: Groq — `gemma2-9b-it` (primary), `llama-3.3-70b-versatile`
  (used for longer-context summarization).

## LangGraph Agent & Tools

The agent (`backend/agent/graph.py`) is a simple router graph:

```
START → classify_intent → { log | edit | search | followup | summarize } → END
```

| Tool | File | Purpose |
|---|---|---|
| **Log Interaction** (mandatory) | `agent/tools/log_interaction_tool.py` | Extracts HCP name, summary, topics, sentiment from free text via LLM, creates a new `Interaction` row |
| **Edit Interaction** (mandatory) | `agent/tools/edit_interaction_tool.py` | Re-extracts fields from new text and updates an existing `Interaction` row |
| Search HCP | `agent/tools/search_hcp_tool.py` | Looks up an HCP and returns recent interaction history |
| Schedule Follow-up | `agent/tools/schedule_followup_tool.py` | Sets a `follow_up_date` reminder on an interaction |
| Summarize Notes | `agent/tools/summarize_notes_tool.py` | One-shot LLM summary of pasted call notes (no DB write) |

## Database Schema

- `HCP` — id, name, specialty, hospital, contact_info
- `User` — id, name, role (the field rep)
- `Interaction` — id, hcp_id, rep_id, date, mode (form/chat), summary,
  topics_discussed, sentiment, follow_up_date, raw_transcript

## Running Locally

### 1. Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # then fill in your GROQ_API_KEY
uvicorn main:app --reload
```
Backend runs at `http://localhost:8000` (docs at `/docs`).

### 2. Frontend

```bash
cd frontend
npm install
npm start
```
Frontend runs at `http://localhost:3000`.

### 3. Try it

- **Structured Form** tab: fill in HCP name, topics, summary, sentiment, save.
- **Chat with AI** tab: type something like
  `"Met Dr. Rao today, discussed the new trial dosage, she was positive about it"`
  — the agent classifies intent as `log`, extracts fields via the LLM, and
  saves a new interaction automatically.
- The **Logged Interactions** list below shows everything saved (from either
  path), with Edit/Delete actions.

## API Endpoints

| Method | Path | Purpose |
|---|---|---|
| POST | `/interactions/` | Create interaction (structured form) |
| GET | `/interactions/` | List all interactions |
| GET | `/interactions/{id}` | Get one interaction |
| PUT | `/interactions/{id}` | Update an interaction |
| DELETE | `/interactions/{id}` | Delete an interaction |
| POST | `/chat/` | Send a chat message → LangGraph agent → tool result |

## Notes / Assumptions

- SQLite is used by default for zero-setup local running; switch to
  Postgres/MySQL by setting `DATABASE_URL` in `.env` (schema is DB-agnostic
  via SQLAlchemy).
- Intent classification and entity extraction both go through the Groq
  `gemma2-9b-it` model as specified in the assignment; `llama-3.3-70b-versatile`
  is used only in the summarize-notes tool where longer context helps.
- Session/chat history is stored in-memory per `session_id` for simplicity;
  swap for Redis or a DB table for multi-user production use.
# AI-First-CRM-HCP-Module
