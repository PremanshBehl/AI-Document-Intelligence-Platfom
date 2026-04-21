import os
from langchain_community.vectorstores import FAISS
from services.embeddings import get_embeddings
from utils.config import settings
from utils.logger import get_logger

logger = get_logger(__name__)

def store_chunks(chunks):
    try:
        logger.info("Storing chunks in FAISS vector store")
        embeddings = get_embeddings()
        vector_store = FAISS.from_documents(chunks, embeddings)
        vector_store.save_local(settings.FAISS_INDEX_PATH)
        logger.info("Successfully saved FAISS index locally")
        return True
    except Exception as e:
        logger.error(f"Error storing chunks: {str(e)}")
        raise e

def get_vector_store():
    try:
        if not os.path.exists(settings.FAISS_INDEX_PATH):
            logger.warning("FAISS index not found. Please upload a document first.")
            return None
        logger.info("Loading existing FAISS index")
        embeddings = get_embeddings()
        return FAISS.load_local(settings.FAISS_INDEX_PATH, embeddings, allow_dangerous_deserialization=True)
    except Exception as e:
        logger.error(f"Error loading vector store: {str(e)}")
        return None
