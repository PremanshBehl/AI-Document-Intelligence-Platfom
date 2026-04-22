from sqlalchemy.orm import Session
from database.models import ChatSession, Message, User
from database.schemas import ChatSessionCreate
from rag.rag_pipeline import generate_rag_response

def create_chat_session(db: Session, title: str, user_id: int):
    new_session = ChatSession(title=title, user_id=user_id)
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return new_session

def get_user_sessions(db: Session, user_id: int):
    return db.query(ChatSession).filter(ChatSession.user_id == user_id).order_by(ChatSession.created_at.desc()).all()

def get_session_by_id(db: Session, session_id: int, user_id: int):
    return db.query(ChatSession).filter(ChatSession.id == session_id, ChatSession.user_id == user_id).first()

def delete_session(db: Session, session_id: int, user_id: int):
    session = get_session_by_id(db, session_id, user_id)
    if session:
        db.delete(session)
        db.commit()
        return True
    return False

def add_message_to_session(db: Session, session_id: int, user_id: int, content: str):
    # Verify ownership
    session = get_session_by_id(db, session_id, user_id)
    if not session:
        return None

    # Update session title if it's the first message
    if session.title == "New Chat":
        # Keep title short
        session.title = content[:30] + "..." if len(content) > 30 else content
        db.commit()

    # Save user message
    user_msg = Message(session_id=session_id, role="user", content=content)
    db.add(user_msg)
    db.commit()

    # Generate RAG response
    ai_response = generate_rag_response(content)

    # Save AI message
    ai_msg = Message(session_id=session_id, role="assistant", content=ai_response)
    db.add(ai_msg)
    db.commit()
    db.refresh(ai_msg)
    
    return ai_msg
