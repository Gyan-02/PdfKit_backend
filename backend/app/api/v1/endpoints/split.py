from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.models.job import Job
from app.models.file import File
from app.schemas.split_schema import SplitRequest
from app.workers.split import split_pdf_task


router = APIRouter(
    prefix="/split",
    tags=["Split PDF"]
)


@router.post("/")
def split_pdf(
    payload: SplitRequest,
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
        tool_name="split_pdf",
        status="queued",
        options={
            "file_id": payload.file_id
        }
    )

    db.add(db_job)
    db.commit()
    db.refresh(db_job)

    split_pdf_task.delay(db_job.id)

    return {
        "job_id": db_job.id,
        "status": db_job.status
    }