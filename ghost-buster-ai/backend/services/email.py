# backend/services/email.py
import os
import anthropic


def _get_client():
    return anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))


async def generate_rejection_email(candidate, job, gaps, strengths, language, roast_mode=False):
    client = _get_client()

    candidate_name = f"{candidate.get('first_name') or ''} {candidate.get('last_name') or ''}".strip() or "Candidate"

    if roast_mode:
        prompt = f"""Generate a brutally honest, savage roast email about why this candidate didn't get the job.
Be funny but not mean-spirited - think comedy roast, not bullying. Use humor and wit.

CANDIDATE: {candidate_name}
JOB: {job['title']}
LANGUAGE: Write in {language}

THEIR SO-CALLED "STRENGTHS":
{strengths}

SKILL GAPS (the real tea):
{gaps}

Requirements:
- Roast their skill gaps hilariously
- Be sarcastic about what they're missing
- Include some self-deprecating humor about the hiring process
- End with a backhanded compliment
- Keep it to 150-200 words
- Make it clear this is a joke/roast format
- Add some fire emojis for effect
"""
    else:
        prompt = f"""Generate a warm, constructive rejection email.

CANDIDATE: {candidate_name}
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
