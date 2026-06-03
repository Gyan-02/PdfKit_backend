
import fitz

from pathlib import Path
from datetime import datetime, UTC
from app.core.celery_app import celery_app
from app.db.session import SessionLocal
from app.models.job import Job
from app.models.file import File


@celery_app.task
def split_pdf_task(job_id: int):

    db = SessionLocal()

    try:
        job = (
            db.query(Job)
            .filter(Job.id == job_id)
            .first()
        )
         
 
        if not job:
            return
        
        file_id = job.options["file_id"]
        print(file_id)
        
        job.status = "processing"
        db.commit()

        print(f"Split Job {job_id} Started")

        

        db_file = (
            db.query(File)
            .filter(File.id ==(file_id))
            .all()
        )

        if not db_file:
            raise Exception("File not found")
        
        input_path = db_file.s3_key

        doc = fitz.open(input_path)

        output_dir = Path("outputs") / f"split_{job_id}"
        output_dir.mkdir(parents=True, exist_ok=True)

        for page_num in range(len(doc)):

            new_pdf = fitz.open()

            new_pdf.insert_pdf(
            doc,
            from_page=page_num,
            to_page=page_num
            )
            
            page_path = (
                output_dir /
                f"page_{page_num + 1}.pdf"
            )

            new_pdf.save(str(page_path))

            new_pdf.close()
        doc.close()    


        job.output_file_key= str(output_dir)
        job.status = "completed"
        job.completed_at = datetime.now(UTC)

        db.commit()

        print(f"Split Job {job_id} Completed")

    except Exception as e:

        print(f"Split Job {job_id} Failed: {e}")

        job.status = "failed"
        job.error_message = str(e)

        db.commit()


    finally:
        db.close()