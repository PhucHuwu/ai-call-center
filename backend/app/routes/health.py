from flask import Blueprint, jsonify
from app.services.tts import get_tts_service

health_bp = Blueprint("health", __name__)


@health_bp.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint."""
    tts_service = get_tts_service()

    return jsonify(
        {
            "status": "ok",
            "services": {
                "tts": tts_service.health_check(),
            },
        }
    )
