from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.dependencies import get_db

from app.models.job import Job
from app.models.file import File

from app.schemas.unlock_schema import (
    UnlockRequest
)

from app.workers.unlock import (
    unlock_pdf_task
)


router = APIRouter(
    prefix="/unlock",
    tags=["Unlock PDF"]
)


@router.post("/")
def unlock_pdf(
    payload: UnlockRequest,
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
        tool_name="unlock_pdf",
        status="queued",
        options={
            "file_id": payload.file_id,
            "password": payload.password
        }
    )

    db.add(db_job)
    db.commit()
    db.refresh(db_job)

    unlock_pdf_task.delay(db_job.id)

    return {
        "job_id": db_job.id,
        "status": db_job.status
    }