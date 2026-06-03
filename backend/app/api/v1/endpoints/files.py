from fastapi import APIRouter, UploadFile, Depends
from pathlib import Path
from sqlalchemy.orm import Session
from app.db.dependencies import get_db
from app.models.file import File
from app.models.user import User
from app.core.security import get_current_user

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


router = APIRouter(
    prefix="/files",
    tags=["Files"]
)


@router.post("/upload")
async def upload_file(
    file: UploadFile,
    db: Session = Depends(get_db),
   # current_user: User = Depends(get_current_user)
    ):
        file_path = UPLOAD_DIR / file.filename

        content = await file.read()

        with open(file_path, "wb") as f:
            f.write(content)

        db_file = File(
           # user_id= current_user.id,
            original_filename=file.filename,
            s3_key=str(file_path),
            size_bytes=len(content),
            mime_type=file.content_type
        )

        db.add(db_file)
        db.commit()
        db.refresh(db_file)
    
        return {
        "file_id": db_file.id,
        "filename": db_file.original_filename
    }