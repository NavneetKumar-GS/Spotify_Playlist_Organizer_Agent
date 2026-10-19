from pydantic import BaseModel
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
import spotipy

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")



class PlaylistCreateRequest(BaseModel):
    name: str
    track_ids: List[str]

@router.post("/api/create-playlist")
def create_custom_playlist(request: PlaylistCreateRequest, token: str = Depends(oauth2_scheme)):
    try:
 
        sp = spotipy.Spotify(auth=token)
        

        new_playlist = sp.current_user_playlist_create(
            name=request.name,
            public=False, 
            description="Created by AI Spotify Agent"
        )

        if request.track_ids:
            sp.playlist_add_items(playlist_id=new_playlist['id'], items=request.track_ids)

        return {"Status":"Success", "Playlist_url":new_playlist['external_urls']['spotify']}

    except Exception as e:
        print("Playlist Creation error: ", str(e))
        raise HTTPException(status_code=500, detail=str(e))