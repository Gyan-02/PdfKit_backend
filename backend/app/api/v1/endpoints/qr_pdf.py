from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.dependencies import get_db

from app.models.job import Job
from app.models.file import File

from app.schemas.qr_pdf_schema import (
    QRPdfRequest
)

from app.workers.qr_pdf import (
    qr_pdf_task
)


router = APIRouter(
    prefix="/qr-pdf",
    tags=["QR PDF"]
)


@router.post("/")
def add_qr_to_pdf(
    payload: QRPdfRequest,
    db: Session = Depends(get_db)
):

    db_file = (
        db.query(File)
        .filter(File.id == payload.file_id)
        .first()
    )

    if not db_file:
        return {
            "message": "File not found"
        }

    db_job = Job(
        tool_name="qr_pdf",
        status="queued",
        options={
            "file_id": payload.file_id,
            "text": payload.text
        }
    )

    db.add(db_job)
    db.commit()
    db.refresh(db_job)

    qr_pdf_task.delay(
        db_job.id
    )

    return {
        "job_id": db_job.id,
        "status": db_job.status
    }