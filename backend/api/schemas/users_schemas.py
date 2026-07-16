from pydantic import BaseModel, Field
from api.models.users_model import UserStanding


class UserRegistrationRequest(BaseModel):
    first_name:str = Field( min_length=1,max_length=50, description="First name of the user, e.g., John")
    last_name:str = Field( min_length=1,max_length=50, description="Last name of the user, e.g., Doe")
    username:str =  Field(min_length=5 , max_length=50 , description="Username used for authentication")
    email:str = Field( min_length=5,max_length=100, description="Email address of the user, e.g., johndoe@example.com")
    password:str = Field( min_length=8, max_length=128, description="Password for the user account, e.g., securepassword123")
    school:str | None = Field(None, description = "School of the user, e.g., XYZ University , It's optional")
    standing:UserStanding  = Field(default=UserStanding.NONE ,description = "Academic standing of the user, e.g., Sophomore , It's optional")