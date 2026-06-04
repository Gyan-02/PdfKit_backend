from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.dependencies import get_db

from app.models.user import User
from app.models.file import File
from app.models.job import Job

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db)
):

    return {
        "total_users": db.query(User).count(),
        "total_files": db.query(File).count(),
        "total_jobs": db.query(Job).count(),
        "completed_jobs": (
            db.query(Job)
            .filter(Job.status == "completed")
            .count()
        ),
        "failed_jobs": (
            db.query(Job)
            .filter(Job.status == "failed")
            .count()
        ),
        "processing_jobs": (
            db.query(Job)
            .filter(Job.status == "processing")
            .count()
        ),
        "queued_jobs": (
            db.query(Job)
            .filter(Job.status == "queued")
            .count()
        )
    }


@router.get("/jobs")
def get_jobs(
    db: Session = Depends(get_db)
):

    jobs = (
        db.query(Job)
        .order_by(Job.id.desc())
        .all()
    )

    return jobs


@router.get("/files")
def get_files(
    db: Session = Depends(get_db)
):

    files = (
        db.query(File)
        .order_by(File.id.desc())
        .all()
    )

    return files


@router.get("/users")
def get_users(
    db: Session = Depends(get_db)
):

    users = (
        db.query(User)
        .order_by(User.id.desc())
        .all()
    )

    return [
        {
            "id": user.id,
            "email": user.email,
            "plan_type": user.plan_type,
            "created_at": user.created_at,
        }
        for user in users
    ]