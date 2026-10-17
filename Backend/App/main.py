from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import auth
from . import spotify
from . import ai_routes

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:5173"],
    allow_methods = ["*"],
    allow_headers = ["*"],
)

app.include_router(auth.router)
app.include_router(spotify.router)
app.include_router(ai_routes.router)

@app.get("/")
def health():
    return {"Ok": True}

