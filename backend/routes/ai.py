from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import json
import httpx

router = APIRouter()

CLAUDE_API_KEY = os.getenv("CLAUDE_API_KEY")

class NameRequest(BaseModel):
    industry: str
    keywords: str
    language: str

@router.post("/ai/business-names")
async def generate_names(request: NameRequest):
    if not CLAUDE_API_KEY:
        # If no API key, return 500 so frontend falls back to sample generator
        raise HTTPException(status_code=500, detail="Claude API key not configured")

    prompt = f"""
    You are an expert brand naming consultant for the Indian market.
    Generate 10 creative business names for a '{request.industry}' business.
    Keywords: {request.keywords}
    Language preference: {request.language} (English, Hindi, or Hinglish)

    Return ONLY a valid JSON object in this exact format, with no markdown formatting, no comments, and nothing else:
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
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": CLAUDE_API_KEY,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json"
                },
                json={
                    "model": "claude-3-sonnet-20240229",
                    "max_tokens": 1024,
                    "system": "You are a specialized business name generator returning raw JSON.",
                    "messages": [
                        {"role": "user", "content": prompt}
                    ]
                },
                timeout=15.0
            )

        response.raise_for_status()
        result = response.json()
        
        # Claude returns content in content[0]['text']
        content_text = result["content"][0]["text"]
        
        # Strip potential markdown formatting if Claude disobeys
        if content_text.startswith("```json"):
            content_text = content_text[7:]
        if content_text.endswith("```"):
            content_text = content_text[:-3]
            
        data = json.loads(content_text.strip())
        return data

    except Exception as e:
        print(f"Claude API Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate names")
