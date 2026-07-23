from typing import Annotated

from sqlalchemy import select

from api.models.users_model import UserModel, ChatSessionModel, MessageModel
from api.schemas.chats_schemas import (
    CreateChatRequest,
    UpdateChatRequest,
    CreateChatResponse,
    ListChatsResponse,
    MessageRequest,
    MessageResponse,
)
from api.services.auth_services import get_current_user


from random import randint
from api.database.db_config import SessioDep

from fastapi import APIRouter, Depends, HTTPException, status


router = APIRouter(prefix="/chats", tags=["Chats"])


@router.get("/health")
def chat_health():
    return {"Chat health": "ok"}


@router.get("/", response_model=list[ListChatsResponse])
def list_chats(db: SessioDep , current_user:Annotated[UserModel,Depends(get_current_user)]):
    # Need to setup the current user
    return current_user.chats


# Build this and move to services folder
def get_title_ai(messages: str):
    num = randint(0, 10)
    return f"Chat Title {num}"


@router.post(
    "/create-chat",
    response_model=CreateChatResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_chat(request: CreateChatRequest, db: SessioDep ,current_user:Annotated[UserModel,Depends(get_current_user)] ):
    title = get_title_ai(request.first_message)

    chat = ChatSessionModel(title=title, user_id=current_user.id)

    message = MessageModel(content=request.first_message, user_id=current_user.id)

    chat.messages.append(message)

    db.add(chat)
    await db.commit()
    await db.refresh(chat)

    return chat


# Check the whose the user
@router.put("/{chat_id}", response_model=CreateChatResponse)
async def update_chat(chat_id: int, request: UpdateChatRequest, db: SessioDep,current_user:Annotated[UserModel,Depends(get_current_user)]):
    chat = await db.get(ChatSessionModel, chat_id)
    if chat is None:
        raise HTTPException(status_code=404, detail="chat not found")
    
    if chat.user_id != current_user.id:
        raise HTTPException(status_code=401 ,detail="You do not have permission to update this chat"
)
    
    chat.title = request.title

    await db.commit()
    await db.refresh(chat)

    return chat


# check whos is the user
@router.delete("/{chat_id}")
async def delete_chat(chat_id: int, db: SessioDep):
    chat = await db.get(ChatSessionModel, chat_id)
    if chat is None:
        raise HTTPException(status_code=404, detail="Chat not found")
    await db.delete(chat)
    await db.commit()
    return {"Deleted": "SuccesFully"}


@router.post("/{chat_id}/messages")
async def create_message(chat_id: int, request: MessageRequest, db: SessioDep):
    chat_model = db.get(ChatSessionModel, chat_id)
    if chat_model is None:
        raise HTTPException(status_code=404, detail="Chat Not Found")
    msg_model = MessageModel(content=request.content, chat=chat_model, user_id=1)
    db.add(msg_model)
    await db.commit()
    await db.refresh(msg_model)
    return {"message": "Created succesfully"}


@router.get("/{chat_id}/messages", response_model=list[MessageResponse])
async def list_messages(chat_id: int, db: SessioDep):
    chat_model = await db.get(ChatSessionModel, chat_id)
    if chat_model is None:
        raise HTTPException(status_code=404, detail=" Chat Not Found")
    messages = chat_model.messages
    return messages
