from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.dependencies import get_db

from app.models.job import Job
from app.models.file import File

from app.schemas.ai_rewrite_schema import (
    AIRewriteRequest
)

from app.workers.ai_rewrite import (
    ai_rewrite_task
)


router = APIRouter(
    prefix="/ai-rewrite",
    tags=["AI Rewrite"]
)


@router.post("/")
def ai_rewrite(
    payload: AIRewriteRequest,
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
        tool_name="ai_rewrite",
        status="queued",
        options={
            "file_id": payload.file_id,
            "tone": payload.tone
        }
    )

    db.add(db_job)
    db.commit()
    db.refresh(db_job)

    ai_rewrite_task.delay(
        db_job.id
    )

    return {
        "job_id": db_job.id,
        "status": db_job.status
    }