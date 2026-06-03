from pydantic import BaseModel


class CompressRequest(BaseModel):
    file_id: int
    