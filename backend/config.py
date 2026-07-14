"""
Central configuration for the HCP CRM backend.
All secrets are read from environment variables — never hard-code keys.
"""
import os
from dotenv import load_dotenv

load_dotenv(override=True)

# --- Groq / LLM settings ---
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL_PRIMARY = os.getenv("GROQ_MODEL_PRIMARY", "llama-3.1-8b-instant")
GROQ_MODEL_CONTEXT = os.getenv("GROQ_MODEL_CONTEXT", "llama-3.3-70b-versatile")

# --- Database settings ---
# Defaults to a local SQLite file so the project runs out-of-the-box.
# Swap to Postgres/MySQL by setting DATABASE_URL, e.g.
#   postgresql+psycopg2://user:pass@localhost:5432/hcp_crm
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./hcp_crm.db")

# --- CORS ---
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
