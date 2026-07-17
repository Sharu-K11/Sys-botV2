from pydantic import BaseModel, ConfigDict, Field


class CreateChatRequest(BaseModel):
    first_message : str = Field(min_length=1)


class UpdateChatRequest(BaseModel):
    title:str = Field(min_length=1,max_length=250)


class CreateChatResponse(BaseModel):
    id:int
    title:str

class ListChatsResponse(BaseModel):
    id:int
    title:str

    model_config = ConfigDict(from_attributes=True)

class MessageRequest(BaseModel):
    content:str

class MessageResponse(BaseModel):
    id:int
    char_id:int
    user_id:int
    content:str

    model_config = ConfigDict(from_attributes=True)