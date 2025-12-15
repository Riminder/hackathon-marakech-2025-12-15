# backend/services/video.py
from __future__ import annotations
import os
import asyncio
import httpx
from typing import Optional

HEYGEN_API_BASE = "https://api.heygen.com"


async def generate_avatar_video(email_content: str, language: str = "en") -> tuple[Optional[str], Optional[str]]:
    """
    Generate AI avatar video using HeyGen API.
    The avatar reads the email content aloud.
    Returns (video_url, error_message) tuple.
    """
    api_key = os.getenv("HEYGEN_API_KEY")

    if not api_key:
        return None, "HEYGEN_API_KEY environment variable not configured"

    # Use configured avatar and voice
    avatar_config = {
        "avatar_id": "Abigail_expressive_2024112501",
        "voice_id": "513b14b431b64a578c467c480dd0a9c3"
    }

    headers = {
        "X-Api-Key": api_key,
        "Content-Type": "application/json"
    }

    # Truncate email if too long (HeyGen has limits)
    script = email_content[:1500] if len(email_content) > 1500 else email_content

    payload = {
        "video_inputs": [{
            "character": {
                "type": "avatar",
                "avatar_id": avatar_config["avatar_id"],
                "avatar_style": "normal"
            },
            "voice": {
                "type": "text",
                "input_text": script,
                "voice_id": avatar_config["voice_id"],
                "speed": 1.0
            },
            "background": {
                "type": "color",
                "value": "#1e293b"  # Dark slate background
            }
        }],
        "dimension": {
            "width": 1280,
            "height": 720
        },
        "aspect_ratio": "16:9"
    }

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            # Start video generation
            response = await client.post(
                f"{HEYGEN_API_BASE}/v2/video/generate",
                json=payload,
                headers=headers
            )

            if response.status_code != 200:
                error_msg = f"HeyGen API error: {response.status_code} - {response.text}"
                print(error_msg)
                return None, error_msg

            data = response.json()
            video_id = data.get("data", {}).get("video_id")

            if not video_id:
                error_msg = f"No video_id in HeyGen response: {data}"
                print(error_msg)
                return None, error_msg

            print(f"HeyGen video generation started: {video_id}")

            # Poll for completion (max 5 minutes)
            video_url, error = await _poll_video_status(client, video_id, headers)
            return video_url, error

    except Exception as e:
        error_msg = f"Error generating HeyGen video: {e}"
        print(error_msg)
        return None, error_msg


async def _poll_video_status(client: httpx.AsyncClient, video_id: str, headers: dict, max_attempts: int = 60) -> tuple[Optional[str], Optional[str]]:
    """Poll HeyGen API until video is ready. Returns (video_url, error_message) tuple."""

    for attempt in range(max_attempts):
        try:
            response = await client.get(
                f"{HEYGEN_API_BASE}/v1/video_status.get",
                params={"video_id": video_id},
                headers=headers
            )

            if response.status_code != 200:
                print(f"Status check failed: {response.status_code}")
                await asyncio.sleep(5)
                continue

            data = response.json()
            status = data.get("data", {}).get("status")

            if status == "completed":
                video_url = data.get("data", {}).get("video_url")
                print(f"HeyGen video ready: {video_url}")
                return video_url, None
            elif status == "failed":
                error = data.get("data", {}).get("error") or "Unknown HeyGen error"
                print(f"HeyGen video generation failed: {error}")
                return None, f"HeyGen generation failed: {error}"
            elif status in ["processing", "pending"]:
                print(f"HeyGen video status: {status} (attempt {attempt + 1}/{max_attempts})")
                await asyncio.sleep(5)  # Wait 5 seconds before next poll
            else:
                print(f"Unknown HeyGen status: {status}")
                await asyncio.sleep(5)

        except Exception as e:
            print(f"Error polling HeyGen status: {e}")
            await asyncio.sleep(5)

    return None, "HeyGen video generation timed out after 5 minutes"


async def _fetch_available_voices(api_key: str) -> dict:
    """Fetch available voices from HeyGen API."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{HEYGEN_API_BASE}/v2/voices",
                headers={"X-Api-Key": api_key}
            )
            if response.status_code == 200:
                return response.json().get("data", {}).get("voices", [])
    except Exception as e:
        print(f"Error fetching voices: {e}")
    return []


async def _fetch_available_avatars_list(api_key: str) -> list:
    """Fetch available avatars from HeyGen API."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{HEYGEN_API_BASE}/v2/avatars",
                headers={"X-Api-Key": api_key}
            )
            if response.status_code == 200:
                return response.json().get("data", {}).get("avatars", [])
    except Exception as e:
        print(f"Error fetching avatars: {e}")
    return []


async def _get_avatar_config(api_key: str, language: str) -> dict:
    """Get avatar and voice configuration dynamically from HeyGen."""

    # Fetch available avatars and voices
    avatars = await _fetch_available_avatars_list(api_key)
    voices = await _fetch_available_voices(api_key)

    # Get first available avatar
    avatar_id = None
    if avatars:
        avatar_id = avatars[0].get("avatar_id")

    # Find a voice matching the language, or fall back to first available
    voice_id = None
    lang_map = {"en": "english", "fr": "french", "es": "spanish", "de": "german"}
    target_lang = lang_map.get(language, "english")

    for voice in voices:
        voice_lang = voice.get("language", "").lower()
        if target_lang in voice_lang:
            voice_id = voice.get("voice_id")
            break

    # Fallback to first voice if no language match
    if not voice_id and voices:
        voice_id = voices[0].get("voice_id")

    print(f"Using avatar: {avatar_id}, voice: {voice_id}")
    return {"avatar_id": avatar_id, "voice_id": voice_id}


async def get_available_avatars() -> list[dict]:
    """Fetch available avatars from HeyGen (for future use)."""
    api_key = os.getenv("HEYGEN_API_KEY")

    if not api_key:
        return []

    headers = {"X-Api-Key": api_key}

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{HEYGEN_API_BASE}/v2/avatars",
                headers=headers
            )

            if response.status_code == 200:
                data = response.json()
                return data.get("data", {}).get("avatars", [])

    except Exception as e:
        print(f"Error fetching avatars: {e}")

    return []
