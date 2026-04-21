# AI Document Intelligence Platform

A production-ready AI SaaS application leveraging Retrieval-Augmented Generation (RAG) to allow users to interact with PDF documents. Built with FastAPI, React, LangChain, FAISS, and OpenAI.

## Features
- **PDF Uploading & Processing**: Backend dynamically extracts, chunks, and stores text from uploaded PDF files.
- **Semantic Search**: FAISS vector database enables highly relevant document context retrieval.
- **Strict RAG Answers**: Specialized prompts prevent hallucination. The LLM only answers from the provided document context.
- **Premium UI**: Dark-mode, responsive React frontend with glassmorphic touches and micro-animations.
- **Source Citations**: Displays which document chunks the model used for its answer.

## Architecture
- **Frontend**: React (Vite), Axios, Lucide React (icons)
- **Backend**: FastAPI, Pydantic, Python
- **AI/ML**: LangChain, OpenAI Embeddings (ada-002), ChatGPT (gpt-3.5-turbo), FAISS Vector Store

## Prerequisites
- Node.js (v16+)
- Python (3.9+)
- OpenAI API Key

## Setup Instructions

### 1. Backend Setup
Navigate to the `backend` directory:
```bash
cd backend
```

Create a virtual environment and activate it:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Set your OpenAI API key in `.env`:
```text
OPENAI_API_KEY=your_actual_api_key_here
```

Run the FastAPI server:
```bash
uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup
Navigate to the `frontend` directory in a new terminal:
```bash
cd frontend
```

Install NPM dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

## Usage
1. Open your browser to the local Vite URL (usually `http://localhost:3000` or `http://localhost:5173`).
2. Upload a PDF document using the file uploader. Wait for the success message.
3. Once processed, type questions in the chat box on the right.
4. The AI will respond based exclusively on the contents of the uploaded PDF, citing the exact document snippets.

## Future Enhancements
- Support for multiple documents per session.
- User authentication and persistent chat history.
- Switching to open-source models (Llama 2, Mistral) for privacy.
