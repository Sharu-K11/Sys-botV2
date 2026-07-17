from api.models.users_model import UserModel, ChatSessionModel, MessageModel
from api.schemas.chats_schemas import (
    CreateChatRequest,
    UpdateChatRequest,
    CreateChatResponse,
    ListChatsResponse,
    MessageRequest,
    MessageResponse,
)

from random import randint
from api.database.db_config import SessioDep

from fastapi import APIRouter, HTTPException, status


router = APIRouter(prefix="/chats", tags=["Chats"])


@router.get("/health")
def chat_health():
    return {"Chat health": "ok"}


@router.get("/", response_model=list[ListChatsResponse])
def list_chats(db: SessioDep):
    # Need to setup the current user
    user_model = db.get(UserModel, 1)
    if user_model is None:
        raise HTTPException(status_code=404, detail="No Valid User")

    return user_model.chats


# Build this and move to services folder
def get_title_ai(messages: str):
    num = randint(0, 10)
    return f"Chat Title {num}"


@router.post(
    "/create-chat",
    response_model=CreateChatResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_chat(request: CreateChatRequest, db: SessioDep):
    title = get_title_ai(request.first_message)

    chat = ChatSessionModel(title=title, user_id=1)

    message = MessageModel(content=request.first_message, user_id=1)

    chat.messages.append(message)

    db.add(chat)
    db.commit()
    db.refresh(chat)

    return chat


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


# check whos is the user
@router.delete("/{chat_id}")
def delete_chat(chat_id: int, db: SessioDep):
    chat = db.get(ChatSessionModel, chat_id)
    if chat is None:
        raise HTTPException(status_code=404, detail="Chat not found")
    db.delete(chat)
    db.commit()
    return {"Deleted": "SuccesFully"}


@router.post("/{chat_id}/messages")
def create_message(chat_id: int, request: MessageRequest, db: SessioDep):
    chat_model = db.get(ChatSessionModel, chat_id)
    if chat_model is None:
        raise HTTPException(status_code=404, detail="Chat Not Found")
    msg_model = MessageModel(content=request.content, chat=chat_model, user_id=1)
    db.add(msg_model)
    db.commit()
    db.refresh(msg_model)
    return {"message": "Created succesfully"}


@router.get("/{chat_id}/messages", response_model=list[MessageResponse])
def list_messages(chat_id: int, db: SessioDep):
    chat_model = db.get(ChatSessionModel, chat_id)
    if chat_model is None:
        raise HTTPException(status_code=404, detail=" Chat Not Found")
    messages = chat_model.messages
    return messages
