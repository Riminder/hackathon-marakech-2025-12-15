# backend/services/email.py
import os
import anthropic


def _get_client():
    return anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))


async def generate_rejection_email(candidate, job, gaps, strengths, language):
    client = _get_client()
    
    prompt = f"""Generate a warm, constructive rejection email.

CANDIDATE: {candidate.get('first_name') or ''} {candidate.get('last_name') or ''}
JOB: {job['title']}
LANGUAGE: Write in {language}

STRENGTHS TO PRAISE:
{strengths}

SKILL GAPS (be constructive):
{gaps}

Requirements:
- Warm, human tone
- Praise their strengths genuinely
- Frame gaps as growth opportunities
- Mention they'll receive personalized recommendations via chat
- Keep it concise (150 words max)
- Include a line inviting them to chat for feedback and career advice
"""

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=500,
        messages=[{"role": "user", "content": prompt}]
    )
    
    return response.content[0].text