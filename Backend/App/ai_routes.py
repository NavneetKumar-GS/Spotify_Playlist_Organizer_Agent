import google.generativeai as genai
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
import json
import os

router = APIRouter()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class Song(BaseModel):
    id: str
    name: str
    artist: str

class FilterRequest(BaseModel):
    prompt:str
    songs: list[Song]

@router.post("/api/filter-songs")
async def filter_songs_with_ai(request:FilterRequest):
    try:
        model = genai.GenerativeModel('gemini-3.5-flash-lite', generation_config={"response_mime_type":"application/json"})

        sys_prompt = f"""You are a ruthless and highly analytical music curator. 
        The user wants a playlist STRICTLY matching this exact vibe/command: "{request.prompt}".
        
        Below is a list of songs provided as JSON objects. You cannot hear the audio. 
        You MUST logically deduce the song's tempo, genre, and mood based purely on the artist's typical discography and the song title.
        
        CRITICAL RULES:
        1. Be brutally strict. If the user asks for "High Energy", absolutely EXCLUDE slow jams, sad songs, acoustic tracks, or mellow R&B (e.g., "Lonely" by Akon MUST be excluded from high energy).
        2. If the user asks for "Sad", exclude upbeat party anthems.
        3. If a song does not 100% perfectly fit the requested vibe, DO NOT include it. It is better to return an empty array than a wrong song.
        
        Return a JSON array containing ONLY the 'id' strings of the songs that pass this strict filter. DO NOT return markdown, explanations, or any other text.
        
        Songs to analyze: {request.songs}
        """

        respnse = model.generate_content(sys_prompt)
        matched_id = json.loads(respnse.text)

        filtered_songs = [song for song in request.songs if song.id in matched_id]

        return{"filtered_songs": filtered_songs}

    except Exception as e:
        print("GeminiError", str(e))
        raise HTTPException(status_code=500, detail=f"AI Engine failed: {str(e)}")

