from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import engine, Base, SessionLocal
from routers import auth, products, bids, notifications
import models
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
import logging
import shutil
import uuid
import os

# Create db tables
Base.metadata.create_all(bind=engine)

# Ensure uploads directory exists
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "static", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI(title="Bidding API")

# Serve uploaded images as static files
app.mount("/static", StaticFiles(directory=os.path.join(os.path.dirname(__file__), "static")), name="static")

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(bids.router)
app.include_router(notifications.router)

@app.post("/api/upload")
async def upload_image(file: UploadFile = File(...)):
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if file.content_type not in allowed_types:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, WebP, and GIF images are allowed.")
    
    ext = file.filename.rsplit(".", 1)[-1].lower()
    filename = f"{uuid.uuid4().hex}.{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"url": f"http://localhost:8000/static/uploads/{filename}"}

# --- Automation Task ---
def auto_accept_bids():
    # logging.info("Running auto-accept job...")
    db = SessionLocal()
    try:
        # Find active products whose end time has passed
        expired_products = db.query(models.Product).filter(
            models.Product.is_active == True,
            models.Product.end_time <= datetime.utcnow()
        ).all()

        for product in expired_products:
            # Find highest bid
            highest_bid = db.query(models.Bid).filter(models.Bid.product_id == product.id).order_by(models.Bid.amount.desc()).first()
            if highest_bid:
                highest_bid.status = "accepted"
                # Reject others
                other_bids = db.query(models.Bid).filter(models.Bid.product_id == product.id, models.Bid.id != highest_bid.id).all()
                for ob in other_bids:
                    ob.status = "rejected"
                
                # Notify Seller
                msg_seller = f"Your auction for '{product.title}' has ended. Highest bid of ${highest_bid.amount} was automatically accepted."
                db.add(models.Notification(message=msg_seller, user_id=product.seller_id))
                
                # Notify Buyer
                msg_buyer = f"Congratulations! You won the auction for '{product.title}' with a bid of ${highest_bid.amount}."
                db.add(models.Notification(message=msg_buyer, user_id=highest_bid.buyer_id))
            
            product.is_active = False
            db.commit()
    except Exception as e:
        print(f"Error in auto_accept_bids: {e}")
    finally:
        db.close()

# Scheduler setup
scheduler = BackgroundScheduler()
scheduler.add_job(auto_accept_bids, 'interval', minutes=1)
scheduler.start()

@app.on_event("shutdown")
def shutdown_event():
    scheduler.shutdown()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Bidding API"}
