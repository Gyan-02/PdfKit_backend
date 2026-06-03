from fastapi import FastAPI
from app.api.v1.router import router 
from  app.db.session import SessionLocal
import app.models
app = FastAPI()

@app.get("/")
def home():
    db = SessionLocal()
    try:
        return{"message":"Database connected"}
    finally:
        db.close()

app.include_router(router)