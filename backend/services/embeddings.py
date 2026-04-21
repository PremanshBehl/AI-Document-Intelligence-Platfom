from langchain_huggingface import HuggingFaceEmbeddings
from utils.config import settings
from utils.logger import get_logger

logger = get_logger(__name__)

def get_embeddings():
    try:
        logger.info("Initializing HuggingFace Embeddings")
        return HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    except Exception as e:
        logger.error(f"Error initializing embeddings: {str(e)}")
        raise e
