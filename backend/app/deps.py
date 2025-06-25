from fastapi import Depends, HTTPException, status
from jose import JWTError, jwt
from sqlmodel import Session, select

from .core.database import get_session
from .core.security import ALGORITHM
from .core.config import SECRET_KEY
from .schemas import TokenData
from .models import User

from datetime import datetime

def get_db():
    yield from get_session()

def get_current_user(
    token: str = Depends(lambda: "OAuth2PasswordBearer stub"), 
    db: Session = Depends(get_db)
):
    from fastapi.security import OAuth2PasswordBearer  # импорт тут, чтобы не создавало циклы
    oauth_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
    token = oauth_scheme()
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = db.exec(select(User).where(User.email == token_data.email)).first()
    if user is None:
        raise credentials_exception
    return user
