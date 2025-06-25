from fastapi import FastAPI

app = FastAPI(title="Todo API")

@app.get("/ping")
async def ping():
    return {"message": "pong"}
