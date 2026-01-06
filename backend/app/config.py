import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    # Flask
    FLASK_ENV = os.getenv("FLASK_ENV", "development")
    FLASK_PORT = int(os.getenv("FLASK_PORT", 3724))

    # Groq
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    GROQ_STT_MODEL = "whisper-large-v3-turbo"
    GROQ_LLM_MODEL = "llama-3.3-70b-versatile"

    # Pinecone
    PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
    PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "ai-call-center")

    # TTS - valtec-tts settings
    TTS_DEVICE = os.getenv("TTS_DEVICE", "cpu")
    TTS_DEFAULT_SPEAKER = os.getenv("TTS_DEFAULT_SPEAKER", "NF")
    TTS_DEFAULT_SPEED = float(os.getenv("TTS_DEFAULT_SPEED", "1.0"))

    # JWT
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-secret-key")
    JWT_EXPIRATION_HOURS = 24

    # SocketIO
    SOCKETIO_ASYNC_MODE = os.getenv("SOCKETIO_ASYNC_MODE", "eventlet")

    # Embedding - 768 dimensions
    EMBEDDING_MODEL = "sentence-transformers/paraphrase-multilingual-mpnet-base-v2"
