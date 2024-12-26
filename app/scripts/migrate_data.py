# app/scripts/migrate_data.py
import sys
from pathlib import Path

from sqlalchemy.orm import Session

from app import models

sys.path.append(str(Path(__file__).parent.parent.parent))

from app.database import engine, Base, SessionLocal
from app.models.budget import Category, Subcategory, Transaction
from app.utils.migration import convert_json_to_db_format


def migrate_data(json_file_path):
    # Create tables
    Base.metadata.create_all(bind=engine)

    # Convert JSON data
    data = convert_json_to_db_format(json_file_path)

    db = SessionLocal()
    try:
        # Insert categories
        for category_data in data['categories']:
            category = Category(**category_data)
            db.add(category)
        db.commit()

        # Insert subcategories
        for subcategory_data in data['subcategories']:
            subcategory = Subcategory(**subcategory_data)
            db.add(subcategory)
        db.commit()

        # Insert transactions
        for transaction_data in data['transactions']:
            transaction = Transaction(**transaction_data)
            db.add(transaction)
        db.commit()

    except Exception as e:
        print(f"Error during migration: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    old_budget_path = r"D:\Projects\Coding\budget_api\app\utils\budget.json"
    migrate_data(old_budget_path)


def verify_migration(db: Session):
    print("\nVerifying migration...")

    # Check categories
    categories = db.query(models.Category).all()
    print(f"\nFound {len(categories)} categories:")
    for cat in categories:
        print(f"\nCategory: {cat.name}")
        subcategories = db.query(models.Subcategory).filter(
            models.Subcategory.category_id == cat.id
        ).all()
        print(f"Subcategories for {cat.name}:")
        for sub in subcategories:
            print(f"  - {sub.name} Allotted: {sub.allotted})")


if __name__ == "__main__":
    path = r'D:\Projects\Coding\budget_api\app\utils\budget.json'
    migrate_data(path)
    db = SessionLocal()
    verify_migration(db)
    db.close()
