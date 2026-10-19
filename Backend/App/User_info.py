from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
import spotipy

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.get("/api/me")
def get_user_profile(token: str = Depends(oauth2_scheme)):
    try: 
        sp = spotipy.Spotify(auth=token)
        user = sp.current_user()
        return{
            "name": user.get("display_name", "Unknown"),
            "email": user.get("email", "Email permission not granted"),
            "id": user.get("id")
        }
    except Exception as e:
        raise HTTPException(status_code = 401, detail=f"Failed to fetch profile: {str(e)}")