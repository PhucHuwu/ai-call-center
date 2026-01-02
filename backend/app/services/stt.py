import io
from groq import Groq
from app.config import Config


class STTService:
    """Speech-to-Text service using Groq Whisper API."""

    def __init__(self):
        self.client = Groq(api_key=Config.GROQ_API_KEY)
        self.model = Config.GROQ_STT_MODEL

    def transcribe(self, audio_bytes: bytes, filename: str = "audio.webm") -> str:
        """
        Transcribe audio to text.

        Args:
            audio_bytes: Audio file bytes
            filename: Filename with extension for mime type detection

        Returns:
            Transcribed text
        """
        audio_file = io.BytesIO(audio_bytes)
        audio_file.name = filename

        transcription = self.client.audio.transcriptions.create(
            file=audio_file,
            model=self.model,
            language="vi",
            response_format="text",
        )

        return transcription.strip()


# Singleton instance
_stt_service = None


def get_stt_service() -> STTService:
    global _stt_service
    if _stt_service is None:
        _stt_service = STTService()
    return _stt_service
