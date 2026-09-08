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
app = FastAPI(title="EcoTruth Backend", version="2.0")

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

# Load Reference Dataset
try:
    with open("dataset.json", "r") as f:
        dataset = json.load(f)
    certifications_list = ", ".join([item["name"] for item in dataset.get("certifications", [])])
    red_flags_list = ", ".join([item["phrase"] for item in dataset.get("red_flags", [])])
except Exception as e:
    print(f"Warning: Could not load dataset.json: {e}")
    certifications_list = ""
    red_flags_list = ""

# Request schema from frontend
class ClaimRequest(BaseModel):
    claim: str

# Strict structural schema for Gemini AI response
class AnalysisSchema(BaseModel):
    rating: str = Field(description="Strictly 'Certified', 'Vague', or 'Red Flag'")
    explanation: str = Field(description="A short summary explaining the reasoning grounded in the reference dataset.")
    key_red_flags: list[str] = Field(description="List of specific problematic phrases or missing verification points.")

@app.get("/")
def home():
    return {"message": "EcoTruth Backend is live and running! 💪🏻"}

@app.post("/analyze-claim")
def analyze_claim(request: ClaimRequest):
    if not request.claim.strip():
        raise HTTPException(status_code=400, detail="Claim text cannot be empty.")
    
    try:
        prompt = f"""
        You are an expert sustainability auditor evaluating product claims for potential greenwashing.

        REFERENCE DATASET FOR VERIFICATION:
        - Verified Official Certifications: {certifications_list}
        - Known Greenwashing Red-Flag Phrases: {red_flags_list}

        RULES:
        1. Cross-reference the user claim against the REFERENCE DATASET.
        2. If the claim includes an official third-party certification (e.g., USDA Organic, B Corp, FSC), assign a 'Certified' rating.
        3. If the claim relies on unregulated marketing buzzwords (e.g., '100% eco-friendly', 'all-natural', 'green') without verifiable backing, assign a 'Red Flag' rating.
        4. If the claim is ambiguous or lacks sufficient context, assign a 'Vague' rating.

        User Claim: "{request.claim}"
        """
        
        # Calling Gemini 2.0 Flash with Structured Output Config
        response = client.models.generate_content(
            model="gemini-2.0-flash",
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