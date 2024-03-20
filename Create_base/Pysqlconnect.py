from decouple import config
from sqlalchemy import Column, Integer, Float, String, DateTime
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

base = declarative_base()
engine = create_engine(f"mysql+mysqlconnector://{config("DB_USER")}:{config("DB_PASSWORD")}@{config("DB_HOST")}:{config("DB_PORT")}/{config("DB")}")  # //user:password@host:port/database

class citas(base):
    __tablename__ = "citas"
    id = Column(Integer(), primary_key=True)
    Name = Column(String(30), nullable=False)
    Medical_Condition = Column(String(30), nullable=False)
    medical_appointment_day = Column(DateTime(), nullable=False)
    Insurance_Provider = Column(String(50), nullable=False)
    Horario = Column(String(30))
    number = Column(Integer(), nullable=False)
    def __str__(self):
        return self.username


class pacientes(base):
    __tablename__  = "pacientes"
    id = Column(Integer(), primary_key=True)
    def __str__(self):
        return self.username

Session = sessionmaker()
session = Session()

def connection(engine=engine)->object:
    return engine


if __name__ == "__main__":
    base.metadata.drop_all(engine)
    base.metadata.create_all(engine)



