from pydantic import BaseModel, Field


class CreateChatRequest(BaseModel):
    first_message : str = Field(min_length=1)


class UpdateChatRequest(BaseModel):
    title:str = Field(min_length=1,max_length=250)


class CreateChatResponse(BaseModel):
    id:int
    title:str