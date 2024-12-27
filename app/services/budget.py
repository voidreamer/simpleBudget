from sqlalchemy.orm import Session
from ..models import budget as models
from ..schemas import budget as schemas
from fastapi import HTTPException
from datetime import datetime


def create_category(db: Session, category: schemas.CategoryCreate):
    current_date = datetime.now()
    db_category = models.Category(
        name=category.name,
        budget=category.budget,
        year=current_date.year,
        month=current_date.month,
        created_at=current_date
    )
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


def get_categories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Category).offset(skip).limit(limit).all()


def create_subcategory(db: Session, subcategory: schemas.SubcategoryCreate):
    db_subcategory = models.Subcategory(
        name=subcategory.name,
        allotted=subcategory.allotted,
        category_id=subcategory.category_id,
        created_at=datetime.now()
    )
    db.add(db_subcategory)
    db.commit()
    db.refresh(db_subcategory)
    return db_subcategory


def create_transaction(db: Session, transaction: schemas.TransactionCreate):
    db_transaction = models.Transaction(**transaction.dict())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction


def get_budget_summary(db: Session, year: int, month: int):
    """Get budget summary with categories, subcategories and transactions."""
    categories = db.query(models.Category).filter(
        models.Category.year == year,
        models.Category.month == month
    ).all()

    result = []
    for category in categories:
        category_data = {
            "id": category.id,
            "name": category.name,
            "budget": category.budget,
            "subcategories": []
        }

        for subcategory in category.subcategories:
            # Get transactions and total spending
            transactions = db.query(models.Transaction).filter(
                models.Transaction.subcategory_id == subcategory.id
            ).all()

            spending = sum(t.amount for t in transactions)

            subcategory_data = {
                "id": subcategory.id,
                "name": subcategory.name,
                "allotted": subcategory.allotted,
                "spending": float(spending),
                "transactions": [{
                    "id": t.id,
                    "description": t.description,
                    "amount": float(t.amount),
                    "date": t.date.isoformat()
                } for t in transactions]
            }
            category_data["subcategories"].append(subcategory_data)

        result.append(category_data)

    return result
