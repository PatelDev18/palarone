from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../../services")))
from ai.copilot import AICopilotEngine

router = APIRouter()

class ChatRequest(BaseModel):
    query: str
    context: str = "general"

@router.post("/chat")
def chat_with_copilot(request: ChatRequest) -> Dict[str, Any]:
    """
    AI Copilot Endpoint (Phase 40).
    Powered by the dynamic AICopilotEngine pulling from the ML Registry.
    """
    engine = AICopilotEngine()
    return engine.process_query(request.query)
