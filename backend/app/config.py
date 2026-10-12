from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Full PostgreSQL connection string (e.g. from Neon).
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/event_management"

    CORS_ORIGINS: str = (
        "http://localhost:5173,http://127.0.0.1:5173"
    )

    SEED_DEMO_DATA: bool = True

    # JWT settings
    JWT_SECRET_KEY: str = "changeme-very-secret-key"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 1440  # 24 hours

    @property
    def database_url(self) -> str:
        return self.DATABASE_URL

    @property
    def cors_origin_list(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.CORS_ORIGINS.split(",")
            if origin.strip()
        ]


settings = Settings()
