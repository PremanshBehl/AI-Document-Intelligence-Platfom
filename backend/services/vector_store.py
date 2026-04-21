import os
from langchain_pinecone import PineconeVectorStore
from services.embeddings import get_embeddings
from utils.config import settings
from utils.logger import get_logger

logger = get_logger(__name__)

def store_chunks(chunks):
    try:
        logger.info(f"Storing chunks in Pinecone index: {settings.PINECONE_INDEX_NAME}")
        embeddings = get_embeddings()
        PineconeVectorStore.from_documents(
            chunks,
            embeddings,
            index_name=settings.PINECONE_INDEX_NAME
        )
        logger.info("Successfully saved chunks to Pinecone")
        return True
    except Exception as e:
        logger.error(f"Error storing chunks in Pinecone: {str(e)}")
        raise e

def get_vector_store():
    try:
        if not settings.PINECONE_API_KEY:
            logger.warning("PINECONE_API_KEY not found in environment.")
            return None
        logger.info("Connecting to existing Pinecone index")
        embeddings = get_embeddings()
        return PineconeVectorStore(
            index_name=settings.PINECONE_INDEX_NAME, 
            embedding=embeddings
        )
    except Exception as e:
        logger.error(f"Error loading Pinecone vector store: {str(e)}")
        return None
