from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    DATABASE_URL: str = "postgresql+asyncpg://app:app@localhost:5432/app"
    MONGO_URL: str = "mongodb://localhost:27017/audit"


settings = Settings()
