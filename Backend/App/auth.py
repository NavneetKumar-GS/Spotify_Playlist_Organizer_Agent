from fastapi import FastAPI , Depends, APIRouter
from fastapi.responses import RedirectResponse
from spotipy.oauth2 import SpotifyOAuth
import os

router = APIRouter()

def get_spotify_oauth():
    return SpotifyOAuth(
        client_id=  os.getenv("SPOTIFY_CLIENT_ID"),
        client_secret= os.getenv("SPOTIFY_CLIENT_SECRET"),
        redirect_uri= os.getenv("SPOTIFY_REDIRECT_URI"),
        scope="user-library-read playlist-modify-private playlist-modify-public",  
        open_browser= False
    )

@router.get("/login")
def spotify_login(sp_oauth: SpotifyOAuth = Depends(get_spotify_oauth)):
    auth_url = sp_oauth.get_authorize_url()

    return RedirectResponse(url=auth_url)

@router.get("/callback")
def callback(code: str , sp_oauth: SpotifyOAuth = Depends(get_spotify_oauth)):
    token_info = sp_oauth.get_access_token(code)

    return RedirectResponse(url=f"http://localhost:5173?token={token_info['access_token']}")
