# models/budget.py
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from ..database import Base
from datetime import datetime


# models/budget.py
class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, autoincrement=True)  # Changed this
    name = Column(String)
    budget = Column(Float)
    year = Column(Integer)
    month = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    subcategories = relationship("Subcategory", back_populates="category")

class Subcategory(Base):
    __tablename__ = "subcategories"
    id = Column(Integer, primary_key=True, autoincrement=True)  # Changed this
    name = Column(String)
    allotted = Column(Float)
    category_id = Column(Integer, ForeignKey("categories.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    category = relationship("Category", back_populates="subcategories")
    transactions = relationship("Transaction", back_populates="subcategory")

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, autoincrement=True)  # Changed this
    description = Column(String)
    amount = Column(Float)
    date = Column(DateTime, default=datetime.utcnow)
    subcategory_id = Column(Integer, ForeignKey("subcategories.id"))
    subcategory = relationship("Subcategory", back_populates="transactions")
