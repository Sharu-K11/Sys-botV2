from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import Session, sessionmaker,DeclarativeBase

# I copied this from the SQLAlchemy documentation.
#  It is a common pattern for setting up a database connection and session management in a Python application using SQLAlchemy.
SQLALCHEMY_DATABASE_URL =  "sqlite+aiosqlite:///./sysbot.db"

async_engine  = create_async_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False},echo= True # Optional : Logs all generated SQL queries
)
AsyncSessionLocal = async_sessionmaker(
    bind=async_engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

class Model_Base(DeclarativeBase):
    pass

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session


SessioDep = Annotated[AsyncSession, Depends(get_db)]