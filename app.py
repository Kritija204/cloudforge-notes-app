import os
from flask import Flask, request, jsonify, render_template
from datetime import datetime, timezone

app = Flask(__name__)
app.config["JSON_SORT_KEYS"] = False

NOTES = []

@app.get("/")
def home():
    return render_template("index.html")

@app.get("/health")
def health():
    return jsonify(status="ok", app="CloudForge Notes", time=datetime.now(timezone.utc).isoformat())

@app.get("/api/notes")
def list_notes():
    return jsonify(NOTES)

@app.post("/api/notes")
def create_note():
    data = request.get_json(silent=True) or {}
    title = str(data.get("title", "")).strip()
    content = str(data.get("content", "")).strip()
    if not title or not content:
        return jsonify(error="Title and content are required."), 400
    note = {
        "id": int(datetime.now(timezone.utc).timestamp() * 1000000),
        "title": title[:100],
        "content": content[:2000],
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    NOTES.insert(0, note)
    del NOTES[50:]
    return jsonify(note), 201

@app.delete("/api/notes/<int:note_id>")
def delete_note(note_id):
    global NOTES
    before = len(NOTES)
    NOTES = [n for n in NOTES if n["id"] != note_id]
    if len(NOTES) == before:
        return jsonify(error="Note not found."), 404
    return jsonify(deleted=True)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8080"))
    app.run(host="0.0.0.0", port=port)
