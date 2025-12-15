# backend/routers/chat.py
import os
import json
from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
import anthropic

router = APIRouter(prefix="/api")


def _get_client():
    return anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))


@router.post("/chat")
async def chat(request: Request):
    """
    Streaming chat endpoint for career feedback conversations.
    Compatible with Vercel AI SDK.
    """
    body = await request.json()
    messages = body.get("messages", [])
    context = body.get("context", {})

    # Build system prompt with candidate context
    system_prompt = build_system_prompt(context)

    # Convert messages to Anthropic format
    anthropic_messages = []
    for msg in messages:
        role = "user" if msg["role"] == "user" else "assistant"
        anthropic_messages.append({"role": role, "content": msg["content"]})

    async def generate():
        """Stream response in Vercel AI SDK format."""
        client = _get_client()
        with client.messages.stream(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            system=system_prompt,
            messages=anthropic_messages,
        ) as stream:
            for text in stream.text_stream:
                # Vercel AI SDK expects this format for streaming
                yield f"0:{json.dumps(text)}\n"

        # Send finish message
        yield 'd:{"finishReason":"stop"}\n'

    return StreamingResponse(
        generate(),
        media_type="text/plain; charset=utf-8",
        headers={
            "X-Vercel-AI-Data-Stream": "v1",
        }
    )


def build_system_prompt(context: dict) -> str:
    """Build a personalized system prompt based on candidate context."""

    candidate_name = context.get("candidateName", "the candidate")
    job_title = context.get("jobTitle", "the position")
    skill_gaps = context.get("skillGaps", [])
    strengths = context.get("strengths", [])
    recommendations = context.get("recommendations", [])

    gaps_text = "\n".join([
        f"- {gap['name']}: Candidate level {gap['candidateLevel']}%, Required {gap['requiredLevel']}%"
        for gap in skill_gaps
    ]) if skill_gaps else "No significant gaps identified."

    strengths_text = "\n".join([
        f"- {s['name']}: Candidate level {s['candidateLevel']}% (exceeds required {s['requiredLevel']}%)"
        for s in strengths
    ]) if strengths else "Analysis pending."

    recs_text = "\n".join([f"- {r}" for r in recommendations]) if recommendations else "No specific recommendations yet."

    return f"""You are a helpful, empathetic career coach assistant for {candidate_name} who recently applied for the {job_title} position.

Your role is to:
1. Provide constructive feedback about their application
2. Help them understand skill gaps without being discouraging
3. Suggest actionable steps to improve
4. Answer questions about the role and requirements
5. Collect any feedback they have about the application process

CANDIDATE CONTEXT:
Name: {candidate_name}
Applied for: {job_title}

SKILL GAPS (areas to improve):
{gaps_text}

STRENGTHS (exceeds requirements):
{strengths_text}

RECOMMENDATIONS:
{recs_text}

GUIDELINES:
- Be warm, supportive, and constructive
- Focus on growth opportunities, not failures
- Provide specific, actionable advice
- If they ask about other roles, suggest ones that match their strengths
- If they seem frustrated, acknowledge their feelings and offer encouragement
- Keep responses concise but helpful (2-3 paragraphs max)
- Match the language of the user (if they write in French, respond in French)

Remember: The goal is to help candidates improve, not to make them feel bad about not getting the job."""
