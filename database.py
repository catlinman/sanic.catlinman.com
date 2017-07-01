
# Import Python modules.
import bcrypt

# Import application secret module.
import secrets

# Import SQLAlchemy modules.
from sqlalchemy import create_engine, Column, DateTime, Integer, Boolean, String, func
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Prepare the declarative base.
Base = declarative_base()

# Path to the database file.
DATABASE = './db/catlinman.com.db'

# Create database models.


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False)
    password = Column(String, nullable=False)
    administrator = Column(Boolean, nullable=False)
    create_on = Column(DateTime, default=func.now())


class PSA(Base):
    __tablename__ = "psas"
    id = Column(Integer, primary_key=True)
    content = Column(String, nullable=False)
    author = Column(String, nullable=False)
    create_on = Column(DateTime, default=func.now())


# Make the engine connection.
engine = create_engine("sqlite:///{}".format(DATABASE), convert_unicode=True)

# Prepare the tables and their values.
Base.metadata.create_all(engine)

db_session = scoped_session(
    sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine
    )
)


def setup():
    admin = User(
        username=secrets.siteuser,
        password=str(bcrypt.hashpw(bytes(secrets.sitepass, "utf-8"), bcrypt.gensalt(13)), "utf8"),
        administrator=True
    )

    db_session.add(admin)
    db_session.commit()
