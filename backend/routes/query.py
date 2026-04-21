from fastapi import APIRouter, HTTPException
from models.request_models import QueryRequest
from models.response_models import QueryResponse, SourceDocument
from services.rag_chain import get_rag_chain
from utils.logger import get_logger

logger = get_logger(__name__)
router = APIRouter()

@router.post("/query", response_model=QueryResponse)
async def query_document(request: QueryRequest):
    try:
        logger.info(f"Processing query: {request.question}")
        rag_chain = get_rag_chain()
        
        # Execute query
        result = rag_chain({"query": request.question})
        
        # Format sources
        sources = []
        if "source_documents" in result:
            for doc in result["source_documents"]:
                sources.append(SourceDocument(
                    page_content=doc.page_content,
                    metadata=doc.metadata
                ))
                
        return QueryResponse(
            answer=result["result"],
            sources=sources
        )
    except ValueError as e:
        logger.warning(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Query failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
