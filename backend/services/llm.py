from langchain_groq import ChatGroq
from utils.config import settings
from utils.logger import get_logger

logger = get_logger(__name__)

def get_llm():
    try:
        logger.info("Initializing Groq LLM")
        return ChatGroq(
            model_name="llama-3.1-8b-instant",
            temperature=0,
            groq_api_key=settings.GROQ_API_KEY
        )
    except Exception as e:
        logger.error(f"Error initializing LLM: {str(e)}")
        raise e
