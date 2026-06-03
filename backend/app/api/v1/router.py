from fastapi import APIRouter
from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints import files
from app.api.v1.endpoints.jobs import router as jobs_router
from app.api.v1.endpoints.merge import router as   merge_router
from app.api.v1.endpoints.split import router as split_router
from app.api.v1.endpoints.jpg_to_pdf import (router as jpg_to_pdf_router)
from app.api.v1.endpoints.rotate import ( router as rotate_router)
from app.api.v1.endpoints.watermark import (
    router as watermark_router
)
from app.api.v1.endpoints.page_numbers import (
    router as page_numbers_router
)
from app.api.v1.endpoints.protect import (
    router as protect_router
)
from app.api.v1.endpoints.unlock import (
    router as unlock_router
)
from app.api.v1.endpoints.pdf_to_jpg import (
    router as pdf_to_jpg_router
)
from app.api.v1.endpoints.compress import (
    router as compress_router
)





router = APIRouter()

@router.get("/")
def home():
    return {"message":"pdfflow backend running"}

router.include_router(auth_router)
router.include_router(files.router)
router.include_router(jobs_router)
router.include_router(merge_router)
router.include_router(split_router)
router.include_router(jpg_to_pdf_router)
router.include_router(rotate_router)
router.include_router(watermark_router)
router.include_router(
    page_numbers_router
)
router.include_router(protect_router)
router.include_router(unlock_router)
router.include_router(pdf_to_jpg_router)
router.include_router(compress_router)