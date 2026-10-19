from fastapi import FastAPI , Depends, APIRouter, HTTPException
from fastapi.responses import RedirectResponse
from spotipy.oauth2 import SpotifyOAuth
import os
from dotenv import load_dotenv


load_dotenv()
router = APIRouter()
def get_spotify_oauth():
    return SpotifyOAuth(
        client_id=os.getenv("SPOTIFY_CLIENT_ID"),
        client_secret=os.getenv("SPOTIFY_CLIENT_SECRET"),
        redirect_uri=os.getenv("SPOTIFY_REDIRECT_URI"),
        scope="user-library-read playlist-modify-private playlist-modify-public user-read-email",  
        open_browser= False,
        show_dialog=True
    )

@router.get("/login")
def spotify_login(sp_oauth: SpotifyOAuth = Depends(get_spotify_oauth)):
    auth_url = sp_oauth.get_authorize_url()

    return RedirectResponse(url=auth_url)

@router.get("/callback")
def spotify_callback(code: str = None, error: str = None):
    if error:
      
        return RedirectResponse(url="http://localhost:5173/")
    
    if not code:
        raise HTTPException(status_code=400, detail="Authorization code missing")

