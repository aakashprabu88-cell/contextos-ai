"""ChromaDB vector search service for semantic search across notes and documents."""
import logging
from typing import Optional

logger = logging.getLogger(__name__)

_client: Optional[object] = None
_collection: Optional[object] = None

COLLECTION_NAME = "contextos_context"


def get_chroma_client():
    global _client
    if _client is not None:
        return _client
    try:
        import chromadb
        import os
        host = os.environ.get("CHROMA_HOST", "localhost")
        port = int(os.environ.get("CHROMA_PORT", "8001"))
        _client = chromadb.HttpClient(host=host, port=port)
        return _client
    except Exception as e:
        logger.warning("ChromaDB not available: %s", e)
        _client = None
        return None


def get_collection():
    global _collection
    if _collection is not None:
        return _collection
    client = get_chroma_client()
    if client is None:
        return None
    try:
        _collection = client.get_or_create_collection(
            name=COLLECTION_NAME,
            metadata={"hnsw:space": "cosine"},
        )
        return _collection
    except Exception as e:
        logger.warning("Could not get ChromaDB collection: %s", e)
        return None


class VectorService:
    def __init__(self):
        self.collection = get_collection()

    def _available(self) -> bool:
        return self.collection is not None

    def add_document(self, doc_id: str, text: str, metadata: dict = None) -> None:
        if not self._available():
            return
        self.collection.upsert(
            ids=[doc_id],
            documents=[text],
            metadatas=[metadata or {}],
        )

    def add_documents(self, doc_ids: list[str], texts: list[str], metadatas: list[dict] = None) -> None:
        if not self._available() or not doc_ids:
            return
        self.collection.upsert(
            ids=doc_ids,
            documents=texts,
            metadatas=metadatas or [{} for _ in doc_ids],
        )

    def search(self, query: str, n_results: int = 10, where: dict = None) -> list[dict]:
        if not self._available():
            return []
        kwargs = {"query_texts": [query], "n_results": n_results}
        if where:
            kwargs["where"] = where

        results = self.collection.query(**kwargs)

        items = []
        if results and results["ids"] and results["ids"][0]:
            for i, doc_id in enumerate(results["ids"][0]):
                items.append({
                    "id": doc_id,
                    "document": results["documents"][0][i] if results["documents"] else "",
                    "metadata": results["metadatas"][0][i] if results["metadatas"] else {},
                    "distance": results["distances"][0][i] if results["distances"] else 0,
                    "score": 1 - results["distances"][0][i] if results["distances"] else 0,
                })
        return items

    def delete(self, doc_id: str) -> None:
        if not self._available():
            return
        self.collection.delete(ids=[doc_id])

    def delete_many(self, doc_ids: list[str]) -> None:
        if self._available() and doc_ids:
            self.collection.delete(ids=doc_ids)

    def count(self) -> int:
        if not self._available():
            return 0
        return self.collection.count()
