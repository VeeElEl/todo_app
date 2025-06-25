from fastapi import FastAPI
from sqlmodel import SQLModel

from .core.database import engine
from .routers import auth, tasks

app = FastAPI(title="Todo API")

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
