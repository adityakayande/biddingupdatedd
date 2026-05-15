from database import SessionLocal, engine
import models
from auth import get_password_hash

def seed_db():
    db = SessionLocal()
    
    # Check if we already have users
    if db.query(models.User).first():
        print("Database already seeded!")
        return

    # Create User 1
    user1 = models.User(
        email="alice@example.com",
        hashed_password=get_password_hash("password123"),
        role="user"
    )
    db.add(user1)
    
    # Create User 2
    user2 = models.User(
        email="bob@example.com",
        hashed_password=get_password_hash("password123"),
        role="user"
    )
    db.add(user2)
    db.commit()
    db.refresh(user1)
    
    # Create a Product
    product = models.Product(
        title="Vintage Rolex Watch",
        description="A beautiful vintage Rolex from 1980.",
        image_url="https://rainbowthemes.net/themes/nuron/wp-content/uploads/2023/09/antiques-demo-product-09-768x768.jpg",
        base_price=5000.0,
        seller_id=user1.id,
        category="Watches"
    )
    db.add(product)
    db.commit()

    print("Database seeded successfully with 'alice@example.com' and 'bob@example.com' (password: password123)")
    db.close()

if __name__ == "__main__":
    models.Base.metadata.create_all(bind=engine)
    seed_db()
