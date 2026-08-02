from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Base URLs
    FRONTEND_URL: str = "http://localhost:5173"
    BACKEND_URL: str = "http://localhost:8000"
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"

    # OAuth Settings
    GITHUB_CLIENT_ID: str = ""
    GITHUB_CLIENT_SECRET: str = ""
    GITHUB_CALLBACK_URL: Optional[str] = None

    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_CALLBACK_URL: Optional[str] = None

    # Email & Communications
    RESEND_API_KEY: str = ""
    EMAIL_FROM: str = "noreply@solvane.io"

    # Database & Security
    DATABASE_URL: str = "postgresql://solvane_user:solvane_password@localhost:5432/solvane_db"
    JWT_SECRET: str = "super-secret-jwt-signing-key-replace-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    EMAIL_VERIFY_EXPIRE_HOURS: int = 24
    PASSWORD_RESET_EXPIRE_HOURS: int = 1

    model_config = SettingsConfigDict(
        env_file=(".env", ".env.local"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def allowed_origins_list(self) -> List[str]:
        origins = [origin.strip().rstrip('/') for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]
        if self.FRONTEND_URL:
            clean_frontend = self.FRONTEND_URL.strip().rstrip('/')
            if clean_frontend not in origins:
                origins.append(clean_frontend)
        return origins

    @property
    def get_github_callback_url(self) -> str:
        if self.GITHUB_CALLBACK_URL:
            return self.GITHUB_CALLBACK_URL
        return f"{self.BACKEND_URL.rstrip('/')}/api/auth/callback/github"

    @property
    def get_google_callback_url(self) -> str:
        if self.GOOGLE_CALLBACK_URL:
            return self.GOOGLE_CALLBACK_URL
        return f"{self.BACKEND_URL.rstrip('/')}/api/auth/callback/google"

settings = Settings()
