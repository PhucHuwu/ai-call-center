from groq import Groq
from app.config import Config


SYSTEM_PROMPT = """Bạn là trợ lý AI chăm sóc khách hàng của cửa hàng. Nhiệm vụ của bạn là:
- Trả lời câu hỏi về sản phẩm, chính sách và dịch vụ
- Hỗ trợ khách hàng một cách thân thiện và chuyên nghiệp
- Sử dụng thông tin được cung cấp trong context để trả lời chính xác
- Nếu không có thông tin trong context, hãy nói rằng bạn sẽ chuyển câu hỏi cho nhân viên

Trả lời ngắn gọn, dễ hiểu và bằng tiếng Việt. Chỉ trả lời bằng plain text."""


class LLMService:
    """LLM service using Groq API."""

    def __init__(self):
        self.client = Groq(api_key=Config.GROQ_API_KEY)
        self.model = Config.GROQ_LLM_MODEL

    def generate(self, query: str, context: str = "") -> str:
        """
        Generate response from LLM.

        Args:
            query: User query
            context: RAG context

        Returns:
            Generated response
        """
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]

        if context:
            messages.append(
                {
                    "role": "system",
                    "content": f"Thông tin tham khảo:\n{context}",
                }
            )

        messages.append({"role": "user", "content": query})

        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=0.7,
            max_tokens=500,
        )

        return response.choices[0].message.content.strip()


# Singleton instance
_llm_service = None


def get_llm_service() -> LLMService:
    global _llm_service
    if _llm_service is None:
        _llm_service = LLMService()
    return _llm_service
