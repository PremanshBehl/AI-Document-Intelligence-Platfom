from langchain_classic.chains import RetrievalQA
from langchain_core.prompts import PromptTemplate
from services.llm import get_llm
from services.vector_store import get_vector_store
from utils.logger import get_logger

logger = get_logger(__name__)

prompt_template = """
You are a highly intelligent AI Document Assistant.
Use the following pieces of retrieved document context to answer the user's question.
If the answer is not in the context, clearly state that you do not know. Do not guess or hallucinate.
Provide a clear, detailed, and structured response.

Context:
{context}

Question:
{question}

Helpful Answer:
"""

def generate_rag_response(query: str) -> str:
    try:
        logger.info(f"Generating RAG response for query: {query}")
        
        vector_store = get_vector_store()
        if not vector_store:
            return "No documents have been uploaded yet. Please upload a PDF first."

        retriever = vector_store.as_retriever(search_kwargs={"k": 4})
        llm = get_llm()

        PROMPT = PromptTemplate(
            template=prompt_template, input_variables=["context", "question"]
        )

        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=retriever,
            return_source_documents=True,
            chain_type_kwargs={"prompt": PROMPT}
        )

        result = qa_chain({"query": query})
        return result["result"]

    except Exception as e:
        logger.error(f"Error in RAG pipeline: {str(e)}")
        return "An error occurred while generating the response. Please try again later."
