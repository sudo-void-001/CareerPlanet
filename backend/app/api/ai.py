"""
CareerPlanet AI Module
Provides resume analysis (with realistic scoring) and conversational chat via Groq.
"""
import os
import json
import io
import logging
from fastapi import APIRouter, HTTPException, UploadFile, File
from groq import Groq
from pydantic import BaseModel
import PyPDF2
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)
router = APIRouter()

groq_api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=groq_api_key) if groq_api_key else None


from typing import List, Dict, Optional

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    context: Optional[str] = ""


# ─── CHAT ENDPOINT ────────────────────────────────────────────────────────────

@router.post("/chat")
def ai_chat(req: ChatRequest):
    if not client:
        return {
            "response": (
                "**CareerPlanet AI** is not fully configured yet.\n\n"
                "Please ask your administrator to set the `GROQ_API_KEY` environment variable "
                "to enable AI-powered career advice.\n\n"
                "In the meantime, here are some quick tips:\n"
                "- Keep your resume to 1-2 pages\n"
                "- Quantify achievements (e.g. 'improved performance by 40%')\n"
                "- Tailor your resume for each role\n"
                "- Use action verbs (Developed, Built, Led, Improved)"
            )
        }

    system_prompt = """You are CareerPlanet AI — an expert career coach and resume analyst for CareerPlanet, 
an AI-powered career platform. Your mission is to help students land their dream jobs.

Your personality:
- Warm, encouraging, and professional
- Data-driven with specific, actionable advice
- Knowledgeable about tech industry, hiring trends, and resume best practices
- Concise but comprehensive responses

For career questions: Give structured, practical advice with numbered tips.
For resume reviews: Point out specific improvements with examples.
For interview prep: Provide real questions and model answers.
Always use relevant emojis sparingly to make responses engaging."""

    try:
        formatted_messages = [{"role": "system", "content": system_prompt}]
        if req.context:
            formatted_messages.append({"role": "user", "content": req.context})
        
        for msg in req.messages:
            # map sender 'ai' to 'assistant', 'user' to 'user'
            role = "assistant" if msg.role == "ai" else "user"
            formatted_messages.append({"role": role, "content": msg.content})

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=formatted_messages,
            max_tokens=1024,
            temperature=0.7
        )
        return {"response": response.choices[0].message.content}

    except Exception as e:
        logger.error(f"AI Chat error: {e}")
        raise HTTPException(status_code=500, detail=f"AI Error: {str(e)}")


# ─── RESUME ANALYSIS ──────────────────────────────────────────────────────────

@router.post("/analyze-resume")
async def analyze_resume_ai(file: UploadFile = File(...)):
    """
    Standalone AI resume analysis endpoint (not the same as /resume/upload).
    Returns detailed structured analysis for the Resume page display.
    """
    try:
        content = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        text = ""
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"

        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF.")

        return _analyze_text(text)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Resume analysis error: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")


