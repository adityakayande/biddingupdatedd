from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timedelta
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="user") # unified user

    products = relationship("Product", back_populates="seller")
    bids = relationship("Bid", back_populates="buyer")
    notifications = relationship("Notification", back_populates="user")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    image_url = Column(String)
    base_price = Column(Float)
    seller_id = Column(Integer, ForeignKey("users.id"))
    end_time = Column(DateTime, default=lambda: datetime.utcnow() + timedelta(hours=24))
    is_active = Column(Boolean, default=True)
    category = Column(String, default="Uncategorized")

    seller = relationship("User", back_populates="products")
    bids = relationship("Bid", back_populates="product")


class Bid(Base):
    __tablename__ = "bids"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="pending") # pending, accepted, rejected
    
    product_id = Column(Integer, ForeignKey("products.id"))
    buyer_id = Column(Integer, ForeignKey("users.id"))

    product = relationship("Product", back_populates="bids")
    buyer = relationship("User", back_populates="bids")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    message = Column(String)
    is_read = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="notifications")
