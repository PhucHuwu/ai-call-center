from functools import wraps
from flask import request, jsonify
from app.services.auth import get_auth_service
from app.models.user import get_user_by_id


def get_token_from_request():
    """Extract token from Authorization header."""
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        return auth_header[7:]
    return None


def require_auth(f):
    """Decorator to require authentication."""

    @wraps(f)
    def decorated(*args, **kwargs):
        token = get_token_from_request()
        if not token:
            return jsonify({"error": "Token required"}), 401

        auth_service = get_auth_service()
        payload = auth_service.verify_token(token)

        if not payload:
            return jsonify({"error": "Invalid or expired token"}), 401

        # Add user to request context
        user = get_user_by_id(payload.get("user_id"))
        request.current_user = user

        return f(*args, **kwargs)

    return decorated


def require_admin(f):
    """Decorator to require admin role."""

    @wraps(f)
    def decorated(*args, **kwargs):
        token = get_token_from_request()
        if not token:
            return jsonify({"error": "Token required"}), 401

        auth_service = get_auth_service()

        if not auth_service.is_admin(token):
            return jsonify({"error": "Admin access required"}), 403

        payload = auth_service.verify_token(token)
        user = get_user_by_id(payload.get("user_id"))
        request.current_user = user

        return f(*args, **kwargs)

    return decorated
