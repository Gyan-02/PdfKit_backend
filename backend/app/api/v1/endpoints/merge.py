from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.models.job import Job

from app.workers.merge import merge_pdf_task
from app.schemas.merge_schema import MergeRequest
from app.models.file import File

router = APIRouter(
    prefix="/merge",
    tags=["Merge PDF"]
)

@router.post("/")
def merge_pdf(
    payload: MergeRequest,
    db: Session = Depends(get_db)
):
     
    files = (
        db.query(File)
        .filter(File.id.in_(payload.file_ids))
        .all()
    )

    if len(files) != len(payload.file_ids):
        raise HTTPException(
                status_code=404,
                detail="One or more files not found"
            )

    db_job = Job(
        tool_name="merge_pdf",
        status="queued",
        options={
            "file_ids": payload.file_ids
        }
    )

    db.add(db_job)
    db.commit()
    db.refresh(db_job)

    merge_pdf_task.delay(db_job.id)

    return {
        "job_id": db_job.id,
        "status": db_job.status
    }