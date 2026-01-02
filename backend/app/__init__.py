from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from app.config import Config

socketio = SocketIO()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.config["SECRET_KEY"] = Config.JWT_SECRET_KEY

    # Enable CORS for frontend
    CORS(
        app,
        resources={r"/api/*": {"origins": ["http://localhost:3000"]}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    )

    # Initialize SocketIO
    socketio.init_app(
        app,
        cors_allowed_origins=["http://localhost:3000"],
        async_mode=Config.SOCKETIO_ASYNC_MODE,
    )

    # Register blueprints
    from app.routes.health import health_bp
    from app.routes.voice import voice_bp
    from app.routes.chat import chat_bp
    from app.routes.auth import auth_bp
    from app.routes.admin import admin_bp

    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(voice_bp, url_prefix="/api")
    app.register_blueprint(chat_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")

    # Register WebSocket handlers
    from app.routes import websocket  # noqa: F401

    return app
