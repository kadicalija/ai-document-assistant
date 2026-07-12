# AI Document Assistant

An AI-powered document assistant that allows users to upload PDF documents and ask questions about their content using Retrieval-Augmented Generation (RAG).

The project is being built with FastAPI, React and Google Gemini while following clean architecture and production-oriented backend practices.

## Features

- Upload PDF documents
- Chat with AI using Google Gemini
- Retrieval-Augmented Generation (RAG)
- Vector database search
- Modern React frontend
- REST API built with FastAPI

## Tech Stack

### Backend

- FastAPI
- Python
- Google Gemini API

### Frontend

- React

### AI

- Google Gemini
- RAG
- Embeddings

### Storage

- ChromaDB (planned)

### Version Control

- Git
- GitHub

## Project Structure

ai-document-assistant/

├── backend/

│ ├── server.py

│ ├── llm.py

│ ├── config.py

│ └── uploads/

├── frontend/

├── README.md

└── .gitignore


## Getting Started

Clone the repository

```bash
git clone https://github.com/kadicalija/ai-document-assistant.git
```

Install dependencies

```bash
pip install -r backend/requirements.txt
```
Create a `.env` file inside the `backend` folder:

```env
GEMINI_API_KEY=your_api_key_here
```

Start the backend

```bash
uvicorn server:app --reload
```

## Current Progress

- [x] FastAPI backend
- [x] Google Gemini integration
- [x] PDF upload endpoint
- [ ] Document management API
- [ ] PDF parsing
- [ ] Text chunking
- [ ] Embeddings
- [ ] Vector database
- [ ] RAG pipeline
- [ ] React frontend

## Roadmap

1. Document management
2. PDF text extraction
3. Chunking
4. Embeddings
5. ChromaDB integration
6. Retrieval-Augmented Generation
7. React frontend
8. Authentication

React -> FastAPI -> Gemini -> RAG -> Vector Database

## 📌 Project Goals

This project is being developed as a portfolio application to learn and demonstrate modern AI application development, including:

- FastAPI backend development
- React frontend development
- Google Gemini integration
- Retrieval-Augmented Generation (RAG)
- Vector databases
- Clean project architecture
- Production-oriented development workflow