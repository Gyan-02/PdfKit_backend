
import fitz

from pathlib import Path
from datetime import datetime, UTC
from app.core.celery_app import celery_app
from app.db.session import SessionLocal
from app.models.job import Job
from app.models.file import File


@celery_app.task
def merge_pdf_task(job_id: int):

    db = SessionLocal()

    try:
        job = (
            db.query(Job)
            .filter(Job.id == job_id)
            .first()
        )
         
 
        if not job:
            return
        
        file_ids = job.options["file_ids"]
        print(file_ids)
        
        job.status = "processing"
        db.commit()

        print(f"Merge Job {job_id} Started")

        

        files = (
            db.query(File)
            .filter(File.id.in_(file_ids))
            .all()
        )

        merged_pdf = fitz.open()

        for db_file in files:

            pdf = fitz.open(db_file.s3_key)

            merged_pdf.insert_pdf(pdf)

            pdf.close()

        OUTPUT_DIR = Path("outputs")
        OUTPUT_DIR.mkdir(exist_ok=True)

        output_path = OUTPUT_DIR / f"merged_{job_id}.pdf"

        merged_pdf.save(str(output_path))
        merged_pdf.close()


        job.output_file_key= str(output_path)
        job.status = "completed"
        job.completed_at = datetime.now(UTC)

        db.commit()

        print(f"Merge Job {job_id} Completed")

    except Exception as e:

        print(f"Merge Job {job_id} Failed: {e}")

        job.status = "failed"
        job.error_message = str(e)

        db.commit()


    finally:
        db.close()