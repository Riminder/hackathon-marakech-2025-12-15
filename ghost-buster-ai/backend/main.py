# backend/main.py
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import analysis, chat

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Anti-Ghosting HR Agent API",
    description="Personalized rejection emails with skill gap analysis and career feedback",
    version="1.0.0"
)

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite default port
        "http://localhost:3000",  # Alternative frontend port
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(analysis.router)
app.include_router(chat.router)


@app.get("/")
async def root():
    return {
        "message": "Anti-Ghosting HR Agent API",
        "docs": "/docs",
        "status": "running"
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}
