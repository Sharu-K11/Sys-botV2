from fastapi import APIRouter

from api.routers.home_router import router as home_router
from api.routers.auth_router import router as auth_router
from api.routers.users_routers import router as users_router
from api.routers.chats_router import router as chats_router

router = APIRouter(prefix="/api")

router.include_router(home_router)
router.include_router(auth_router)
router.include_router(users_router)
router.include_router(chats_router)



