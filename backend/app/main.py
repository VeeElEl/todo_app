from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel

from .core.database import engine
from .routers import auth, tasks

app = FastAPI(title="Todo API")

# --- CORS -----------------------------------------------------------------
origins = [
    "http://localhost:5173",   # TODO: потом сделать лучше
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# --------------------------------------------------------------------------


# создаём таблицы при первом старте
@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

# ping из прошлой версии оставим
@app.get("/ping")
async def ping():
    return {"message": "pong"}

# подключаем роутеры
app.include_router(auth.router)
app.include_router(tasks.router)
