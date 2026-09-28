from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings
from loguru import logger

Base = declarative_base()

# Resilient Database Engine: attempts PostgreSQL, then local SQLite fallback
try:
    engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
except Exception as e:
    logger.warning(f"PostgreSQL connection unavailable ({e}), initializing local sqlite fallback.")
    try:
        engine = create_engine("sqlite:///./polarone.db", connect_args={"check_same_thread": False})
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    except Exception as sqle:
        logger.error(f"Failed to initialize database session: {sqle}")
        engine = None
        SessionLocal = None

def get_db():
    if SessionLocal is None:
        yield None
        return
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
