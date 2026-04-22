from langchain_text_splitters import RecursiveCharacterTextSplitter
from utils.config import settings
from utils.logger import get_logger

logger = get_logger(__name__)

def split_documents(documents):
    try:
        logger.info("Splitting documents into chunks")
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.CHUNK_SIZE,
            chunk_overlap=settings.CHUNK_OVERLAP,
            separators=["\n\n", "\n", " ", ""]
        )
        chunks = text_splitter.split_documents(documents)
        logger.info(f"Created {len(chunks)} chunks")
        return chunks
    except Exception as e:
        logger.error(f"Error splitting documents: {str(e)}")
        raise e
