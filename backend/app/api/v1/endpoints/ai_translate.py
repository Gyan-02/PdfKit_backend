from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.dependencies import get_db

from app.models.job import Job
from app.models.file import File

from app.schemas.ai_translate_schema import (
    AITranslateRequest
)

from app.workers.ai_translate import (
    ai_translate_task
)


router = APIRouter(
    prefix="/ai-translate",
    tags=["AI Translate"]
)


@router.post("/")
def ai_translate(
    payload: AITranslateRequest,
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
        tool_name="ai_translate",
        status="queued",
        options={
            "file_id": payload.file_id,
            "target_language": payload.target_language
        }
    )

    db.add(db_job)
    db.commit()
    db.refresh(db_job)

    ai_translate_task.delay(
        db_job.id
    )

    return {
        "job_id": db_job.id,
        "status": db_job.status
    }