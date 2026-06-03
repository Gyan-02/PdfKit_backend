from celery import Celery

celery_app = Celery(
    "pdfkit",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0"
)

celery_app.conf.imports = (
    "app.workers.merge",
    "app.workers.split",
    "app.workers.jpg_to_pdf",
    "app.workers.rotate",
    "app.workers.watermark",
    "app.workers.page_numbers",
    "app.workers.protect",
    "app.workers.unlock",
    "app.workers.pdf_to_jpg",
    "app.workers.compress",
)