from flask import Blueprint, request, jsonify
from app.services.auth import get_auth_service
from app.models.user import get_user_by_id
from app.middleware.auth import require_auth

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Login endpoint.

    Expects: JSON with 'username' and 'password'
    Returns: JSON with 'token' and 'user'
    """
    data = request.get_json()

    if not data:
        return jsonify({"error": "Dữ liệu không hợp lệ"}), 400

    username = data.get("username", "").strip()
    password = data.get("password", "")

    if not username or not password:
        return jsonify({"error": "Thiếu username hoặc password"}), 400

    auth_service = get_auth_service()
    user = auth_service.authenticate(username, password)

    if not user:
        return jsonify({"error": "Sai username hoặc password"}), 401

    token = auth_service.create_token(user)

    return jsonify({"token": token, "user": user.to_dict()})


@auth_bp.route("/me", methods=["GET"])
@require_auth
def get_current_user():
    """Get current authenticated user."""
    user = request.current_user
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user.to_dict())


@auth_bp.route("/logout", methods=["POST"])
def logout():
    """Logout endpoint (client-side token removal)."""
    return jsonify({"message": "Đăng xuất thành công"})
