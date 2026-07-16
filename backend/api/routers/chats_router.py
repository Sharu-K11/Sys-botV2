from api.models.users_model import UserModel, ChatSessionModel, MessageModel
from api.schemas.chats_schemas import (
    CreateChatRequest,
    UpdateChatRequest,
    CreateChatResponse,
)
from api.schemas.users_schemas import UserRegistrationRequest

from random import randint
from api.database.db_config import SessioDep

from fastapi import APIRouter, HTTPException, status

from sqlalchemy import select

router = APIRouter(prefix="/chats", tags=["Chats"])


@router.get("/")
def chat_health():
    return {"Chat health": "ok"}


# Build this and move to services folder
def get_title_ai(messages: str):
    num = randint(0, 10)
    return f"Chat Title {num}"

# check whoos the users
@router.post("/create-chat", status_code=status.HTTP_201_CREATED)
def create_chat(request: CreateChatRequest, db: SessioDep):
    # Call a service here to get a title for this chat
    first_message = request.first_message  # Save this inse the message
    title = get_title_ai(first_message)
    model = ChatSessionModel(title=title, user_id=1)
    db.add(model)
    db.commit()
    db.refresh(model)
    return model  # Pydantic will convert sql clachamy model

# Check the whose the user
@router.put("/{chat_id}", response_model=CreateChatResponse)
def update_chat(chat_id: int, request: UpdateChatRequest, db: SessioDep):
    chat = db.get(ChatSessionModel, chat_id)
    if chat is None:
        raise HTTPException(status_code=404, detail="chat not found")
    chat.title = request.title

    db.commit()
    db.refresh(chat)

    return chat

#check whos is the user
@router.delete("/{chat_id}")
def delete_chat(chat_id: int, db: SessioDep):
    chat = db.get(ChatSessionModel, chat_id)
    if chat is None:
        raise HTTPException(status_code=404, detail="Chat not found")
    db.delete(chat)
    db.commit()
