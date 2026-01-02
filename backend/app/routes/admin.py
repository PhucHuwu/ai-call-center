from flask import Blueprint, request, jsonify
from app.middleware.auth import require_admin
from app.models.session import session_manager, ResponderType
from app.services.tts import get_tts_service
from app import socketio

admin_bp = Blueprint("admin", __name__)


@admin_bp.route("/calls", methods=["GET"])
@require_admin
def get_active_calls():
    """Get all active calls."""
    sessions = session_manager.get_active_sessions()
    return jsonify({"calls": [s.to_dict() for s in sessions]})


@admin_bp.route("/calls/<session_id>", methods=["GET"])
@require_admin
def get_call(session_id):
    """Get a specific call by ID."""
    session = session_manager.get_session(session_id)
    if not session:
        return jsonify({"error": "Không tìm thấy cuộc gọi"}), 404

    return jsonify({"session": session.to_dict()})


@admin_bp.route("/takeover/<session_id>", methods=["POST"])
@require_admin
def takeover_call(session_id):
    """Admin takeover a call."""
    user = request.current_user
    success = session_manager.takeover(session_id, user.id)

    if not success:
        return jsonify({"error": "Không thể tiếp nhận cuộc gọi"}), 400

    session = session_manager.get_session(session_id)

    # Notify via WebSocket
    socketio.emit(
        "call_update", {"session": session.to_dict()}, room="admins"
    )

    return jsonify({"message": "Đã tiếp nhận cuộc gọi", "session": session.to_dict()})


@admin_bp.route("/release/<session_id>", methods=["POST"])
@require_admin
def release_call(session_id):
    """Admin release a call back to AI."""
    success = session_manager.release(session_id)

    if not success:
        return jsonify({"error": "Không thể trả lại cuộc gọi"}), 400

    session = session_manager.get_session(session_id)

    # Notify via WebSocket
    socketio.emit(
        "call_update", {"session": session.to_dict()}, room="admins"
    )

    return jsonify({"message": "Đã trả lại cuộc gọi cho AI", "session": session.to_dict()})


@admin_bp.route("/respond/<session_id>", methods=["POST"])
@require_admin
def admin_respond(session_id):
    """Admin send a response to a call."""
    data = request.get_json()
    message_text = data.get("message", "").strip()

    if not message_text:
        return jsonify({"error": "Tin nhắn không được để trống"}), 400

    session = session_manager.get_session(session_id)
    if not session:
        return jsonify({"error": "Không tìm thấy cuộc gọi"}), 404

    if session.current_responder != ResponderType.ADMIN:
        return jsonify({"error": "Chưa tiếp nhận cuộc gọi"}), 400

    # Add message to session
    message = session_manager.add_message(
        session_id, "admin", message_text, ResponderType.ADMIN
    )

    # Generate TTS audio
    tts_service = get_tts_service()
    audio_bytes = tts_service.synthesize(message_text)

    # Notify via WebSocket
    socketio.emit(
        "new_message",
        {
            "session_id": session_id,
            "message": {
                "id": message.id,
                "role": message.role,
                "content": message.content,
                "timestamp": message.timestamp,
                "responder": message.responder.value,
            },
        },
        room="admins",
    )

    return jsonify(
        {
            "message": "Đã gửi tin nhắn",
            "audio_size": len(audio_bytes),
        }
    )
