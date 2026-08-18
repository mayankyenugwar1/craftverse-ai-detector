from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    DEMO_MODE: bool = True
    DETECTION_PROVIDER: str = "mock"
    CLAUDE_API_KEY: str = ""
    SIGHTENGINE_API_USER: str = ""
    SIGHTENGINE_API_SECRET: str = ""
    HIVE_API_KEY: str = ""
    MAX_FILE_SIZE: int = 200 * 1024 * 1024
    UPLOAD_DIR: str = "uploads"
    REPORTS_DIR: str = "reports"
    DATA_DIR: str = "data"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
