import os
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from services.pdf_loader import load_pdf
from services.text_splitter import split_documents
from services.vector_store import store_chunks
from models.response_models import UploadResponse
from utils.config import settings
from utils.logger import get_logger

logger = get_logger(__name__)
router = APIRouter()

@router.post("/upload", response_model=UploadResponse)
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
    file_path = os.path.join(settings.UPLOAD_DIR, file.filename)
    
    try:
        # Save file temporarily
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Process the PDF
        documents = load_pdf(file_path)
        chunks = split_documents(documents)
        store_chunks(chunks)
        
        return UploadResponse(
            message="File processed and stored successfully",
            filename=file.filename,
            chunks_processed=len(chunks)
        )
    except Exception as e:
        logger.error(f"Upload failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup temporary file
        if os.path.exists(file_path):
            os.remove(file_path)
