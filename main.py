import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from google import genai

# Load environment variables
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

# Initialize FastAPI app
app = FastAPI(title="TrustCheck Tgrā Backend", version="2.0")

# Enable CORS for React Frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini Client
client = genai.Client(api_key=api_key)

# Request schema from frontend
class ClaimRequest(BaseModel):
    claim: str

# Strict structural schema for Gemini AI response
class AnalysisSchema(BaseModel):
    rating: str = Field(description="Strictly 'Certified', 'Vague', or 'Red Flag'")
    explanation: str = Field(description="A short summary explaining the reasoning.")
    key_red_flags: list[str] = Field(description="List of key points making it trustworthy or suspicious.")

@app.get("/")
def home():
    return {"message": "TrustCheck Tgrā Backend is live and running! 💪🏻"}

@app.post("/analyze-claim")
def analyze_claim(request: ClaimRequest):
    if not request.claim.strip():
        raise HTTPException(status_code=400, detail="Claim text cannot be empty.")
    
    try:
        prompt = f"""
        Analyze the following sustainability or eco-friendly claim for potential greenwashing.
        Claim: "{request.claim}"
        """
        
        # Enforcing structured JSON output directly from Gemini
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": AnalysisSchema,
            },
        )
        
        # Parse text response into clean dictionary
        structured_data = json.loads(response.text)
        
        return {
            "status": "success",
            "claim": request.claim,
            "data": structured_data
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
