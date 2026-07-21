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

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")

# generates secure, one-way password hashes
password_hash = PasswordHash.recommended()

def get_password_hash(password:str):
    return password_hash.hash(password)


def verify_password(plain_password,hashed_password):
    return password_hash.verify(plain_password, hashed_password)
