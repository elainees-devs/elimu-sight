from fastapi import FastAPI
from app.api.routes import router

app = FastAPI(title="ElimuSight AI Service")

app.include_router(router, prefix="/ai")