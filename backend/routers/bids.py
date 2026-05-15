from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models, schemas, auth
from datetime import datetime

from typing import List

router = APIRouter(prefix="/api/bids", tags=["bids"])

@router.get("/me", response_model=List[schemas.Bid])
def get_my_bids(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Bid).filter(models.Bid.buyer_id == current_user.id).all()

@router.post("/", response_model=schemas.Bid)
def place_bid(bid: schemas.BidCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    product = db.query(models.Product).filter(models.Product.id == bid.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if not product.is_active or product.end_time < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Auction is already closed")
    
    # Check if user is the seller
    if product.seller_id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot bid on your own item")

    # Check if bid is higher than current highest bid or base price
    highest_bid = db.query(models.Bid).filter(models.Bid.product_id == bid.product_id).order_by(models.Bid.amount.desc()).first()
    min_amount = highest_bid.amount if highest_bid else product.base_price
    if bid.amount <= min_amount:
        raise HTTPException(status_code=400, detail=f"Bid must be higher than {min_amount}")

    new_bid = models.Bid(amount=bid.amount, product_id=bid.product_id, buyer_id=current_user.id)
    db.add(new_bid)

    # Create notification for seller
    notification_msg = f"New bid of ${bid.amount} placed on your product '{product.title}' by {current_user.email}."
    notification = models.Notification(message=notification_msg, user_id=product.seller_id)
    db.add(notification)

    db.commit()
    db.refresh(new_bid)
    return new_bid

@router.post("/{bid_id}/accept", response_model=schemas.Bid)
def accept_bid(bid_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    bid = db.query(models.Bid).filter(models.Bid.id == bid_id).first()
    if not bid:
        raise HTTPException(status_code=404, detail="Bid not found")
    
    product = db.query(models.Product).filter(models.Product.id == bid.product_id).first()
    if product.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to accept this bid")
    if not product.is_active:
        raise HTTPException(status_code=400, detail="Auction is already closed")

    # Accept this bid, reject others
    bid.status = "accepted"
    product.is_active = False

    other_bids = db.query(models.Bid).filter(models.Bid.product_id == product.id, models.Bid.id != bid_id).all()
    for ob in other_bids:
        ob.status = "rejected"
    
    db.commit()
    db.refresh(bid)
    return bid
