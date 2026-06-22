# 🗂️ PDFKit Pro — Full-Stack PDF & File Toolkit

A full-featured PDF and file-processing web app with a **Next.js 16** frontend and a **FastAPI** (Python) backend. It covers everything from merging PDFs to AI summarisation, OCR, image processing, and 70+ file conversion tools.

---

## 📸 Preview

![PDFKit Pro Homepage](C:\Users\Gyan\.gemini\antigravity-ide\brain\c88c7b61-6a5f-4661-84c7-76d9cf53ef08\homepage.png)

![Tools Grid & Upload Zone](C:\Users\Gyan\.gemini\antigravity-ide\brain\c88c7b61-6a5f-4661-84c7-76d9cf53ef08\tools_grid.png)

![Merge PDF Tool Page](C:\Users\Gyan\.gemini\antigravity-ide\brain\c88c7b61-6a5f-4661-84c7-76d9cf53ef08\merge_tool.png)

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router), TypeScript, Plain CSS |
| **Backend** | FastAPI (Python 3.10+), SQLAlchemy, Alembic |
| **Database** | PostgreSQL |
| **Task Queue** | Redis + Celery workers |
| **Auth** | JWT + Google OAuth 2.0 |
| **AI features** | Groq API (summarise, translate, rewrite) |
| **Image tools** | Cloudinary, Real-ESRGAN, MediaPipe |
| **Document tools** | Poppler, Ghostscript, Calibre, LibreOffice |
| **Fonts** | Syne (display) + DM Sans (body) via Google Fonts |

---

## 📁 Project Structure

```
PDFkit_backend/
├── backend/                   ← FastAPI Python backend
│   ├── app/
│   │   ├── main.py            ← App entry point (FastAPI + CORS)
│   │   ├── api/v1/
│   │   │   ├── router.py      ← Registers all API routes
│   │   │   └── endpoints/     ← One file per tool (merge, split, ocr …)
│   │   ├── core/              ← Config, security, JWT helpers
│   │   ├── db/                ← SQLAlchemy session + engine
│   │   ├── models/            ← DB models (User, File, Job …)
│   │   ├── schemas/           ← Pydantic request/response schemas
│   │   ├── services/          ← Business logic (pdf processing, AI …)
│   │   └── workers/           ← Celery background workers
│   ├── alembic/               ← Database migrations
│   ├── uploads/               ← Uploaded files (auto-created)
│   ├── outputs/               ← Processed output files (auto-created)
│   ├── temp/                  ← Temp working directory
│   └── .env                   ← Backend environment variables ← EDIT THIS
│
├── frontend/                  ← Next.js frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx     ← Root layout (Navbar + Footer + Providers)
│   │   │   ├── page.tsx       ← Homepage (hero, tools grid, upload)
│   │   │   ├── tools/[toolId] ← Dynamic tool pages (70+ tools)
│   │   │   ├── signin/        ← Sign-in page
│   │   │   ├── signup/        ← Sign-up page
│   │   │   ├── admin/         ← Admin dashboard
│   │   │   └── about/         ← About page
│   │   ├── components/        ← Navbar, Footer, ToolCard, etc.
│   │   └── lib/
│   │       ├── api.ts         ← Axios instance + JWT interceptors
│   │       ├── authApi.ts     ← Login / register / Google OAuth calls
│   │       ├── pdfApi.ts      ← All 70+ tool API call functions
│   │       ├── data.ts        ← Tool definitions, icons, categories
│   │       ├── fileDetect.ts  ← Smart file-type detection
│   │       ├── types.ts       ← Shared TypeScript types
│   │       └── AuthContext.tsx ← Global auth state (React context)
│   ├── .env.local             ← Frontend environment variables ← EDIT THIS
│   └── next.config.ts         ← Next.js configuration
│
└── requirements.txt           ← Python dependencies
```

---

## ✅ Prerequisites

Before you start, make sure you have the following installed on your machine:

| Tool | Version | How to check |
|---|---|---|
| **Node.js** | 18 or higher | `node -v` |
| **npm** | 9 or higher | `npm -v` |
| **Python** | 3.10 or higher | `python --version` |
| **PostgreSQL** | 14 or higher | `psql --version` |
| **Redis** | 6 or higher | `redis-cli ping` (should reply `PONG`) |
| **Git** | any | `git --version` |

