from fastapi import APIRouter, HTTPException
from sqlalchemy import select

from api.schemas.users_schemas import UserRegistrationRequest
from api.models.users_model import UserModel
from api.database.db_config import SessioDep

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/register")
def register_user(request: UserRegistrationRequest, db: SessioDep):

    # check if username exists
    existing_user = db.execute(
        select(UserModel).where(UserModel.username == request.username)
    ).scalar_one_or_none()

    if (existing_user):
        raise HTTPException(
            status_code=400,
            detail= "Username Already Exist"
        )
    
    #check if email exist
    existing_email =  db.execute(select(UserModel).where(UserModel.email == request.email)).scalar_one_or_none()
    if (existing_email):
        raise HTTPException (
            status_code=400,
            detail="Email Already Exist"
        )

    #Creating a new user
    new_user = UserModel(**request.model_dump(exclude={"password"}))
    new_user.password_hash= "Hashed password"


    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "user": {
            "id": new_user.id,
            "username": new_user.username,
            "email": new_user.email,
            "password":new_user.password_hash,
            "school": new_user.school,
            "standing": new_user.standing
        }
    }