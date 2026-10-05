"""Application configuration, loaded from environment variables / backend/.env.

Every setting can be overridden with a real environment variable, which makes
this easy to test in CI or deploy to a host with a real environment.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",  # relative to the folder you run uvicorn from (backend/)
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # --- MySQL connection ---
    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    DB_USER: str = "root"
    DB_PASSWORD: str = ""
    DB_NAME: str = "event_management"

    # Comma-separated list of origins allowed to call the API from a browser.
    # Both localhost and 127.0.0.1 are included by default because they are
    # different origins to a browser and the dev server may use either.
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"

    # Set to false to skip inserting the demo events on first run.
    SEED_DEMO_DATA: bool = True

    @property
    def database_url(self) -> str:
        """SQLAlchemy connection string: mysql+pymysql://USER:PASSWORD@HOST:PORT/DB_NAME"""
        return (
            f"mysql+pymysql://{self.DB_USER}:{self.DB_PASSWORD}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )

    @property
    def cors_origin_list(self) -> list[str]:
        """Turn CORS_ORIGINS into a list, e.g. 'http://a,http://b' -> ['http://a', 'http://b']."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


settings = Settings()
