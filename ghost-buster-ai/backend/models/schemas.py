# backend/models/schemas.py
from pydantic import BaseModel
from typing import Optional


class SkillItem(BaseModel):
    name: str
    candidateLevel: int
    requiredLevel: int


class CourseItem(BaseModel):
    name: str
    platform: str
    url: str


class Recommendation(BaseModel):
    type: str  # "hardskill" or "softskill"
    skill: Optional[str] = None
    title: str
    description: str
    courses: list[CourseItem] = []


class CandidateInfo(BaseModel):
    name: str
    email: Optional[str] = None


class ChatContext(BaseModel):
    candidateName: str
    jobTitle: str
    skillGaps: list[SkillItem]
    strengths: list[SkillItem]
    recommendations: list[Recommendation]


class AnalysisResult(BaseModel):
    score: float
    threshold: float = 0.5
    matched: bool
    detectedLanguage: str
    candidate: CandidateInfo
    skillGaps: list[SkillItem]
    strengths: list[SkillItem]
    recommendations: list[Recommendation]
    email: str
    videoUrl: Optional[str] = None
    chatContext: ChatContext
