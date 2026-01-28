try:
    import google.generativeai as genai
except ImportError:
    genai = None

import os
import json
import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/api/ai", tags=["ai"])
logger = logging.getLogger(__name__)

# Configure Gemini if available
api_key = os.getenv("GEMINI_API_KEY", "AIzaSyCjiCH7KD5ZioFiFgtIuXMhLlCOlz2b_BU")
if genai and api_key:
    genai.configure(api_key=api_key)

class GenerateCourseRequest(BaseModel):
    topic: str
    target_audience: Optional[str] = "Beginners"

class ModuleContent(BaseModel):
    type: str  # text, video, quiz, file
    text: str
    icon: str

class Module(BaseModel):
    title: str
    content: List[ModuleContent]

class CourseStructure(BaseModel):
    title: str
    description: str
    modules: List[Module]

@router.post("/generate-course")
async def generate_course(request: GenerateCourseRequest):
    """
    Generate a full course structure using Google Gemini.
    """
    if not genai:
         raise HTTPException(status_code=500, detail="Gemini AI Library not installed on server (ImportError)")

    # Reload key from env just in case it was set after startup
    current_api_key = os.getenv("GEMINI_API_KEY", "AIzaSyCjiCH7KD5ZioFiFgtIuXMhLlCOlz2b_BU")
    if not current_api_key:
         # Fallback to the module level one if env var is missing or not reloaded
         current_api_key = api_key
    
    if not current_api_key:
        raise HTTPException(status_code=500, detail="Gemini API Key not configured")
    
    genai.configure(api_key=current_api_key)

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = f"""
        Act as an expert educational curriculum designer.
        Create a comprehensive, structured course outline for the topic: "{request.topic}".
        Target Audience: {request.target_audience}.
        
        The output MUST be valid, parseable JSON with the following structure:
        {{
            "title": "Engaging Course Title",
            "description": "Compelling 2-sentence description.",
            "modules": [
                {{
                    "title": "Module 1: Title",
                    "content": [
                        {{ "type": "text", "text": "Lesson topic description...", "icon": "📄" }},
                        {{ "type": "video", "text": "Video lecture title...", "icon": "📽️" }},
                        {{ "type": "quiz", "text": "Quiz title...", "icon": "❓" }}
                    ]
                }}
            ]
        }}
        
        Create at least 4 modules.
        Each module should have 3-5 content items mixed (text, video, quiz).
        Do not use Markdown formatting (like ```json), just return the raw JSON string.
        """
        
        # Retry logic with exponential backoff
        max_retries = 3
        import asyncio
        response = None
        for attempt in range(max_retries):
            try:
                response = model.generate_content(prompt)
                break # Success, exit loop
            except Exception as e:
                if "429" in str(e) or "Too Many Requests" in str(e):
                    if attempt < max_retries - 1:
                        wait_time = 2 ** attempt
                        logger.warning(f"Rate limit hit. Retrying in {wait_time}s...")
                        await asyncio.sleep(wait_time)
                    else:
                        raise HTTPException(status_code=429, detail="System busy (Rate Limit). Please try again later.")
                else:
                    raise e # Re-raise if it's not a rate limit error
        
        if not response:
             raise HTTPException(status_code=500, detail="Failed to get valid response from AI after retries")

        # Clean response if it contains markdown code blocks
        text_response = response.text
        if text_response.startswith("```json"):
            text_response = text_response[7:]
        if text_response.endswith("```"):
            text_response = text_response[:-3]
            
        course_data = json.loads(text_response.strip())
        
        # Add IDs to make it compatible with frontend Sortable/Draggable
        import time
        base_id = int(time.time())
        for m_idx, module in enumerate(course_data.get('modules', [])):
            module['id'] = f"mod-{base_id}-{m_idx}"
            # Ensure content is simple list of objects
            
        return course_data

    except ImportError:
        logger.error("google.generativeai library not found")
        raise HTTPException(status_code=500, detail="Gemini AI Library not installed on server")
    except Exception as e:
        logger.error(f"AI Generation failed: {e}")
        # Return the actual error string to frontend for easier debugging
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")
