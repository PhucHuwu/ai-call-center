from enum import Enum
from dataclasses import dataclass
import bcrypt


class UserRole(str, Enum):
    GUEST = "guest"
    ADMIN = "admin"


@dataclass
class User:
    id: str
    username: str
    password_hash: str
    role: UserRole
    display_name: str

    def verify_password(self, password: str) -> bool:
        return bcrypt.checkpw(
            password.encode("utf-8"), self.password_hash.encode("utf-8")
        )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "username": self.username,
            "role": self.role.value,
            "display_name": self.display_name,
        }


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode(
        "utf-8"
    )


# Demo users
DEMO_USERS = {
    "guest": User(
        id="u1",
        username="guest",
        password_hash=hash_password("guest123"),
        role=UserRole.GUEST,
        display_name="Khách",
    ),
    "admin": User(
        id="u2",
        username="admin",
        password_hash=hash_password("admin123"),
        role=UserRole.ADMIN,
        display_name="Quản trị viên",
    ),
}


def get_user_by_username(username: str) -> User | None:
    return DEMO_USERS.get(username)


def get_user_by_id(user_id: str) -> User | None:
    for user in DEMO_USERS.values():
        if user.id == user_id:
            return user
    return None
