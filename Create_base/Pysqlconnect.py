from decouple import config
from sqlalchemy import Column, Integer, Float, String, DateTime
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

base = declarative_base()
engine = create_engine(f"mysql+mysqlconnector://{config("DB_USER")}:{config("DB_PASSWORD")}@{config("DB_HOST")}:{config("DB_PORT")}/{config("DB")}")  # //user:password@host:port/database


Session = sessionmaker()
session = Session()

def connection(engine=engine)->object:
    return engine

def get_connect():
    return engine.connect()





if __name__ == "__main__":
    #base.metadata.drop_all(engine)
    base.metadata.create_all(engine)

class users(base):
    __tablename__ = "users"
    id = Column(Integer(), primary_key=True)
    def __str__(self):
        return self.username


class registro(base):
    __tablename__  = "registro"
    id = Column(Integer(), primary_key=True)
    
    def __str__(self):
        return self.username

class doctors(base):
    __tablename__ = "doctors"
    id = Column(Integer(), primary_key=True)
    def __str__(self):
        return self.username