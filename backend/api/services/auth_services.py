from datetime import datetime , timezone , timedelta
from typing import Annotated

import jwt
from fastapi import Depends,FastAPI , HTTPException , status
from fastapi.security import OAuth2PasswordBearer , OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash
from pydantic import BaseModel

from dotenv import load_dotenv
import os

from api.schemas.auth_schemas import TokenData
from api.models.users_model import UserModel
from api.database.db_config import SessioDep


from sqlalchemy import select

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")

# generates secure, one-way password hashes
password_hash = PasswordHash.recommended()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token/login")

def get_password_hash(password:str):
    return password_hash.hash(password)


def verify_password(plain_password,hashed_password):
    return password_hash.verify(plain_password, hashed_password)



def create_access_token(data:dict , expires_delta:timedelta|None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else :
        expire =  datetime.now(timezone.utc) + timedelta(minutes=15)

    to_encode.update({"exp":expire})
    encoded_jwt = jwt.encode(to_encode ,SECRET_KEY,algorithm=ALGORITHM) # type: ignore
    return encoded_jwt


# Used for fist time login and obtaining the bearer
async def get_current_user(token:Annotated[str, Depends(oauth2_scheme)] , db:SessioDep):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=" Counld Not validate credential",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token , SECRET_KEY , algorithms= ALGORITHM) #type: ignore
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    
    statement = select(UserModel).where(UserModel.username == token_data.username)
    user = (await db.execute(statement)).scalar_one_or_none()
    if user is None:
        raise credentials_exception
    
    return user



