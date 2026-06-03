from pathlib import Path
from datetime import datetime, UTC

from pypdf import PdfReader, PdfWriter

from app.core.celery_app import celery_app
from app.db.session import SessionLocal
from app.models.job import Job
from app.models.file import File


@celery_app.task
def unlock_pdf_task(job_id: int):

    db = SessionLocal()
    job = None

    try:

        job = (
            db.query(Job)
            .filter(Job.id == job_id)
            .first()
        )

        if not job:
            return

        file_id = job.options["file_id"]
        password = job.options["password"]

        job.status = "processing"
        db.commit()

        db_file = (
            db.query(File)
            .filter(File.id == file_id)
            .first()
        )

        if not db_file:
            raise Exception("File not found")

        reader = PdfReader(db_file.s3_key)

        if reader.is_encrypted:

            result = reader.decrypt(password)

            if result == 0:
                raise Exception("Invalid password")

        writer = PdfWriter()

        for page in reader.pages:
            writer.add_page(page)

        output_dir = Path("outputs")
        output_dir.mkdir(parents=True, exist_ok=True)

        output_path = (
            output_dir /
            f"unlocked_{job_id}.pdf"
        )

        with open(output_path, "wb") as f:
            writer.write(f)

        job.output_file_key = str(output_path)
        job.status = "completed"
        job.completed_at = datetime.now(UTC)

        db.commit()

    except Exception as e:

        if job:
            job.status = "failed"
            job.error_message = str(e)
            db.commit()

    finally:
        db.close()