def _analyze_text(text: str) -> dict:
    """Core analysis function — used by both the standalone endpoint and resume upload."""
    if not client:
        return _fallback_analysis(text)

    prompt = f"""You are an expert HR analyst and ATS system evaluating a resume for a technology/engineering role.

Analyze this resume comprehensively and provide a REALISTIC, JUSTIFIED score. 

SCORING CRITERIA:
- Skills Coverage (20 pts): Are required modern tech skills present? Specific technologies listed?
- Projects & Experience (25 pts): Quality and quantity of projects/work experience. Real-world impact?
- Education (15 pts): Degree relevance, institution, GPA (if listed), certifications?
- Achievements & Impact (15 pts): Quantified results (%, $, scale)? Leadership? Awards?
- ATS Compatibility (15 pts): Proper formatting, keyword density, no tables/graphics text loss?
- Resume Completeness (10 pts): Contact info, summary, all sections present?

IMPORTANT SCORING RULES:
- A fresh graduate with basic skills should score 55-70
- Someone with solid projects and internship experience: 70-82
- Experienced professional with proven impact: 83-93
- Perfect, ATS-optimized resume: 94-98
- NEVER give 100. NEVER give below 30 unless resume is blank.
- ATS score is usually within ±8 of overall score
- Provide 3-5 specific strengths and 3-5 specific missing items

Return ONLY a valid JSON object with these exact keys:
{{
  "overall_score": <integer 30-98>,
  "ats_score": <integer 30-98>,
  "summary": "<2-3 sentence professional analysis>",
  "strengths": ["<specific strength 1>", "<specific strength 2>", ...],
  "weaknesses": ["<specific weakness 1>", "<specific weakness 2>", ...],
  "matched_skills": ["<skill from resume>", ...],
  "missing_skills": ["<important missing skill>", ...],
  "improvements": ["<specific actionable tip>", ...],
  "score_justification": "<2-3 sentences explaining why this score was given>"
}}

Resume Text (first 4000 chars):
{text[:4000]}"""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            max_tokens=1500,
            temperature=0.3
        )
        result = json.loads(response.choices[0].message.content)
        
        # Validate and clamp scores
        result["overall_score"] = max(30, min(98, int(result.get("overall_score", 70))))
        result["ats_score"] = max(30, min(98, int(result.get("ats_score", 65))))
        
        # Ensure all required fields exist
        for field in ["strengths", "weaknesses", "matched_skills", "missing_skills", "improvements"]:
            if field not in result or not isinstance(result[field], list):
                result[field] = []
        
        return result

    except Exception as e:
        logger.error(f"Groq analysis failed: {e}")
        return _fallback_analysis(text)


def _fallback_analysis(text: str) -> dict:
    """Heuristic-based analysis when Groq is unavailable."""
    text_lower = text.lower()
    
    tech_skills = [
        "python", "javascript", "java", "c++", "react", "node.js", "sql", 
        "mongodb", "docker", "kubernetes", "aws", "git", "fastapi", "django",
        "tensorflow", "pytorch", "machine learning", "deep learning", "linux"
    ]
    
    soft_indicators = {
        "projects": any(w in text_lower for w in ["project", "built", "developed", "created"]),
        "experience": any(w in text_lower for w in ["experience", "internship", "worked at", "employed"]),
        "education": any(w in text_lower for w in ["bachelor", "master", "b.tech", "b.e.", "university", "college"]),
        "achievements": any(w in text_lower for w in ["%", "improved", "increased", "award", "winner", "rank"]),
        "contact": any(w in text_lower for w in ["@", "linkedin", "github", "phone", "mobile"]),
    }

    found_skills = [skill for skill in tech_skills if skill in text_lower]
    missing = [s for s in ["docker", "kubernetes", "aws", "react", "python"] if s not in text_lower]
    
    # Heuristic scoring
    base = 45
    base += len(found_skills) * 2.5
    base += sum(5 for v in soft_indicators.values() if v)
    base = int(min(82, max(40, base)))
    ats = max(35, min(80, base - 5))

    return {
        "overall_score": base,
        "ats_score": ats,
        "summary": f"Resume analyzed using heuristic scoring (AI unavailable). Found {len(found_skills)} technical skills. Profile appears {'strong' if base >= 70 else 'moderate' if base >= 55 else 'entry-level'}.",
        "strengths": found_skills[:5] or ["Technical knowledge"],
        "weaknesses": ["Quantified achievements missing" if not soft_indicators["achievements"] else None,
                       "Work experience section needs expansion" if not soft_indicators["experience"] else None],
        "matched_skills": found_skills[:8],
        "missing_skills": missing[:5],
        "improvements": [
            "Add quantifiable achievements (e.g., 'improved performance by 40%')",
            "Include a professional summary at the top",
            "Use strong action verbs (Developed, Architected, Led, Optimized)"
        ],
        "score_justification": f"Score based on presence of {len(found_skills)} technical skills and {sum(soft_indicators.values())}/5 resume sections."
    }
