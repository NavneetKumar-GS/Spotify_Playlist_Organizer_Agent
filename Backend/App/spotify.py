from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
import spotipy
from dotenv import load_dotenv


load_dotenv()

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl = "token")

@router.get("/api/songs")
def get_spotify_profile(token: str = Depends(oauth2_scheme)):
    try:
        sp = spotipy.Spotify(auth=token)
        extracted_song=[]

        results = sp.current_user_saved_tracks(limit=50)

        while results:
            for item in results['items']:
                track = item['track']

                if not track or not track.get('id'):
                    continue

                extracted_song.append({
                    "id": track['id'],
                    "name": track['name'],
                    "artist": track['artists'][0]['name']
                })

            if results['next']:
                results = sp.next(results)
            else:
                results = None
                
        return extracted_song
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
