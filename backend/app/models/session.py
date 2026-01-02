from enum import Enum
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional
import uuid


class ResponderType(str, Enum):
    AI = "ai"
    ADMIN = "admin"


class CallStatus(str, Enum):
    ACTIVE = "active"
    ENDED = "ended"
    ADMIN_TAKEOVER = "admin_takeover"


@dataclass
class Message:
    id: str
    role: str  # user, assistant, admin
    content: str
    timestamp: str
    responder: ResponderType


@dataclass
class CallSession:
    id: str
    guest_id: str
    guest_name: str
    status: CallStatus
    current_responder: ResponderType
    messages: list = field(default_factory=list)
    admin_id: Optional[str] = None
    started_at: str = field(
        default_factory=lambda: datetime.now().isoformat()
    )
    ended_at: Optional[str] = None

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "guest_id": self.guest_id,
            "guest_name": self.guest_name,
            "status": self.status.value,
            "current_responder": self.current_responder.value,
            "messages": [
                {
                    "id": m.id,
                    "role": m.role,
                    "content": m.content,
                    "timestamp": m.timestamp,
                    "responder": m.responder.value,
                }
                for m in self.messages
            ],
            "admin_id": self.admin_id,
            "started_at": self.started_at,
            "ended_at": self.ended_at,
        }


class SessionManager:
    """In-memory session manager."""

    def __init__(self):
        self.sessions: dict[str, CallSession] = {}

    def create_session(self, guest_id: str, guest_name: str) -> CallSession:
        session_id = str(uuid.uuid4())
        session = CallSession(
            id=session_id,
            guest_id=guest_id,
            guest_name=guest_name,
            status=CallStatus.ACTIVE,
            current_responder=ResponderType.AI,
        )
        self.sessions[session_id] = session
        return session

    def get_session(self, session_id: str) -> Optional[CallSession]:
        return self.sessions.get(session_id)

    def get_active_sessions(self) -> list[CallSession]:
        return [
            s for s in self.sessions.values() if s.status != CallStatus.ENDED
        ]

    def add_message(
        self,
        session_id: str,
        role: str,
        content: str,
        responder: ResponderType,
    ) -> Optional[Message]:
        session = self.get_session(session_id)
        if not session:
            return None

        message = Message(
            id=str(uuid.uuid4()),
            role=role,
            content=content,
            timestamp=datetime.now().isoformat(),
            responder=responder,
        )
        session.messages.append(message)
        return message

    def takeover(self, session_id: str, admin_id: str) -> bool:
        session = self.get_session(session_id)
        if not session:
            return False

        session.current_responder = ResponderType.ADMIN
        session.admin_id = admin_id
        session.status = CallStatus.ADMIN_TAKEOVER
        return True

    def release(self, session_id: str) -> bool:
        session = self.get_session(session_id)
        if not session:
            return False

        session.current_responder = ResponderType.AI
        session.admin_id = None
        session.status = CallStatus.ACTIVE
        return True

    def end_session(self, session_id: str) -> bool:
        session = self.get_session(session_id)
        if not session:
            return False

        session.status = CallStatus.ENDED
        session.ended_at = datetime.now().isoformat()
        return True


# Global session manager
session_manager = SessionManager()
