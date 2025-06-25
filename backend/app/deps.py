from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlmodel import Session, select
from datetime import datetime

from .core.database import get_session
from .core.config import SECRET_KEY
from .core.security import ALGORITHM
from .schemas import TokenData
from .models import User

# Global object: registration of scheme in OpenAPI to Authorize
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# --- DB ----------------------------------------------------------------------------
def get_db():
    """Yields a SQLModel session"""
    yield from get_session()


# --- AUTH --------------------------------------------------------------------------
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    """Extracts user from JWT, raises 401 if invalid/expired"""
    credentials_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str | None = payload.get("sub")
        if email is None:
            raise credentials_exc
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exc

    user: User | None = db.exec(select(User).where(User.email == token_data.email)).first()
    if user is None:
        raise credentials_exc
    return user
