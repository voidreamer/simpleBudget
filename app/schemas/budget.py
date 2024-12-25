from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class TransactionBase(BaseModel):
    description: str
    amount: float
    date: Optional[datetime] = None

class TransactionCreate(TransactionBase):
    subcategory_id: int

class Transaction(TransactionBase):
    id: int
    subcategory_id: int

    class Config:
        from_attributes = True

class SubcategoryBase(BaseModel):
    name: str
    allotted: float

class SubcategoryCreate(SubcategoryBase):
    category_id: int

class Subcategory(SubcategoryBase):
    id: int
    category_id: int
    transactions: List[Transaction] = []

    class Config:
        from_attributes = True

class CategoryBase(BaseModel):
    name: str
    budget: float

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    subcategories: List[Subcategory] = []

    class Config:
        from_attributes = True
