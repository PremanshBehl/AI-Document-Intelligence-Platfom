from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from services.llm import get_llm
from services.vector_store import get_vector_store
from utils.logger import get_logger

logger = get_logger(__name__)

PROMPT_TEMPLATE = """You are an AI assistant.
Answer ONLY from the provided context.
If the answer is not in the context, say 'Not found in document'.

Context:
{context}

Question:
{question}"""

def get_rag_chain():
    try:
        vector_store = get_vector_store()
        if not vector_store:
            raise ValueError("Vector store not initialized. Upload a document first.")
            
        retriever = vector_store.as_retriever(search_kwargs={"k": 4})
        llm = get_llm()
        
        prompt = PromptTemplate(
            template=PROMPT_TEMPLATE,
            input_variables=["context", "question"]
        )
        
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=retriever,
            return_source_documents=True,
            chain_type_kwargs={"prompt": prompt}
        )
        
        logger.info("Successfully initialized RAG chain")
        return qa_chain
    except Exception as e:
        logger.error(f"Error getting RAG chain: {str(e)}")
        raise e
