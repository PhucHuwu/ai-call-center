from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
from app.config import Config


class RAGService:
    """Retrieval-Augmented Generation service using Pinecone."""

    def __init__(self):
        self.pc = Pinecone(api_key=Config.PINECONE_API_KEY)
        self.index = self.pc.Index(Config.PINECONE_INDEX_NAME)
        self.embedding_model = SentenceTransformer(Config.EMBEDDING_MODEL)

    def get_embedding(self, text: str) -> list:
        """Generate embedding for text."""
        return self.embedding_model.encode(text).tolist()

    def search(self, query: str, top_k: int = 3) -> list:
        """
        Search for relevant documents.

        Args:
            query: User query
            top_k: Number of results to return

        Returns:
            List of relevant documents with scores
        """
        query_embedding = self.get_embedding(query)

        results = self.index.query(
            vector=query_embedding,
            top_k=top_k,
            include_metadata=True,
        )

        documents = []
        for match in results.matches:
            if match.score > 0.5:  # Threshold
                documents.append(
                    {
                        "content": match.metadata.get("content", ""),
                        "category": match.metadata.get("category", ""),
                        "score": match.score,
                    }
                )

        return documents

    def get_context(self, query: str) -> str:
        """
        Get context string for LLM.

        Args:
            query: User query

        Returns:
            Context string formatted for LLM
        """
        documents = self.search(query)

        if not documents:
            return ""

        context_parts = []
        for i, doc in enumerate(documents, 1):
            context_parts.append(
                f"[{i}] ({doc['category']}): {doc['content']}"
            )

        return "\n".join(context_parts)


# Singleton instance
_rag_service = None


def get_rag_service() -> RAGService:
    global _rag_service
    if _rag_service is None:
        _rag_service = RAGService()
    return _rag_service
