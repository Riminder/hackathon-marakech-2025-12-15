# backend/models/schemas.py
from pydantic import BaseModel
from typing import Optional


class SkillItem(BaseModel):
    name: str
    candidateLevel: int
    requiredLevel: int


class CandidateInfo(BaseModel):
    name: str
    email: Optional[str] = None


class ChatContext(BaseModel):
    candidateName: str
    jobTitle: str
    skillGaps: list[SkillItem]
    strengths: list[SkillItem]
    recommendations: list[str]


class AnalysisResult(BaseModel):
    score: float
    threshold: float = 0.5
    matched: bool
    detectedLanguage: str
    candidate: CandidateInfo
    skillGaps: list[SkillItem]
    strengths: list[SkillItem]
    recommendations: list[str]
    email: str
    videoUrl: Optional[str] = None
    chatContext: ChatContext
