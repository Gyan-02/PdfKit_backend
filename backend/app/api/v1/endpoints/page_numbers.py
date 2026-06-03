from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.dependencies import get_db

from app.models.job import Job
from app.models.file import File

from app.schemas.page_numbers_schema import (
    PageNumbersRequest
)

from app.workers.page_numbers import (
    page_numbers_task
)


router = APIRouter(
    prefix="/page-numbers",
    tags=["Page Numbers"]
)


@router.post("/")
def add_page_numbers(
    payload: PageNumbersRequest,
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
        tool_name="page_numbers",
        status="queued",
        options={
            "file_id": payload.file_id
        }
    )

    db.add(db_job)
    db.commit()
    db.refresh(db_job)

    page_numbers_task.delay(db_job.id)

    return {
        "job_id": db_job.id,
        "status": db_job.status
    }