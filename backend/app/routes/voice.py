from flask import Blueprint, request, make_response
from urllib.parse import quote
from app.services.stt import get_stt_service
from app.services.rag import get_rag_service
from app.services.llm import get_llm_service
from app.services.tts import get_tts_service

voice_bp = Blueprint("voice", __name__)


@voice_bp.route("/voice", methods=["POST"])
def process_voice():
    """
    Process voice input and return audio response.

    Expects: multipart/form-data with 'audio' file
    Returns: audio/wav with headers containing transcription and response text
    """
    # Check for audio file
    if "audio" not in request.files:
        return {"error": "No audio file provided"}, 400

    audio_file = request.files["audio"]
    audio_bytes = audio_file.read()

    if len(audio_bytes) == 0:
        return {"error": "Empty audio file"}, 400

    try:
        # 1. STT: Audio -> Text
        stt_service = get_stt_service()
        transcription = stt_service.transcribe(
            audio_bytes, filename=audio_file.filename or "audio.webm"
        )

        if not transcription:
            return {"error": "Could not transcribe audio"}, 400

        # 2. RAG: Get context
        rag_service = get_rag_service()
        context = rag_service.get_context(transcription)

        # 3. LLM: Generate response
        llm_service = get_llm_service()
        response_text = llm_service.generate(transcription, context)

        # 4. TTS: Text -> Audio
        tts_service = get_tts_service()
        audio_response = tts_service.synthesize(response_text)

        # Create response with audio
        response = make_response(audio_response)
        response.headers["Content-Type"] = "audio/mpeg"
        response.headers["X-Transcription"] = quote(transcription)
        response.headers["X-Response-Text"] = quote(response_text)
        response.headers["X-Responder"] = "ai"
        response.headers["Access-Control-Expose-Headers"] = (
            "X-Transcription, X-Response-Text, X-Responder"
        )

        return response

    except Exception as e:
        print(f"Voice processing error: {e}")
        return {"error": str(e)}, 500
