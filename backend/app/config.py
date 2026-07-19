import os
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    APP_NAME: str = "ContextOS AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    DATABASE_URL: str = ""
    
    JWT_SECRET: str = ""
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 60 * 24

    CORS_ORIGINS: str = "http://localhost:3000"

    AI_PROVIDER: str = "openai"
    OPENAI_API_KEY: str = ""

    UPLOAD_DIR: str = "uploads"

    model_config = {"env_file": ".env", "extra": "ignore"}

    @property
    def database_url(self) -> str:
        if self.DATABASE_URL:
            return self.DATABASE_URL
        return "sqlite+aiosqlite:///./contextos.db"

    @property
    def jwt_secret(self) -> str:
        if self.JWT_SECRET:
            return self.JWT_SECRET
        import secrets
        return secrets.token_urlsafe(32)

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]


@lru_cache
def get_settings() -> Settings:
    return Settings()
