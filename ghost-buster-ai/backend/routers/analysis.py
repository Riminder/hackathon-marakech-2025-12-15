# backend/routers/analysis.py
from fastapi import APIRouter, BackgroundTasks
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional
from models.schemas import AnalysisResult, SkillItem, CandidateInfo, ChatContext, Recommendation, CourseItem
from services.hrflow import get_available_jobs, get_available_profiles, analyze_candidate
from services.email import generate_rejection_email
from services.video import generate_avatar_video

router = APIRouter(prefix="/api")

# Simple in-memory store for video generation status (use Redis in production)
video_jobs: dict[str, dict] = {}


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
    roast_mode: bool = False


@router.post("/analyze", response_model=AnalysisResult)
async def analyze(request: AnalyzeRequest):
    """Analyze existing profile against job."""

    # 1. Get analysis from HRFlow
    analysis = await analyze_candidate(request.profile_key, request.job_key)

    # 2. Generate rejection email (or roast email)
    email = await generate_rejection_email(
        candidate=analysis["profile"],
        job=analysis["job"],
        gaps=analysis["skill_gaps"],
        strengths=analysis["strengths"],
        language=analysis["detected_language"],
        roast_mode=request.roast_mode
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

    # Convert recommendations to Recommendation objects
    recommendations = [
        Recommendation(
            type=rec.get("type", "hardskill"),
            skill=rec.get("skill"),
            title=rec.get("title", ""),
            description=rec.get("description", ""),
            courses=[
                CourseItem(
                    name=c.get("name", ""),
                    platform=c.get("platform", ""),
                    url=c.get("url", "")
                )
                for c in rec.get("courses", [])
            ]
        )
        for rec in analysis["recommendations"]
    ]

    chat_context = ChatContext(
        candidateName=analysis["profile"].get("first_name") or candidate_name or "Candidate",
        jobTitle=analysis["job"]["title"],
        skillGaps=skill_gaps,
        strengths=strengths,
        recommendations=recommendations
    )

    return AnalysisResult(
        score=analysis["score"],
        threshold=0.8,
        matched=analysis["score"] >= 0.8,
        detectedLanguage=analysis["detected_language"],
        candidate=CandidateInfo(
            name=candidate_name or "Candidate",
            email=analysis["profile"].get("email")
        ),
        skillGaps=skill_gaps,
        strengths=strengths,
        recommendations=recommendations,
        email=email,
        videoUrl=None,
        chatContext=chat_context
    )


class VideoRequest(BaseModel):
    email_content: str
    language: str = "en"


class VideoResponse(BaseModel):
    job_id: str
    status: str
    video_url: Optional[str] = None


import uuid
import asyncio


async def _generate_video_task(job_id: str, email_content: str, language: str):
    """Background task to generate video."""
    video_jobs[job_id]["status"] = "processing"

    try:
        video_url, error = await generate_avatar_video(email_content, language)

        if video_url:
            video_jobs[job_id]["status"] = "completed"
            video_jobs[job_id]["video_url"] = video_url
        else:
            video_jobs[job_id]["status"] = "failed"
            video_jobs[job_id]["error"] = error or "Video generation failed"

    except Exception as e:
        video_jobs[job_id]["status"] = "failed"
        video_jobs[job_id]["error"] = str(e)


@router.post("/generate-video")
async def generate_video(request: VideoRequest, background_tasks: BackgroundTasks):
    """Start video generation in the background."""
    job_id = str(uuid.uuid4())

    video_jobs[job_id] = {
        "status": "pending",
        "video_url": None,
        "error": None
    }

    # Start video generation in background
    background_tasks.add_task(
        _generate_video_task,
        job_id,
        request.email_content,
        request.language
    )

    return {"job_id": job_id, "status": "pending"}


@router.get("/video-status/{job_id}")
async def get_video_status(job_id: str):
    """Check video generation status."""
    if job_id not in video_jobs:
        return JSONResponse(
            status_code=404,
            content={"error": "Job not found"}
        )

    job = video_jobs[job_id]
    return {
        "job_id": job_id,
        "status": job["status"],
        "video_url": job.get("video_url"),
        "error": job.get("error")
    }
