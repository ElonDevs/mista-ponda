"""
FastAPI chatbot backend for the Pandas Portfolio site, powered by xAI Grok.

Run locally:
    pip install -r requirements.txt
    uvicorn main:app --reload --port 8000

Frontend POSTs to /chat with: { "message": "...", "history": [...] }
and receives:                  { "reply": "..." }
"""

from __future__ import annotations

import os
from typing import List, Optional

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


load_dotenv()

XAI_API_KEY = os.environ.get("XAI_API_KEY", "")
XAI_MODEL = os.environ.get("XAI_MODEL", "grok-4.20-reasoning")
XAI_API_URL = "https://api.x.ai/v1/chat/completions"

SYSTEM_PROMPT = (
    "You are Panda, a friendly chatbot embedded in an interactive 3D portfolio "
    "website built with React, Three.js, and GSAP. Be concise, warm, and helpful. "
    "Answer questions about the portfolio, the tech stack, and how to navigate "
    "(users scroll or drag up/down to move between scenes). Keep replies short "
    "(1-3 sentences) unless the user explicitly asks for detail."
)


app = FastAPI(title="Mista Ponda Chatbot", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatMessage(BaseModel):
    role: str = Field(..., description="'user' or 'bot'")
    content: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = None


class ChatResponse(BaseModel):
    reply: str


def to_grok_messages(history: Optional[List[ChatMessage]], user_message: str) -> list[dict]:
    msgs: list[dict] = [{"role": "system", "content": SYSTEM_PROMPT}]
    if history:
        for m in history:
            role = "assistant" if m.role == "bot" else "user"
            content = (m.content or "").strip()
            if content:
                msgs.append({"role": role, "content": content})
    if not msgs or msgs[-1].get("content") != user_message:
        msgs.append({"role": "user", "content": user_message})
    return msgs


async def call_grok(messages: list[dict]) -> str:
    if not XAI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="XAI_API_KEY is not configured on the server.",
        )

    payload = {
        "model": XAI_MODEL,
        "messages": messages,
        "temperature": 0.6,
        "stream": False,
    }
    headers = {
        "Authorization": f"Bearer {XAI_API_KEY}",
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            resp = await client.post(XAI_API_URL, json=payload, headers=headers)
        except httpx.HTTPError as e:
            raise HTTPException(status_code=502, detail=f"Upstream error: {e}") from e

    if resp.status_code >= 400:
        raise HTTPException(
            status_code=502,
            detail=f"xAI API returned {resp.status_code}: {resp.text}",
        )

    data = resp.json()
    try:
        return data["choices"][0]["message"]["content"].strip()
    except (KeyError, IndexError, AttributeError) as e:
        raise HTTPException(
            status_code=502,
            detail=f"Unexpected response shape from xAI: {data}",
        ) from e


@app.get("/")
def root():
    return {"status": "ok", "service": "mista-ponda-chatbot", "model": XAI_MODEL}


@app.get("/health")
def health():
    return {"status": "healthy", "model": XAI_MODEL, "configured": bool(XAI_API_KEY)}


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest) -> ChatResponse:
    user_message = (req.message or "").strip()
    if not user_message:
        return ChatResponse(reply="Type a message and I'll do my best to answer!")

    messages = to_grok_messages(req.history, user_message)
    reply = await call_grok(messages)
    return ChatResponse(reply=reply)


if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", "8000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
