from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    username: str = ""
    role: str = "user"

class UserPublic(BaseModel):
    id: int
    username: Optional[str] = None
    email: str

    class Config:
        from_attributes = True

class User(UserBase):
    id: int
    username: Optional[str] = None
    role: str

    class Config:
        from_attributes = True

# --- Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# --- Bid Schemas ---
class BidBase(BaseModel):
    amount: float

class BidCreate(BidBase):
    product_id: int

class Bid(BidBase):
    id: int
    timestamp: datetime
    status: str
    buyer_id: int
    product_id: int
    buyer: Optional[UserPublic] = None

    class Config:
        from_attributes = True

# --- Product Schemas ---
class ProductBase(BaseModel):
    title: str
    description: str = ""
    image_url: str
    base_price: float
    category: str = "Uncategorized"

class ProductCreate(ProductBase):
    duration_hours: float = 24.0

class ProductUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    base_price: Optional[float] = None
    category: Optional[str] = None

class Product(ProductBase):
    id: int
    seller_id: int
    end_time: datetime
    is_active: bool
    bids: List[Bid] = []
    seller: Optional[UserPublic] = None

    class Config:
        from_attributes = True

# --- Notification Schemas ---
class NotificationBase(BaseModel):
    message: str

class Notification(NotificationBase):
    id: int
    is_read: bool
    timestamp: datetime
    user_id: int

    class Config:
        from_attributes = True
