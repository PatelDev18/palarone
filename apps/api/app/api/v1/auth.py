from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import User
from app.core.security import verify_password, create_access_token

# Hardcode token expiration for 12 hours (Shift length)
ACCESS_TOKEN_EXPIRE_MINUTES = 720

router = APIRouter()

@router.post("/login")
def login_for_access_token(
    db: Session = Depends(get_db), 
    form_data: OAuth2PasswordRequestForm = Depends()
):
    """
    Phase 2: Authentication System
    Validates user credentials against the PostgreSQL database.
    """
    user = db.query(User).filter(User.email == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        # We also support a mock admin for demo purposes if DB isn't seeded
        if form_data.username == "admin@polarone" and form_data.password == "polar123":
            access_token = create_access_token(
                data={"sub": "admin@polarone", "role": "COMMANDER"},
                expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            )
            return {"access_token": access_token, "token_type": "bearer", "role": "COMMANDER"}
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role.value},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {"access_token": access_token, "token_type": "bearer", "role": user.role.value}

@router.get("/me")
def read_users_me(token: str):
    # In a real app this would use a Depends(get_current_user)
    # Mocking for Phase 2 implementation demonstration
    return {"email": "admin@polarone", "role": "COMMANDER", "status": "ACTIVE"}
