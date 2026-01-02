from flask_socketio import join_room, leave_room
from app import socketio
from app.services.auth import get_auth_service
from app.models.session import session_manager


@socketio.on("connect")
def handle_connect():
    """Handle client connection."""
    print("Client connected")


@socketio.on("disconnect")
def handle_disconnect():
    """Handle client disconnection."""
    print("Client disconnected")


@socketio.on("admin_join")
def handle_admin_join(data):
    """Admin joins the admin room for real-time updates."""
    token = data.get("token")
    if not token:
        return

    auth_service = get_auth_service()
    if auth_service.is_admin(token):
        join_room("admins")

        # Send current active calls
        sessions = session_manager.get_active_sessions()
        socketio.emit(
            "active_calls",
            {"calls": [s.to_dict() for s in sessions]},
            room="admins",
        )
        print("Admin joined room")


@socketio.on("admin_leave")
def handle_admin_leave():
    """Admin leaves the admin room."""
    leave_room("admins")
    print("Admin left room")


def broadcast_new_call(session):
    """Broadcast new call to admins."""
    socketio.emit("new_call", {"session": session.to_dict()}, room="admins")


def broadcast_call_update(session):
    """Broadcast call update to admins."""
    socketio.emit(
        "call_update", {"session": session.to_dict()}, room="admins"
    )


def broadcast_call_ended(session_id):
    """Broadcast call ended to admins."""
    socketio.emit("call_ended", {"session_id": session_id}, room="admins")
