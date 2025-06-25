from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr

##### AUTH #####
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    email: str | None = None

##### USER #####
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserRead(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime

##### TASK #####
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    is_done: bool = False

class TaskCreate(TaskBase):
    pass

class TaskRead(TaskBase):
    id: int
    created_at: datetime
