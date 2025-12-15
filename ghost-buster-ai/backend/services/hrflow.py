# backend/services/hrflow.py
"""
HRFlow.ai integration - uses existing profiles, no parsing.
"""
import os
from fastapi import HTTPException


def get_available_jobs() -> list[dict]:
    """Fetch jobs from HRFlow board."""
    from hrflow import Hrflow

    board_key = os.getenv("HRFLOW_BOARD_KEY")
    client = Hrflow(
        api_secret=os.getenv("HRFLOW_API_KEY"),
        api_user=os.getenv("HRFLOW_USER_EMAIL")
    )

    response = client.job.storing.list(
        board_keys=[board_key],
        limit=20
    )

    if response.get("code") != 200:
        raise HTTPException(status_code=500, detail=f"Failed to fetch jobs: {response.get('message')}")

    jobs = response.get("data", [])
    return [
        {
            "key": job.get("key"),
            "title": job.get("name", "Untitled"),
            "company": (job.get("tags", [{}])[0].get("value", "") if job.get("tags") else ""),
            "location": job.get("location", {}).get("text", "Remote"),
        }
        for job in jobs
    ]


def get_available_profiles() -> list[dict]:
    """Fetch existing profiles from HRFlow source."""
    from hrflow import Hrflow

    source_key = os.getenv("HRFLOW_SOURCE_KEY")
    client = Hrflow(
        api_secret=os.getenv("HRFLOW_API_KEY"),
        api_user=os.getenv("HRFLOW_USER_EMAIL")
    )

    response = client.profile.storing.list(
        source_keys=[source_key],
        limit=20,
        return_profile=True
    )

    if response.get("code") != 200:
        raise HTTPException(status_code=500, detail=f"Failed to fetch profiles: {response.get('message')}")

    profiles = response.get("data", [])
    result = []
    for p in profiles:
        info = p.get("info", {})
        # Try to build a meaningful name
        first = info.get("first_name") or ""
        last = info.get("last_name") or ""
        full_name = f"{first} {last}".strip()

        # Fallback to summary if no name
        if not full_name:
            summary = info.get("summary", "")
            full_name = summary[:50] if summary else "Candidate"

        result.append({
            "key": p.get("key"),
            "name": full_name,
            "email": info.get("email") or "",
        })
    return result


async def get_profile(profile_key: str) -> dict:
    """Get a specific profile by key."""
    from hrflow import Hrflow

    source_key = os.getenv("HRFLOW_SOURCE_KEY")
    client = Hrflow(
        api_secret=os.getenv("HRFLOW_API_KEY"),
        api_user=os.getenv("HRFLOW_USER_EMAIL")
    )

    response = client.profile.storing.get(
        source_key=source_key,
        key=profile_key
    )

    if response.get("code") != 200:
        raise HTTPException(status_code=404, detail=f"Profile not found: {profile_key}")

    return response.get("data", {})


async def get_job(job_key: str) -> dict:
    """Get a specific job by key."""
    from hrflow import Hrflow

    board_key = os.getenv("HRFLOW_BOARD_KEY")
    client = Hrflow(
        api_secret=os.getenv("HRFLOW_API_KEY"),
        api_user=os.getenv("HRFLOW_USER_EMAIL")
    )

    response = client.job.storing.get(
        board_key=board_key,
        key=job_key
    )

    if response.get("code") != 200:
        raise HTTPException(status_code=404, detail=f"Job not found: {job_key}")

    return response.get("data", {})


async def analyze_candidate(profile_key: str, job_key: str) -> dict:
    """Analyze existing profile against job."""

    # Get profile and job
    profile_data = await get_profile(profile_key)
    job_data = await get_job(job_key)

    # Score
    score = await _score_profile(profile_key, job_key)

    # Analyze skills
    skill_analysis = _analyze_skills(profile_data, job_data)

    # Recommendations (AI-powered with course suggestions)
    job_title = job_data.get("name", "Position")
    recommendations = await _generate_recommendations(
        skill_analysis["gaps"],
        skill_analysis["strengths"],
        job_title
    )

    # Extract name - handle None values
    info = profile_data.get("info", {})
    first_name = info.get("first_name") or "Candidate"
    last_name = info.get("last_name") or ""

    return {
        "score": score,
        "profile": {
            "first_name": first_name,
            "last_name": last_name,
            "email": info.get("email"),
        },
        "job": {
            "key": job_key,
            "title": job_data.get("name", "Position"),
        },
        "skill_gaps": skill_analysis["gaps"],
        "strengths": skill_analysis["strengths"],
        "detected_language": profile_data.get("text_language", "en"),
        "recommendations": recommendations,
    }


