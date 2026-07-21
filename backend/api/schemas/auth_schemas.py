from pydantic import BaseModel , Field 


# Schemas for authentication - recieved from client for login
class LoginRequest(BaseModel):
    username: str = Field(..., description="Username of the user, e.g., johndoe")
    password: str = Field(..., description="Password of the user, e.g., securepassword123")


# Schemas for authentication - sent to client after successful login
class LoginResponse(BaseModel):
    access_token: str = Field(..., description="JWT access token, e.g., eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    token_type: str = Field(..., description="Type of the token, e.g., bearer")

# Schema used to return the user after succesful authentication
class User(BaseModel):
    id:int
    username:str
    email: str
    first_name:str
    last_name:str

class Token(BaseModel):
    access_token:str
    token_type:str

class TokenData(BaseModel):
    username:str | None = None