> 💡 **On Windows**, you can install Redis via WSL or download the [Windows port](https://github.com/microsoftarchive/redis/releases).

### Optional (needed for specific tools)

| Tool | Used for | Download |
|---|---|---|
| **Poppler** | PDF → image conversion | [poppler for Windows](https://github.com/oschwartz10612/poppler-windows/releases) |
| **Ghostscript** | PDF compression | [ghostscript.com](https://www.ghostscript.com/releases/gsdnld.html) |
| **Calibre** | eBook conversions | [calibre-ebook.com](https://calibre-ebook.com/download) |
| **LibreOffice** | Word/Excel/PPT → PDF | [libreoffice.org](https://www.libreoffice.org/download/download/) |
| **Tesseract OCR** | OCR (image → text) | [github.com/tesseract-ocr](https://github.com/UB-Mannheim/tesseract/wiki) |

---

## ⚙️ Step 1 — Set Up the Backend

### 1a. Create a PostgreSQL database

Open your PostgreSQL client (pgAdmin or psql) and create a database:

```sql
CREATE DATABASE pdfflow;
```

### 1b. Edit the backend `.env` file

Open `backend/.env` and fill in your values:

```env
# PostgreSQL connection string
DATABASE_URL=postgresql://YOUR_POSTGRES_USER:YOUR_POSTGRES_PASSWORD@localhost/pdfflow

# Redis (leave as-is if running locally with default settings)
REDIS_URL=redis://localhost:6379

# JWT secret — generate a strong random string (e.g. run: python -c "import secrets; print(secrets.token_urlsafe(32))")
SECRET_KEY=your-super-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Groq API key — free at https://console.groq.com
GROQ_API_KEY=gsk_your_groq_api_key_here

# Your backend's public URL (use localhost for local dev)
BASE_URL=http://localhost:8000

# Cloudinary — free at https://cloudinary.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google OAuth Client ID — from https://console.cloud.google.com
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Paths to installed tools (Windows example — adjust for your system)
POPPLER_PATH=C:\path\to\poppler\bin
GHOSTSCRIPT_PATH=C:\Program Files\gs\gs10.xx.x\bin\gswin64c.exe
CALIBRE_PATH=C:\Program Files\Calibre2\ebook-convert.exe

# AI image models (optional — leave blank if not using)
MEDIAPIPE_FACE_STYLIZER_MODEL_PATH=models/face_stylizer_color_ink.task
REAL_ESRGAN_EXE_PATH=bin/realesrgan-ncnn-vulkan/realesrgan-ncnn-vulkan.exe
```

### 1c. Create a Python virtual environment and install dependencies

Open a terminal, navigate to the project root, and run:

```bash
# From the project root (PDFkit_backend/)
python -m venv backend/venv

# Activate the venv
# On Windows:
backend\venv\Scripts\activate
# On Mac/Linux:
source backend/venv/bin/activate

# Install all Python packages
pip install -r requirements.txt
```

### 1d. Run database migrations

With your venv activated:

```bash
cd backend
alembic upgrade head
```

This creates all the required tables in your PostgreSQL database.

### 1e. Start the backend server

```bash
# Still inside backend/ with venv activated
uvicorn app.main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Application startup complete.
```

> **Test it:** Open [http://localhost:8000](http://localhost:8000) — you should see `{"message": "Database connected"}`.
> 
> **Interactive API docs:** Open [http://localhost:8000/docs](http://localhost:8000/docs) for the full Swagger UI.

### 1f. (Optional) Start the Celery worker

In a **new terminal** window (with venv activated):

```bash
cd backend
celery -A app.workers.celery_app worker --loglevel=info
```

> This is required for background processing jobs (compression, heavy conversions, etc.)

---

## 🌐 Step 2 — Set Up the Frontend

### 2a. Edit the frontend `.env.local` file

Open `frontend/.env.local`:

```env
# URL of your running backend — keep as localhost for local development
NEXT_PUBLIC_API_URL=http://localhost:8000

# Google OAuth Client ID — must match the one in your backend .env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### 2b. Install Node.js dependencies

```bash
cd frontend
npm install
```

### 2c. Start the frontend dev server

```bash
npm run dev
```

You should see:
```
▲ Next.js 16.2.6 (Turbopack)
- Local:   http://localhost:3000
✓ Ready in 2.0s
```

### 2d. Open the app

Visit **[http://localhost:3000](http://localhost:3000)** in your browser. 🎉

---

## 🚀 Running Both Servers Together

You need **3 terminal windows** running simultaneously:

| Terminal | Command | Where |
|---|---|---|
| 1 — Backend API | `uvicorn app.main:app --reload --port 8000` | `backend/` (venv active) |
| 2 — Celery Worker | `celery -A app.workers.celery_app worker --loglevel=info` | `backend/` (venv active) |
| 3 — Frontend | `npm run dev` | `frontend/` |

---

## 📄 Pages & Routes

### Frontend pages

| URL | Description |
|---|---|
| `/` | Homepage — hero, tool search, drag-and-drop upload zone |
| `/signin` | Sign-in with email/password or Google |
| `/signup` | Create a new account |
| `/about` | About page |
| `/admin` | Admin dashboard (admin users only) |
| `/tools/[toolId]` | Any tool page — see full list below |

### Backend API

| URL | Description |
|---|---|
| `http://localhost:8000/` | Health check |
| `http://localhost:8000/docs` | Swagger UI — interactive API explorer |
| `http://localhost:8000/redoc` | ReDoc API documentation |
| `http://localhost:8000/api/v1/` | All API endpoints |

---

## 🛠️ All 70+ Tools

### PDF Tools
| Tool ID | URL | Description |
|---|---|---|
| `merge` | `/tools/merge` | Merge multiple PDFs into one |
| `split` | `/tools/split` | Split PDF into pages |
| `compress` | `/tools/compress` | Reduce PDF file size |
| `rotate` | `/tools/rotate` | Rotate PDF pages |
| `watermark` | `/tools/watermark` | Add text watermark |
| `protect` | `/tools/protect` | Password-protect a PDF |
| `unlock` | `/tools/unlock` | Remove PDF password |
| `organize` | `/tools/organize` | Reorder or delete pages |
| `ocr` | `/tools/ocr` | Make scanned PDFs searchable |
| `addPageNumbers` | `/tools/addPageNumbers` | Stamp page numbers |
| `sign` | `/tools/sign` | Digital / typed / stamp signature |
| `qr2pdf` | `/tools/qr2pdf` | Embed QR code into PDF |

### Convert — PDF ↔ Docs
| Tool ID | URL | Description |
|---|---|---|
| `pdf2word` | `/tools/pdf2word` | PDF → editable Word (.docx) |
| `word2pdf` | `/tools/word2pdf` | Word (.docx) → PDF |
| `pdf2excel` | `/tools/pdf2excel` | PDF tables → Excel |
| `excel2pdf` | `/tools/excel2pdf` | Excel (.xlsx) → PDF |
| `ppt2pdf` | `/tools/ppt2pdf` | PowerPoint → PDF |
| `pdf2ppt` | `/tools/pdf2ppt` | PDF → PowerPoint |
| `pdf2text` | `/tools/pdf2text` | PDF → plain text |
| `pdf2html` | `/tools/pdf2html` | PDF → HTML |
| `pdf2epub` | `/tools/pdf2epub` | PDF → EPUB |
| `epub2pdf` | `/tools/epub2pdf` | EPUB → PDF |
| `mobi2epub` | `/tools/mobi2epub` | MOBI → EPUB |
| `azw32pdf` | `/tools/azw32pdf` | AZW3 → PDF |

### Convert — Images
| Tool ID | URL | Description |
|---|---|---|
| `pdf2jpg` | `/tools/pdf2jpg` | PDF pages → JPG images |
| `pdf2png` | `/tools/pdf2png` | PDF pages → PNG images |
| `jpg2pdf` | `/tools/jpg2pdf` | Images → PDF |
| `jpg2png` | `/tools/jpg2png` | JPG → PNG |
| `png2jpg` | `/tools/png2jpg` | PNG → JPG |
| `png2webp` | `/tools/png2webp` | PNG → WebP |
| `webp2jpg` | `/tools/webp2jpg` | WebP → JPG |
| `ppt2images` | `/tools/ppt2images` | PPT slides → images |

### Convert — Data Files
| Tool ID | URL | Description |
|---|---|---|
| `excel2csv` | `/tools/excel2csv` | Excel → CSV |
| `excel2json` | `/tools/excel2json` | Excel → JSON |
| `word2txt` | `/tools/word2txt` | Word → plain text |
| `word2html` | `/tools/word2html` | Word → HTML |
| `word2markdown` | `/tools/word2markdown` | Word → Markdown |
| `json2csv` | `/tools/json2csv` | JSON → CSV |
| `csv2json` | `/tools/csv2json` | CSV → JSON |
| `json2xml` | `/tools/json2xml` | JSON → XML |
| `xml2json` | `/tools/xml2json` | XML → JSON |
| `yaml2json` | `/tools/yaml2json` | YAML → JSON |

### Compress
| Tool ID | URL | Description |
|---|---|---|
| `compress` | `/tools/compress` | Compress PDF |
| `compressjpg` | `/tools/compressjpg` | Compress JPG |
| `compresspng` | `/tools/compresspng` | Compress PNG |
| `compresswebp` | `/tools/compresswebp` | Compress WebP |

### AI Tools
| Tool ID | URL | Description |
|---|---|---|
| `ai` | `/tools/ai` | AI summarise PDF (Groq) |
| `ai-translate` | `/tools/ai-translate` | Translate PDF content |
| `ai-rewrite` | `/tools/ai-rewrite` | Rewrite in a new tone |
| `upscaleimage` | `/tools/upscaleimage` | Upscale image with Real-ESRGAN |
| `image2cartoon` | `/tools/image2cartoon` | Cartoon-style effect |
| `image2sketch` | `/tools/image2sketch` | Sketch-style effect |
| `image2anime` | `/tools/image2anime` | Anime-style effect |
| `image2avatar` | `/tools/image2avatar` | Avatar-style effect |

### OCR & Text Extraction
| Tool ID | URL | Description |
|---|---|---|
| `ocr` | `/tools/ocr` | OCR on PDF |
| `image2text` | `/tools/image2text` | Extract text from image |
| `screenshot2text` | `/tools/screenshot2text` | Extract text from screenshot |
| `handwriting2text` | `/tools/handwriting2text` | Handwriting → text |

### Image Utilities
| Tool ID | URL | Description |
|---|---|---|
| `resizeimage` | `/tools/resizeimage` | Resize image |
| `downscaleimage` | `/tools/downscaleimage` | Downscale within max dimensions |
| `cropimage` | `/tools/cropimage` | Crop by position/size |
| `circlecrop` | `/tools/circlecrop` | Circular crop |
| `removebackground` | `/tools/removebackground` | Remove background |
| `transparentbackground` | `/tools/transparentbackground` | Make background transparent |
| `replacebackground` | `/tools/replacebackground` | Replace with solid color |
| `smartcrop` | `/tools/smartcrop` | Smart content-aware crop |

### Text Utilities
| Tool ID | URL | Description |
|---|---|---|
| `qr` | `/tools/qr` | QR code generator |
| `upper2lower` | `/tools/upper2lower` | Uppercase → lowercase |
| `lower2upper` | `/tools/lower2upper` | Lowercase → UPPERCASE |
| `titlecase` | `/tools/titlecase` | Convert to Title Case |
| `text2base64` | `/tools/text2base64` | Text → Base64 |
| `base642text` | `/tools/base642text` | Base64 → text |
| `urlencode` | `/tools/urlencode` | URL encode text |
| `urldecode` | `/tools/urldecode` | URL decode text |

---

## 🔑 Google OAuth Setup (Optional)

If you want Google sign-in to work:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use an existing one)
3. Go to **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client IDs**
4. Set **Application type** to **Web application**
5. Add `http://localhost:3000` to **Authorized JavaScript origins**
6. Add `http://localhost:3000` to **Authorized redirect URIs**
7. Copy the **Client ID** and paste it into:
   - `backend/.env` → `GOOGLE_CLIENT_ID`
   - `frontend/.env.local` → `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

---

## 🐛 Troubleshooting

### `npm install` fails
- Make sure you're running Node.js 18+: `node -v`
- Try deleting `node_modules/` and `package-lock.json`, then run `npm install` again

### Backend returns `Connection refused`
- Make sure the backend is running: `uvicorn app.main:app --reload --port 8000`
- Make sure `NEXT_PUBLIC_API_URL=http://localhost:8000` is set in `frontend/.env.local`

### `alembic upgrade head` fails
- Check your `DATABASE_URL` in `backend/.env` — make sure the PostgreSQL password and database name are correct
- Make sure PostgreSQL is running: `pg_isready`

### Tools fail with `500 Internal Server Error`
- Check the backend terminal for the error traceback
- Make sure required tools are installed (Poppler, Ghostscript, etc.) and paths in `.env` are correct

### OCR doesn't work
- Install [Tesseract OCR](https://github.com/UB-Mannheim/tesseract/wiki) and make sure it's on your system `PATH`

### Google sign-in doesn't work
- Make sure `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set correctly in `frontend/.env.local`
- Make sure `http://localhost:3000` is listed in your Google OAuth Authorized origins

### `CORS` errors in the browser console
- The backend has `allow_origins=["*"]` set, so this should not happen in local dev
- If it does, check that the backend is actually running on port 8000

---

## 🏗️ Production Build

To build the frontend for production:

```bash
cd frontend
npm run build
npm start
```

For the backend, use a production ASGI server:

```bash
cd backend
gunicorn app.main:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

---

## 📜 License

MIT — feel free to use, modify and distribute.
