from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pathlib import Path
from app.db.dependencies import get_db
from app.models.job import Job
from app.schemas.job_schema import (
    JobCreate,
    JobResponse
)
from app.workers.test_worker import test_task

from fastapi.responses import ( FileResponse , RedirectResponse)

router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"]
)



@router.post(
    "/create",
    response_model=JobResponse
)
def create_job(
    job: JobCreate,
    db: Session = Depends(get_db)
):
    db_job = Job(
        file_id=job.file_id,
        tool_name=job.tool_name,
        status="queued"
    )

    db.add(db_job)
    db.commit()
    db.refresh(db_job)

    return db_job

@router.get("/{job_id}")
def get_job(
    job_id: int,
    db: Session = Depends(get_db)
):
    job = (
        db.query(Job)
        .filter(Job.id == job_id)
        .first()
    )

    if not job:
        return {
            "message": "Job not found"
        }

    return {
        "job_id": job.id,
        "status": job.status,
        "tool_name": job.tool_name,
        "owner": (job.user.email if job.user else None)
    }

@router.post("/test-task/{job_id}")
def run_test_task(
    job_id: int
):
    task = test_task.delay(job_id)

    return {
        "task_id": task.id
    }

@router.get("/{job_id}/status")
def get_job_status(
    job_id: int,
    db: Session = Depends(get_db)
):
    job = (
        db.query(Job)
        .filter(Job.id == job_id)
        .first()
    )

    if not job:
        return {
            "message": "Job not found"
        }

    return {
        "job_id": job.id,
        "status": job.status
    }


@router.get("/{job_id}/download")
def download_job_output(
    job_id: int,
    db: Session = Depends(get_db)
):
    job = (
        db.query(Job)
        .filter(Job.id == job_id)
        .first()
    )

    if not job:
        return {"message": "Job not found"}

    if not job.output_file_key:
        return {"message": "Output not ready"}

    if job.output_file_key.startswith("http"):
        return RedirectResponse(
            url=job.output_file_key
        )

    return FileResponse(
        path=job.output_file_key
    )