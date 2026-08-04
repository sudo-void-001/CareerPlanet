import os
import json
from fastapi import APIRouter, HTTPException, UploadFile, File
from groq import Groq
from pydantic import BaseModel
import PyPDF2
import io
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# Initialize Groq client only if key is available. Otherwise, defer error to endpoint call.
groq_api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=groq_api_key) if groq_api_key else None

class ChatRequest(BaseModel):
    prompt: str

@router.post("/chat")
def ai_chat(req: ChatRequest):
    if not client:
        # Fallback if no key (for testing/safety)
        return {"response": "This is a fallback response because GROQ_API_KEY is not set. Please add it to your environment variables."}
    
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are a helpful, professional AI career assistant for students and recruiters on CareerPlanet."},
                {"role": "user", "content": req.prompt}
            ]
        )
        return {"response": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Error: {str(e)}")

@router.post("/analyze-resume")
async def analyze_resume(file: UploadFile = File(...)):
    if not client:
        # Fallback mock for testing if no key is set
        return {
            "overallScore": 88,
            "atsScore": 78,
            "summary": "[MOCK] Strong profile for software engineering roles. Provide GROQ_API_KEY for real analysis.",
            "missingSkills": ["Docker", "System Design"],
            "strengths": ["Python", "React"],
            "recommendations": ["Add measurable achievements", "Add Docker to your skills"]
        }

    try:
        # 1. Read PDF
        content = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        text = ""
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
                
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF.")

        # 2. Call Groq
        prompt = f"""
        Analyze this resume for a software engineering/tech role.
        Return ONLY a JSON object (no markdown formatting, no code blocks) with the following exact keys:
        - overallScore (integer 0-100)
        - atsScore (integer 0-100)
        - summary (string, short 2-3 sentence overview)
        - missingSkills (array of strings, max 4)
        - strengths (array of strings, max 5)
        - recommendations (array of strings, max 4 actionable tips)

        Resume Text:
        {text[:4000]}  # limit text length
        """

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        
        result_str = response.choices[0].message.content
        return json.loads(result_str)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Analysis Error: {str(e)}")
