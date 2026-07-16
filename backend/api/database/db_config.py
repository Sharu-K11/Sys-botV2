from typing import Annotated

from fastapi import Depends
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker,DeclarativeBase

# I copied this from the SQLAlchemy documentation.
#  It is a common pattern for setting up a database connection and session management in a Python application using SQLAlchemy.
SQLALCHEMY_DATABASE_URL = "sqlite:///./sysbot.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Model_Base(DeclarativeBase):
    pass

def get_db():
    with SessionLocal() as db:
        yield db


SessioDep = Annotated[Session, Depends(get_db)]