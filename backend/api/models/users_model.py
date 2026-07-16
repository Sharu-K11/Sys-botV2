from datetime import datetime, timezone

from api.database.db_config import Model_Base
from enum import Enum

from sqlalchemy.orm import mapped_column, relationship, Mapped
from sqlalchemy import Integer, String, ForeignKey, Text, DateTime
from sqlalchemy import Enum as SqlEnum


class UserStanding(str,Enum):
    NONE = "None"
    FRESHMAN = "Freshman"
    SOPHOMORE = "Sophomore"
    JUNIOR = "Junior"
    SENIOR = "Senior"


# user model with relationships to chat sessions and messages
class UserModel(Model_Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    first_name: Mapped[str] = mapped_column(String(50))
    last_name: Mapped[str] = mapped_column(String(50))
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(128))
    school: Mapped[str | None] = mapped_column(String(100), nullable=True)
    standing: Mapped[UserStanding | None] = mapped_column(
        SqlEnum(
            UserStanding,
            name="user_standing",
            native_enum=False,
            create_constraint=True,
        ),
        nullable=True,
        default=UserStanding.NONE,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    chats: Mapped[list["ChatSessionModel"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    messages: Mapped[list["MessageModel"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    feedbacks:Mapped[list["FeedbackModel"]] = relationship(
        back_populates="user",cascade="all , delete-orphan"
    )


class ChatSessionModel(Model_Base):
    __tablename__ = "chats"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(250))
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=False
    )
    user: Mapped["UserModel"] = relationship(back_populates="chats")
    messages: Mapped[list["MessageModel"]] = relationship(
        back_populates="chat", cascade="all, delete-orphan"
    )


class MessageModel(Model_Base):
    __tablename__ = "messages"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    chat_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("chats.id"), nullable=False
    )
    chat: Mapped["ChatSessionModel"] = relationship(back_populates="messages")
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=False
    )
    user: Mapped["UserModel"] = relationship(back_populates="messages")
    content: Mapped[str] = mapped_column(Text, nullable=False)


class FeedbackModel(Model_Base):
    __tablename__ = "feedbacks"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=False
    )
    user: Mapped["UserModel"] = relationship(back_populates="feedbacks")
    
    content: Mapped[str] = mapped_column(Text(500), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
