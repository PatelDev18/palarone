import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from loguru import logger
from .models import Base

# Default to a local PostgreSQL if env var is missing
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:postgres@localhost:5432/polarone"
)

try:
    engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=False, pool_pre_ping=True)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    logger.info("Successfully configured PostgreSQL engine.")
except Exception as e:
    engine = None
    SessionLocal = None
    logger.warning(f"Database engine unavailable, continuing in synthetic/offline mode: {e}")

def get_db():
    if SessionLocal is None:
        yield None
        return
    try:
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()
    except Exception as e:
        logger.warning(f"Database connection error, falling back to synthetic data: {e}")
        yield None

def init_db():
    """
    Creates all tables if DB is available. In a real production scenario, Alembic migrations should be used.
    Requires PostGIS extension to be enabled on the Postgres database.
    """
    if engine is None:
        logger.warning("Database engine is not configured; running in synthetic/offline mode.")
        return
    try:
        logger.info("Creating database tables (if they don't exist)...")
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully.")
    except Exception as e:
        logger.warning(f"Database initialization skipped (running in offline/synthetic mode): {e}")

