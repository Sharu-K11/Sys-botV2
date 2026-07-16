from fastapi import APIRouter
from api.schemas.auth_schemas import LoginRequest, LoginResponse


router = APIRouter(prefix="/auth", tags=["auth"])

# Authentication endpoint for user login
@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    return {"access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", "token_type": "bearer"}