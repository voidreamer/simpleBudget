import os
from sqlalchemy import create_engine
from sqlalchemy import NullPool
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

# Create the SQLAlchemy engine
engine = create_engine(os.getenv('DATABASE_URL'), client_encoding='utf8', poolclass=NullPool)

# Create a configured "SessionLocal" class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()
