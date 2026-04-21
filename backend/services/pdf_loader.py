from langchain_community.document_loaders import PyPDFLoader
from utils.logger import get_logger

logger = get_logger(__name__)

def load_pdf(file_path: str):
    try:
        logger.info(f"Loading PDF from {file_path}")
        loader = PyPDFLoader(file_path)
        documents = loader.load()
        logger.info(f"Loaded {len(documents)} pages from PDF")
        return documents
    except Exception as e:
        logger.error(f"Error loading PDF: {str(e)}")
        raise e
