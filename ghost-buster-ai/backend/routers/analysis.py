# backend/routers/analysis.py
from fastapi import APIRouter
from pydantic import BaseModel
from models.schemas import AnalysisResult, SkillItem, CandidateInfo, ChatContext
from services.hrflow import get_available_jobs, get_available_profiles, analyze_candidate
from services.email import generate_rejection_email

router = APIRouter(prefix="/api")


@router.get("/jobs")
async def list_jobs():
    """Return available jobs from HRFlow board."""
    return {"jobs": get_available_jobs()}


@router.get("/profiles")
async def list_profiles():
    """Return available profiles from HRFlow source."""
    return {"profiles": get_available_profiles()}


class AnalyzeRequest(BaseModel):
    profile_key: str
    job_key: str


@router.post("/analyze", response_model=AnalysisResult)
async def analyze(request: AnalyzeRequest):
    """Analyze existing profile against job."""

    # 1. Get analysis from HRFlow
    analysis = await analyze_candidate(request.profile_key, request.job_key)

    # 2. Generate rejection email
    email = await generate_rejection_email(
        candidate=analysis["profile"],
        job=analysis["job"],
        gaps=analysis["skill_gaps"],
        strengths=analysis["strengths"],
        language=analysis["detected_language"]
    )

    # 3. Build response
    candidate_name = f"{analysis['profile'].get('first_name', '')} {analysis['profile'].get('last_name', '')}".strip()

    skill_gaps = [
        SkillItem(
            name=gap["name"],
            candidateLevel=gap["candidateLevel"],
            requiredLevel=gap["requiredLevel"]
        )
        for gap in analysis["skill_gaps"]
    ]

    strengths = [
        SkillItem(
            name=s["name"],
            candidateLevel=s["candidateLevel"],
            requiredLevel=s["requiredLevel"]
        )
        for s in analysis["strengths"]
    ]

    chat_context = ChatContext(
        candidateName=analysis["profile"].get("first_name") or candidate_name or "Candidate",
        jobTitle=analysis["job"]["title"],
        skillGaps=skill_gaps,
        strengths=strengths,
        recommendations=analysis["recommendations"]
    )

    return AnalysisResult(
        score=analysis["score"],
        threshold=0.5,
        matched=analysis["score"] >= 0.5,
        detectedLanguage=analysis["detected_language"],
        candidate=CandidateInfo(
            name=candidate_name or "Candidate",
            email=analysis["profile"].get("email")
        ),
        skillGaps=skill_gaps,
        strengths=strengths,
        recommendations=analysis["recommendations"],
        email=email,
        videoUrl=None,
        chatContext=chat_context
    )
