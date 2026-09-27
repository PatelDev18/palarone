from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Phase 43: Database
    DATABASE_URL: str = "postgresql://polar:polar_password@localhost:5432/polarone"
    
    # Phase 44: Authentication
    SECRET_KEY: str = "super-secret-key-phase-44-polarone"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # Phase 45-47: External Providers
    OPEN_METEO_URL: str = "https://api.open-meteo.com/v1/forecast"
    STAC_API_URL: str = "https://earth-search.aws.element84.com/v1"
    
    class Config:
        env_file = ".env"

settings = Settings()
