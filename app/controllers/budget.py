# controllers/budget.py
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, extract
from sqlalchemy.orm import Session
from typing import List, Union

from .. import models
from ..database import SessionLocal
from ..schemas import budget as schemas
from ..services import budget as service

router = APIRouter()


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/categories/", response_model=schemas.Category)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    return service.create_category(db, category)


@router.get("/categories/", response_model=List[schemas.Category])
def read_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    print("Categories from DB:", db.query(models.Category).all())  # Debug
    return service.get_categories(db, skip=skip, limit=limit)


@router.post("/subcategories/", response_model=schemas.Subcategory)
def create_subcategory(subcategory: schemas.SubcategoryCreate, db: Session = Depends(get_db)):
    return service.create_subcategory(db, subcategory)


@router.post("/transactions/", response_model=schemas.Transaction)
def create_transaction(transaction: schemas.TransactionCreate, db: Session = Depends(get_db)):
    return service.create_transaction(db, transaction)


def month_to_number(month: str) -> int:
    try:
        return datetime.strptime(month, '%B').month
    except ValueError:
        raise HTTPException(status_code=422, detail=f"Invalid month name: {month}")


@router.get("/budget-summary/{year}/{month}")
def get_budget_summary(year: int, month: Union[str, int], db: Session = Depends(get_db)):
    month_num = month_to_number(month) if isinstance(month, str) else month

    categories = db.query(models.Category).filter(
        models.Category.year == year,
        models.Category.month == month_num
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
            spending = db.query(func.sum(models.Transaction.amount)). \
                           filter(models.Transaction.subcategory_id == subcategory.id). \
                           scalar() or 0.0
            subcategory_data = {
                "id": subcategory.id,
                "name": subcategory.name,
                "allotted": subcategory.allotted,
                "spending": float(spending)
            }
            category_data["subcategories"].append(subcategory_data)

        result.append(category_data)

    return result

@router.delete("/categories/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db)):
    print(f'deleting {category_id}')
    category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    # Delete cascading relationships
    for subcategory in category.subcategories:
        db.query(models.Transaction).filter(models.Transaction.subcategory_id == subcategory.id).delete()
    db.query(models.Subcategory).filter(models.Subcategory.category_id == category_id).delete()

    db.delete(category)
    db.commit()
    return {"status": "success"}


@router.delete("/subcategories/{subcategory_id}")
def delete_subcategory(subcategory_id: int, db: Session = Depends(get_db)):
    subcategory = db.query(models.Subcategory).filter(models.Subcategory.id == subcategory_id).first()
    if not subcategory:
        raise HTTPException(status_code=404, detail="Subcategory not found")

    # Delete associated transactions first
    db.query(models.Transaction).filter(models.Transaction.subcategory_id == subcategory_id).delete()
    db.delete(subcategory)
    db.commit()
    return {"status": "success"}


@router.put("/subcategories/{subcategory_id}")
def update_subcategory(subcategory_id: int, data: dict, db: Session = Depends(get_db)):
    print(f"Updating subcategory {subcategory_id} with data:", data)  # Debug
    subcategory = db.query(models.Subcategory).filter(models.Subcategory.id == subcategory_id).first()
    if not subcategory:
        raise HTTPException(status_code=404, detail="Subcategory not found")

    if 'allotted' in data:
        subcategory.allotted = data['allotted']

    db.commit()
    return subcategory
