from fastapi import FastAPI
from scalar_fastapi import get_scalar_api_reference
from api.routers._routers import router
from fastapi.middleware.cors import CORSMiddleware


from api.database.db_config import async_engine ,Model_Base

app = FastAPI()

app.include_router(router)

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# This load the models to the SQLAlchemy to create the table
# Model_Base.metadata.create_all(bind=engine) : alembic will handle the table creation and migration, so this line is commented out to avoid conflicts.



@app.get("/health")
def _health():
    return {"status": "ok"}

@app.get("/scalar", include_in_schema=False)
async def scalar_html():
    return get_scalar_api_reference(
        openapi_url=app.openapi_url,
        title="My Modern API Specs",
    )