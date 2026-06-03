import fitz

from pathlib import Path
from datetime import datetime, UTC

from app.core.celery_app import celery_app
from app.db.session import SessionLocal
from app.models.job import Job
from app.models.file import File


@celery_app.task
def pdf_to_jpg_task(job_id: int):

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

        job.status = "processing"
        db.commit()

        db_file = (
            db.query(File)
            .filter(File.id == file_id)
            .first()
        )

        if not db_file:
            raise Exception("File not found")

        doc = fitz.open(db_file.s3_key)

        output_dir = (
            Path("outputs")
            / f"pdf_to_jpg_{job_id}"
        )

        output_dir.mkdir(
            parents=True,
            exist_ok=True
        )

        for page_num in range(len(doc)):

            page = doc[page_num]

            pix = page.get_pixmap(
                matrix=fitz.Matrix(2, 2)
            )

            image_path = (
                output_dir /
                f"page_{page_num + 1}.jpg"
            )

            pix.save(str(image_path))

        doc.close()

        job.output_file_key = str(output_dir)
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