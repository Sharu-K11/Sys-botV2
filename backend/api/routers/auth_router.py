from fastapi import APIRouter, HTTPException
from api.schemas.auth_schemas import LoginRequest, LoginResponse
from api.services.auth_services import  verify_password
from api.database.db_config import SessioDep
from sqlalchemy import select
from api.models.users_model import UserModel

router = APIRouter(prefix="/auth", tags=["auth"])

# Authentication endpoint for user login
@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest, db:SessioDep):
    plain_password = request.password
    username = (request.username).strip()
    statement = select(UserModel).where(UserModel.username == username)
    user = db.execute(statement).scalar_one_or_none()
    if (user is None):
        raise HTTPException( status_code  = 401,detail="UserName or Password Does Not exist")
    hashed_password = user.password_hash
    valid = verify_password(plain_password,hashed_password)
    return {"access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", "token_type": "bearer"}