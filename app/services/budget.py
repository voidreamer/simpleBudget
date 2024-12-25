from sqlalchemy.orm import Session
from ..models import budget as models
from ..schemas import budget as schemas
from fastapi import HTTPException
from datetime import datetime


def create_category(db: Session, category: schemas.CategoryCreate):
    db_category = models.Category(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


def get_categories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Category).offset(skip).limit(limit).all()


def create_subcategory(db: Session, subcategory: schemas.SubcategoryCreate):
    db_subcategory = models.Subcategory(**subcategory.dict())
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
    # Implementation for getting monthly budget summary
    start_date = datetime(year, month, 1)
    if month == 12:
        end_date = datetime(year + 1, 1, 1)
    else:
        end_date = datetime(year, month + 1, 1)

    categories = db.query(models.Category).all()
    summary = []

    for category in categories:
        category_data = {
            "name": category.name,
            "budget": category.budget,
            "allotted": 0,
            "spending": 0,
            "subcategories": []
        }

        for subcategory in category.subcategories:
            subcategory_spending = sum(
                t.amount for t in subcategory.transactions
                if start_date <= t.date < end_date
            )

            category_data["subcategories"].append({
                "name": subcategory.name,
                "allotted": subcategory.allotted,
                "spending": subcategory_spending
            })

            category_data["allotted"] += subcategory.allotted
            category_data["spending"] += subcategory_spending

        summary.append(category_data)

    return summary
