from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from .config import settings

# Fallback to SQLite if PostgreSQL is not running locally for development/testing convenience
db_url = settings.DATABASE_URL
if db_url.startswith("postgresql"):
    engine = create_engine(db_url, pool_pre_ping=True)
else:
    engine = create_engine(db_url, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
