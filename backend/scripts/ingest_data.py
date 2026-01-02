"""
Data Ingestion Script for Pinecone.

This script loads data from JSON files and uploads embeddings to Pinecone.

Usage:
    cd backend
    python scripts/ingest_data.py
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.config import Config
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone
import json


DATA_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "data",
)


def load_json_file(filename: str) -> list:
    """Load JSON file from data directory."""
    filepath = os.path.join(DATA_DIR, filename)
    if not os.path.exists(filepath):
        print(f"Warning: {filepath} not found")
        return []

    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


def prepare_documents():
    """Prepare documents from all data sources."""
    documents = []

    # Load product details
    products = load_json_file("product.json")
    for product in products:
        # Get price from variants
        variants = product.get("variants", [])
        prices = [f"{v.get('color', '')}: {v.get('price', '')}" for v in variants]
        prices_str = ", ".join(prices) if prices else ""

        # Get specs
        specs = product.get("specs", {})
        specs_parts = []
        for key, value in specs.items():
            # Truncate long values
            value_str = str(value)[:200] if len(str(value)) > 200 else str(value)
            specs_parts.append(f"{key}: {value_str}")
        specs_str = ". ".join(specs_parts)

        # Build comprehensive content
        content = f"""Tên sản phẩm: {product.get('name', '')}. 
Mô tả: {product.get('description', '')}. 
Giá theo màu: {prices_str}.
Thông số kỹ thuật: {specs_str}"""

        documents.append(
            {
                "id": f"product_{product.get('id', len(documents))}",
                "content": content,
                "category": "product",
                "metadata": {"name": product.get("name"), "prices": prices_str[:500]},
            }
        )

    # Load FAQ
    faqs = load_json_file("faq.json")
    for i, faq in enumerate(faqs):
        content = f"Câu hỏi: {faq.get('question', '')}. Trả lời: {faq.get('answer', '')}"
        documents.append(
            {
                "id": f"faq_{i}",
                "content": content,
                "category": "faq",
                "metadata": faq,
            }
        )

    # Load policies
    policies = load_json_file("policy.json")
    for i, policy in enumerate(policies):
        content = f"{policy.get('title', '')}: {policy.get('content', '')}"
        documents.append(
            {
                "id": f"policy_{i}",
                "content": content,
                "category": "policy",
                "metadata": policy,
            }
        )

    return documents


def main():
    print("Starting data ingestion...")

    # Load embedding model
    print("Loading embedding model...")
    model = SentenceTransformer(Config.EMBEDDING_MODEL)

    # Initialize Pinecone
    print("Connecting to Pinecone...")
    pc = Pinecone(api_key=Config.PINECONE_API_KEY)
    index = pc.Index(Config.PINECONE_INDEX_NAME)

    # Prepare documents
    print("Preparing documents...")
    documents = prepare_documents()
    print(f"Found {len(documents)} documents")

    if not documents:
        print("No documents to ingest. Please add data files to the data/ directory.")
        return

    # Generate embeddings and upsert
    print("Generating embeddings and uploading to Pinecone...")
    batch_size = 100

    for i in range(0, len(documents), batch_size):
        batch = documents[i: i + batch_size]

        # Generate embeddings
        texts = [doc["content"] for doc in batch]
        embeddings = model.encode(texts).tolist()

        # Prepare vectors
        vectors = []
        for doc, embedding in zip(batch, embeddings):
            vectors.append(
                {
                    "id": doc["id"],
                    "values": embedding,
                    "metadata": {
                        "content": doc["content"],
                        "category": doc["category"],
                    },
                }
            )

        # Upsert to Pinecone
        index.upsert(vectors=vectors)
        print(f"Uploaded batch {i // batch_size + 1}")

    print("Data ingestion completed!")
    print(f"Total documents: {len(documents)}")


if __name__ == "__main__":
    main()
