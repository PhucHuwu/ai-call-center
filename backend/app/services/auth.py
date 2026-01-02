import jwt
from datetime import datetime, timedelta
from app.config import Config
from app.models.user import User, get_user_by_username, UserRole


class AuthService:
    """Authentication service using JWT."""

    def __init__(self):
        self.secret_key = Config.JWT_SECRET_KEY
        self.expiration_hours = Config.JWT_EXPIRATION_HOURS

    def authenticate(self, username: str, password: str) -> User | None:
        """Verify username and password."""
        user = get_user_by_username(username)
        if user and user.verify_password(password):
            return user
        return None

    def create_token(self, user: User) -> str:
        """Create JWT token for user."""
        payload = {
            "user_id": user.id,
            "username": user.username,
            "role": user.role.value,
            "exp": datetime.utcnow()
            + timedelta(hours=self.expiration_hours),
        }
        return jwt.encode(payload, self.secret_key, algorithm="HS256")

    def verify_token(self, token: str) -> dict | None:
        """Verify JWT token and return payload."""
        try:
            payload = jwt.decode(
                token, self.secret_key, algorithms=["HS256"]
            )
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None

    def is_admin(self, token: str) -> bool:
        """Check if token belongs to admin user."""
        payload = self.verify_token(token)
        if not payload:
            return False
        return payload.get("role") == UserRole.ADMIN.value


# Singleton instance
_auth_service = None


def get_auth_service() -> AuthService:
    global _auth_service
    if _auth_service is None:
        _auth_service = AuthService()
    return _auth_service
