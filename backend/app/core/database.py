from sqlmodel import SQLModel, create_engine, Session
from .config import DATABASE_URL

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}  # sqlite only
)

def get_session():
    with Session(engine) as session:
        yield session
