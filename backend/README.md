# Mista Ponda Chatbot Backend

FastAPI service that powers the chatbot widget on the frontend, backed by
[xAI Grok](https://x.ai/api).

## Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate           # Windows
# source .venv/bin/activate      # macOS / Linux

pip install -r requirements.txt
```

## Configure

The API key is loaded from `backend/.env` (already created locally, ignored by
git). Variables:

```
XAI_API_KEY=xai-...
XAI_MODEL=grok-4.20-reasoning
```

## Run

```bash
uvicorn main:app --reload --port 8000
```

API at http://localhost:8000.

## Endpoints

- `GET  /health`  → health + whether the API key is configured
- `POST /chat`    → body `{ "message": "hi", "history": [...] }` → `{ "reply": "..." }`

History items use `{ "role": "user" | "bot", "content": "..." }` (the server
maps `bot` → `assistant` for Grok).

## Frontend wiring

The React app reads `VITE_CHATBOT_API` (defaults to `http://localhost:8000`).
Set it in a `.env` at the project root if your backend runs elsewhere:

```
VITE_CHATBOT_API=http://localhost:8000
```
