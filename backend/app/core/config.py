from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = Field(default="OCUPA API", validation_alias="OCUPA_APP_NAME")
    app_environment: str = Field(default="development", validation_alias="OCUPA_ENVIRONMENT")
    debug: bool = Field(default=False, validation_alias="OCUPA_DEBUG")
    database_url: str = Field(
        default="postgresql+asyncpg://ocupa:ocupa@localhost:5432/ocupa",
        description="SQLAlchemy async PostgreSQL URL",
    )
    jwt_secret: str = Field(min_length=32, validation_alias="JWT_SECRET")
    jwt_algorithm: str = Field(default="HS256", validation_alias="JWT_ALGORITHM")
    access_token_expire_minutes: int = Field(
        default=60, ge=1, validation_alias="ACCESS_TOKEN_EXPIRE_MINUTES"
    )
    cors_origins: str = Field(
        default="http://localhost:3000,http://localhost:5173",
        validation_alias="CORS_ORIGINS",
    )

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    model_config = SettingsConfigDict(
        env_file=(".env", "backend/.env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
