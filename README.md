# CloudForge Notes

A small full-stack demo app for testing Docker-based deployments. It has a Flask backend, a responsive web interface, JSON API routes, and a health endpoint.

## Files

```text
cloudforge-notes-app/
├── app.py
├── requirements.txt
├── Dockerfile
├── .dockerignore
├── .gitignore
├── README.md
├── templates/
│   └── index.html
└── static/
    ├── style.css
    └── app.js
```

## Local run with Python

Python 3.12+ is recommended.

```bash
python -m venv .venv
```

Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

Open `http://localhost:8080`. Health check: `http://localhost:8080/health`.

## Build and run with Docker

Run these commands from the repository root (the folder containing `Dockerfile`):

```bash
docker build -t cloudforge-notes .
docker run --rm --name cloudforge-notes-demo -p 8082:8080 cloudforge-notes
```

Open `http://localhost:8082`. Health check: `http://localhost:8082/health`.

If port 8082 is already allocated, choose another host port such as `8083:8080`.

## Push to GitHub

Create an empty GitHub repository, then run these commands from this folder, replacing `YOUR-USERNAME` and `YOUR-REPOSITORY`:

```bash
git init
git add .
git commit -m "Add CloudForge Notes deployment demo"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

## Deploy with CloudForge

Use the GitHub repository's HTTPS clone URL in CloudForge. The repository root contains a Dockerfile. The image listens on container port `8080`; CloudForge must publish/forward traffic to container port `8080` for the generated live URL to work.

The `/health` route returns JSON with `status: "ok"`. The `/api/notes` endpoint lists notes; POST creates a note and DELETE removes one. Notes are stored in process memory, so they reset if the container restarts and are not shared across multiple worker processes. This is a deployment demo, not persistent storage.

## Important note

No app can be guaranteed to deploy successfully on every platform without testing that platform's configuration. This project includes all application and Docker files needed for a standard container build; successful public access still depends on CloudForge correctly forwarding its assigned public/host port to container port `8080`.
