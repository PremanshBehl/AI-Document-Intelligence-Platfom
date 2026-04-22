from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database.db import get_db
from database.models import User
from database.schemas import ChatSessionCreate, ChatSessionResponse, ChatSessionDetailResponse, MessageCreate, MessageResponse
from auth.auth_utils import get_current_user
from chat.chat_service import create_chat_session, get_user_sessions, get_session_by_id, add_message_to_session, delete_session

router = APIRouter()

@router.post("/create-session", response_model=ChatSessionResponse)
def api_create_session(session: ChatSessionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return create_chat_session(db, session.title, current_user.id)

@router.get("/sessions", response_model=List[ChatSessionResponse])
def api_get_sessions(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_user_sessions(db, current_user.id)

@router.get("/{session_id}", response_model=ChatSessionDetailResponse)
def api_get_session(session_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    session = get_session_by_id(db, session_id, current_user.id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.delete("/{session_id}")
def api_delete_session(session_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    success = delete_session(db, session_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"message": "Session deleted"}

@router.post("/{session_id}/message", response_model=MessageResponse)
def api_add_message(session_id: int, message: MessageCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ai_msg = add_message_to_session(db, session_id, current_user.id, message.content)
    if not ai_msg:
        raise HTTPException(status_code=404, detail="Session not found")
    return ai_msg
