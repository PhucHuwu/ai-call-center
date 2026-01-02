from flask import Blueprint, request, jsonify
from app.services.rag import get_rag_service
from app.services.llm import get_llm_service

chat_bp = Blueprint("chat", __name__)


@chat_bp.route("/chat", methods=["POST"])
def chat():
    """
    Process text chat and return response.

    Expects: JSON with 'message' field
    Returns: JSON with 'response' field
    """
    data = request.get_json()

    if not data or "message" not in data:
        return jsonify({"error": "No message provided"}), 400

    message = data["message"].strip()
    if not message:
        return jsonify({"error": "Empty message"}), 400

    try:
        # 1. RAG: Get context
        rag_service = get_rag_service()
        context = rag_service.get_context(message)

        # 2. LLM: Generate response
        llm_service = get_llm_service()
        response_text = llm_service.generate(message, context)

        return jsonify(
            {
                "response": response_text,
                "sources": context.split("\n") if context else [],
            }
        )

    except Exception as e:
        print(f"Chat error: {e}")
        return jsonify({"error": str(e)}), 500
