# ToolsWaala - Deployment Instructions

This repository contains the full source code for ToolsWaala (toolswaala.in).

## Environment Setup

1. Copy `.env.example` to `.env` in the root directory.
2. Fill in the required API keys (Claude API, Supabase URL/Key).
3. Set `VITE_API_URL` in the frontend environment during deployment.

## Database Setup (Supabase)

1. Create a new Supabase project.
2. Open the SQL Editor and run the contents of `supabase-schema.sql`.
3. Copy the Project URL and anon key to your backend `.env` / Render environment variables.

## Frontend Deployment (Vercel)

1. Import the `frontend` folder to Vercel.
2. Set the Framework Preset to `Vite`.
3. Add the Environment Variable: `VITE_API_URL = https://your-backend-url.onrender.com`
4. The included `vercel.json` ensures React Router works correctly on Vercel.

## Backend Deployment (Render)

1. Connect your repository to Render.
2. Create a new "Web Service".
3. Use the following settings (or select the `render.yaml` blueprint):
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add the Environment Variables:
   - `CLAUDE_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_KEY`

## Local Development

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```
