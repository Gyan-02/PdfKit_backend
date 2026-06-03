from fastapi import APIRouter
from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints import files
from app.api.v1.endpoints.jobs import router as jobs_router
from app.api.v1.endpoints.merge import router as   merge_router
from app.api.v1.endpoints.split import router as split_router

router = APIRouter()

@router.get("/")
def home():
    return {"message":"pdfflow backend running"}

router.include_router(auth_router)
router.include_router(files.router)
router.include_router(jobs_router)
router.include_router(merge_router)
router.include_router(split_router)