import google.generativeai as genai
from pydantic import baseModel
from fastapi import APIRouter, HTTPException
import json
import os

router = APIRouter()

genai.configure(api_key=os.generate("GEMINI_API_KEY"))

class Song(baseModel):
    id: str
    name: str
    artist: str

class FilterRequest(baseModel):
    prompt:str
    songs: list[Song]

@router.post("/api/filter-songs")
async def filter_songs_with_ai(request:FilterRequest):
    try:
        model = genai.GenerativeModel('gemini-1,5-flash', generation_config={"response_mime_type":"application/json"})

        sys_prompt = f"""You are a highly analytical music curator. 
        The user wants a playlist based on this exact vibe/command: "{request.prompt}".
        Below is a list of songs provided as JSON objects. 
        Your ONLY job is to analyze the names and artists, and return a JSON array containing ONLY the 'id' strings of the songs that perfectly fit the vibe. 
        DO NOT return markdown, explanations, or any other text. Only the raw JSON array. Example format: ["id1", "id2"].
        
        Songs: {request.songs}
        """

        respnse = model.generate_content(sys_prompt)
        matched_id = json.loads(respnse.text)

        filtered_songs = [song for song in request.songs if song.id in matched_id]

        return{"filtered_songs": filtered_songs}

    except Exception as e:
        print("GeminiError", str(e))
        raise HTTPException(status_code=500, detail=f"AI Engine failed: {str(e)}")

