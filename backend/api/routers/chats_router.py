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


from api.database.db_config import SessioDep

from fastapi import APIRouter, Depends, HTTPException, status


router = APIRouter(prefix="/chats", tags=["Chats"])


@router.get("/health")
def chat_health():
    return {"Chat health": "ok"}


@router.get("/", response_model=list[ListChatsResponse])
async def list_chats(db: SessioDep, current_user: Annotated[UserModel, Depends(get_current_user)]):
    statement = (
        select(ChatSessionModel)
        .where(ChatSessionModel.user_id == current_user.id)
        .order_by(ChatSessionModel.id.desc())
    )
    return (await db.execute(statement)).scalars().all()


# Build this and move to services folder
def get_title_ai(messages: str):
    title = " ".join(messages.strip().split())
    return title if len(title) <= 60 else f"{title[:57].rstrip()}..."


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
@router.delete("/{chat_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_chat(chat_id: int, db: SessioDep, current_user: Annotated[UserModel, Depends(get_current_user)]):
    chat = await db.get(ChatSessionModel, chat_id)
    if chat is None:
        raise HTTPException(status_code=404, detail="Chat not found")
    if chat.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not have permission to delete this chat")
    await db.delete(chat)
    await db.commit()


@router.post("/{chat_id}/messages", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def create_message(chat_id: int, request: MessageRequest, db: SessioDep, current_user: Annotated[UserModel, Depends(get_current_user)]):
    chat_model = await db.get(ChatSessionModel, chat_id)
    if chat_model is None:
        raise HTTPException(status_code=404, detail="Chat Not Found")
    if chat_model.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not have permission to update this chat")
    msg_model = MessageModel(content=request.content, chat=chat_model, user_id=current_user.id)
    db.add(msg_model)
    await db.commit()
    await db.refresh(msg_model)
    return msg_model


@router.get("/{chat_id}/messages", response_model=list[MessageResponse])
async def list_messages(chat_id: int, db: SessioDep, current_user: Annotated[UserModel, Depends(get_current_user)]):
    chat_model = await db.get(ChatSessionModel, chat_id)
    if chat_model is None:
        raise HTTPException(status_code=404, detail=" Chat Not Found")
    if chat_model.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not have permission to view this chat")
    statement = (
        select(MessageModel)
        .where(MessageModel.chat_id == chat_id)
        .order_by(MessageModel.id)
    )
    return (await db.execute(statement)).scalars().all()
