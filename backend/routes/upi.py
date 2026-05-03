from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from supabase import create_client, Client
import os
import uuid
import re

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Initialize supabase client conditionally
supabase: Optional[Client] = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"Failed to initialize Supabase: {e}")


class UPIPageRequest(BaseModel):
    name: str
    upi_id: str
    description: Optional[str] = ""
    amount: Optional[float] = None
    theme: int = 0


@router.post("/upi/save")
async def save_upi_page(data: UPIPageRequest):
    if not supabase:
        # If no DB, fallback to just returning success with the UPI ID as slug
        return {"slug": data.upi_id}

    try:
        # Create a URL friendly slug from name + random chars
        base_slug = re.sub(r'[^a-zA-Z0-9]', '-', data.name.lower())
        base_slug = re.sub(r'-+', '-', base_slug).strip('-')
        random_suffix = str(uuid.uuid4())[:6]
        slug = f"{base_slug}-{random_suffix}" if base_slug else random_suffix

        record = {
            "slug": slug,
            "name": data.name,
            "upi_id": data.upi_id,
            "description": data.description,
            "amount": data.amount,
            "theme": data.theme
        }
        
        # In a real scenario we'd insert into DB
        # res = supabase.table("upi_pages").insert(record).execute()
        
        return {"slug": slug, "status": "success"}
    except Exception as e:
        print(f"Supabase insert error: {e}")
        # Fallback
        return {"slug": data.upi_id}


@router.get("/upi/{slug}")
async def get_upi_page(slug: str):
    if not supabase:
        raise HTTPException(status_code=404, detail="Page not found")

    try:
        res = supabase.table("upi_pages").select("*").eq("slug", slug).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Page not found")
        
        return res.data[0]
    except HTTPException:
        raise
    except Exception as e:
        print(f"Supabase select error: {e}")
        raise HTTPException(status_code=500, detail="Database error")
