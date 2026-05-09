from fastapi import FastAPI

app = FastAPI(title="ElimuSight AI Service")


@app.get("/")
def health():
    return {"status": "AI service running"}