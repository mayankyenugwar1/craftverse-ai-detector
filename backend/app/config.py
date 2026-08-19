import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

# Resolve absolute path to backend/.env and root .env
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_env = os.path.abspath(os.path.join(current_dir, "..", ".env"))
root_env = os.path.abspath(os.path.join(current_dir, "..", "..", ".env"))

env_files = [f for f in [".env", backend_env, root_env] if os.path.exists(f)]

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
    FRONTEND_ORIGIN: str = ""

    model_config = SettingsConfigDict(
        env_file=tuple(env_files) if env_files else ".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
