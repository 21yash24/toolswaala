from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.invoice import router as invoice_router
from routes.agreement import router as agreement_router
from routes.salary import router as salary_router
from routes.ai import router as ai_router
from routes.upi import router as upi_router

app = FastAPI(
    title="ToolsWaala API",
    description="Backend API for ToolsWaala — India's Free Business Toolkit",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(invoice_router, prefix="/api")
app.include_router(agreement_router, prefix="/api")
app.include_router(salary_router, prefix="/api")
app.include_router(ai_router, prefix="/api")
app.include_router(upi_router, prefix="/api")


@app.get("/")
def root():
    return {"status": "ok", "app": "ToolsWaala API", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "healthy"}
