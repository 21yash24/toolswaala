from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import json
import httpx

import google.generativeai as genai

router = APIRouter()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

class NameRequest(BaseModel):
    industry: str
    keywords: str
    language: str

@router.post("/ai/business-names")
async def generate_names(request: NameRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API key not configured")

    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')

    prompt = f"""
    You are an expert brand naming consultant for the Indian market.
    Generate 10 creative business names for a '{request.industry}' business.
    Keywords: {request.keywords}
    Language preference: {request.language} (English, Hindi, or Hinglish)

    Return ONLY a valid JSON object in this exact format:
    {{
        "names": [
            {{
                "name": "Name 1",
                "meaning": "Brief explanation of why it works",
                "domain": "name1.in",
                "tagline": "A catchy tagline"
            }}
        ]
    }}
    """

    try:
        response = model.generate_content(prompt)
        content_text = response.text.strip()
        
        # Clean markdown if Gemini adds it
        if content_text.startswith("```json"):
            content_text = content_text[7:]
        if content_text.endswith("```"):
            content_text = content_text[:-3]
            
        data = json.loads(content_text.strip())
        return data

    except Exception as e:
        print(f"Gemini API Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate names")