async def _score_profile(profile_key: str, job_key: str) -> float:
    """Score profile against job."""
    from hrflow import Hrflow

    source_key = os.getenv("HRFLOW_SOURCE_KEY")
    board_key = os.getenv("HRFLOW_BOARD_KEY")

    client = Hrflow(
        api_secret=os.getenv("HRFLOW_API_KEY"),
        api_user=os.getenv("HRFLOW_USER_EMAIL")
    )

    try:
        response = client.profile.scoring.list(
            source_keys=[source_key],
            board_key=board_key,
            job_key=job_key,
            limit=100
        )

        if response.get("code") != 200:
            return 0.5

        predictions = response.get("data", {}).get("predictions", [])
        profiles = response.get("data", {}).get("profiles", [])

        for i, profile in enumerate(profiles):
            if profile.get("key") == profile_key and i < len(predictions):
                pred = predictions[i]
                if isinstance(pred, list) and len(pred) >= 2:
                    return round(pred[1], 2)

        return 0.5
    except Exception:
        return 0.5


def _analyze_skills(profile_data: dict, job_data: dict) -> dict:
    """Compare candidate skills vs job requirements."""
    candidate_skills = {s.get("name", "").lower(): s for s in profile_data.get("skills", [])}
    job_skills = {s.get("name", "").lower(): s for s in job_data.get("skills", [])}

    gaps = []
    strengths = []

    for skill_key, job_skill in job_skills.items():
        candidate_skill = candidate_skills.get(skill_key)
        required_level = 70

        if candidate_skill:
            candidate_level = 65
            if candidate_level >= required_level:
                strengths.append({"name": job_skill.get("name"), "candidateLevel": candidate_level, "requiredLevel": required_level})
            else:
                gaps.append({"name": job_skill.get("name"), "candidateLevel": candidate_level, "requiredLevel": required_level})
        else:
            gaps.append({"name": job_skill.get("name"), "candidateLevel": 0, "requiredLevel": required_level})

    for skill_key, skill in candidate_skills.items():
        if skill_key not in job_skills:
            strengths.append({"name": skill.get("name"), "candidateLevel": 75, "requiredLevel": 0})

    gaps.sort(key=lambda x: x["requiredLevel"] - x["candidateLevel"], reverse=True)
    strengths.sort(key=lambda x: x["candidateLevel"], reverse=True)

    return {"gaps": gaps[:5], "strengths": strengths[:5]}


async def _generate_recommendations(gaps: list[dict], strengths: list[dict], job_title: str) -> list[dict]:
    """Generate AI-powered recommendations with course suggestions."""
    import anthropic

    if not gaps:
        return [{
            "type": "general",
            "skill": None,
            "title": "Continue Building Your Portfolio",
            "description": "Keep developing projects relevant to this role to strengthen your application.",
            "courses": []
        }]

    # Prepare skill data for Claude
    gaps_text = ", ".join([g["name"] for g in gaps[:5]])
    strengths_text = ", ".join([s["name"] for s in strengths[:3]]) if strengths else "None identified"

    prompt = f"""Based on these skill gaps for a {job_title} position, provide 3-4 specific learning recommendations.

SKILL GAPS: {gaps_text}
EXISTING STRENGTHS: {strengths_text}

For each recommendation, provide:
1. Whether it's a "hardskill" or "softskill"
2. The specific skill to develop
3. A brief actionable title (max 10 words)
4. A description (1-2 sentences)
5. 1-2 specific online courses with platform and URL

Respond in this exact JSON format:
[
  {{
    "type": "hardskill" or "softskill",
    "skill": "skill name",
    "title": "Short actionable title",
    "description": "Brief description of what to learn and why",
    "courses": [
      {{"name": "Course Name", "platform": "Coursera/Udemy/LinkedIn Learning/etc", "url": "https://..."}}
    ]
  }}
]

Focus on reputable platforms: Coursera, Udemy, LinkedIn Learning, Pluralsight, edX, freeCodeCamp.
Only return the JSON array, no other text."""

    try:
        client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1000,
            messages=[{"role": "user", "content": prompt}]
        )

        import json
        result = json.loads(response.content[0].text)
        return result
    except Exception as e:
        print(f"Failed to generate AI recommendations: {e}")
        # Fallback to simple recommendations
        return [
            {
                "type": "hardskill",
                "skill": gaps[0]["name"] if gaps else "technical skills",
                "title": f"Build foundational knowledge in {gaps[0]['name'] if gaps else 'key areas'}",
                "description": "Focus on developing core competencies required for this role.",
                "courses": []
            }
        ]
