import sys
import json
import os

# Try to import Google Generative AI
try:
    import google.generativeai as genai
except ImportError:
    print(json.dumps({"error": "google-generativeai not installed. Run: pip install google-generativeai"}))
    sys.exit(1)

def analyze_resume_with_ai(resume_data, job_description=None):
    """
    Analyze resume using Gemini AI and provide detailed feedback
    
    Args:
        resume_data: Dict containing parsed resume data (skills, experience, education, etc.)
        job_description: Optional job description to match against
    
    Returns:
        Dict with AI-generated suggestions and scoring
    """
    
    # Get API key from environment
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        return {
            "error": "GEMINI_API_KEY not found in environment variables",
            "suggestions": [],
            "score_breakdown": {}
        }
    
    try:
        # Configure Gemini
        genai.configure(api_key=api_key)
        
        # Use Gemini 2.5 Flash - stable, free model
        model = genai.GenerativeModel('models/gemini-2.5-flash')
        
        # Prepare resume summary
        resume_summary = f"""
Resume Analysis Request:

SKILLS: {', '.join(resume_data.get('skills', [])[:20])}
EXPERIENCE: {' | '.join(resume_data.get('experience', [])[:5])}
EDUCATION: {' | '.join(resume_data.get('education', [])[:3])}
CONTACT: {resume_data.get('contact', {})}
WORD COUNT: {resume_data.get('word_count', 0)}

{f"TARGET JOB DESCRIPTION: {job_description}" if job_description else ""}
"""
        
        # Create detailed prompt for AI analysis
        prompt = f"""You are an expert resume reviewer and career coach. Analyze this resume and provide detailed, actionable feedback.

{resume_summary}

Please provide a comprehensive analysis in the following JSON format:

{{
  "overall_score": <number 0-100>,
  "score_breakdown": {{
    "content_quality": <number 0-100>,
    "ats_optimization": <number 0-100>,
    "skills_relevance": <number 0-100>,
    "experience_presentation": <number 0-100>,
    "formatting": <number 0-100>
  }},
  "strengths": [
    "List 3-5 strong points about this resume"
  ],
  "weaknesses": [
    "List 3-5 areas that need improvement"
  ],
  "suggestions": [
    {{
      "category": "Skills",
      "priority": "high",
      "suggestion": "Specific actionable suggestion",
      "reason": "Why this matters"
    }}
  ],
  "missing_skills": [
    "List skills commonly expected but missing"
  ],
  "ats_issues": [
    "List any ATS compatibility issues"
  ],
  "keyword_recommendations": [
    "Keywords to add for better visibility"
  ],
  "action_items": [
    "Prioritized list of immediate actions to take"
  ]
}}

Focus on:
1. ATS compatibility (formatting, keywords, sections)
2. Skills gap analysis (what's missing for modern tech roles)
3. Experience presentation (quantifiable achievements, action verbs)
4. Overall professionalism and clarity
5. Specific improvements with examples

Provide ONLY the JSON response, no additional text."""

        # Generate AI response
        response = model.generate_content(prompt)
        
        # Parse JSON from response
        response_text = response.text.strip()
        
        # Remove markdown code blocks if present
        if response_text.startswith('```json'):
            response_text = response_text[7:]
        if response_text.startswith('```'):
            response_text = response_text[3:]
        if response_text.endswith('```'):
            response_text = response_text[:-3]
        
        response_text = response_text.strip()
        
        # Parse JSON
        ai_analysis = json.loads(response_text)
        
        return ai_analysis
        
    except json.JSONDecodeError as e:
        return {
            "error": f"Failed to parse AI response: {str(e)}",
            "raw_response": response_text if 'response_text' in locals() else None,
            "overall_score": 0,
            "suggestions": []
        }
    except Exception as e:
        return {
            "error": f"AI analysis failed: {str(e)}",
            "overall_score": 0,
            "suggestions": []
        }

def calculate_basic_score(resume_data):
    """
    Calculate a basic score without AI (fallback)
    """
    score = 0
    breakdown = {
        "content_quality": 0,
        "ats_optimization": 0,
        "skills_relevance": 0,
        "experience_presentation": 0,
        "formatting": 0
    }
    
    # Skills scoring (0-20 points)
    skills_count = len(resume_data.get('skills', []))
    if skills_count >= 10:
        breakdown["skills_relevance"] = 100
        score += 20
    elif skills_count >= 5:
        breakdown["skills_relevance"] = 70
        score += 14
    else:
        breakdown["skills_relevance"] = 40
        score += 8
    
    # Experience scoring (0-30 points)
    experience = resume_data.get('experience', [])
    if experience and not experience[0].startswith('No work experience'):
        breakdown["experience_presentation"] = 85
        score += 30
    else:
        breakdown["experience_presentation"] = 20
        score += 6
    
    # Education scoring (0-20 points)
    education = resume_data.get('education', [])
    if education and not education[0].startswith('No education'):
        breakdown["content_quality"] = 80
        score += 20
    else:
        breakdown["content_quality"] = 30
        score += 6
    
    # Contact info scoring (0-10 points)
    contact = resume_data.get('contact', {})
    if contact.get('emails') or contact.get('phones'):
        breakdown["ats_optimization"] = 90
        score += 10
    else:
        breakdown["ats_optimization"] = 40
        score += 4
    
    # Word count scoring (0-20 points)
    word_count = resume_data.get('word_count', 0)
    if 300 <= word_count <= 800:
        breakdown["formatting"] = 90
        score += 20
    elif 200 <= word_count <= 1000:
        breakdown["formatting"] = 70
        score += 14
    else:
        breakdown["formatting"] = 50
        score += 10
    
    return {
        "overall_score": min(score, 100),
        "score_breakdown": breakdown,
        "method": "basic_calculation"
    }

def main():
    """
    Main function to handle command line arguments
    """
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No resume data provided"}))
        sys.exit(1)
    
    try:
        # Parse resume data from command line argument
        resume_data = json.loads(sys.argv[1])
        
        # Get optional job description
        job_description = sys.argv[2] if len(sys.argv) > 2 else None
        
        # Try AI analysis first
        ai_result = analyze_resume_with_ai(resume_data, job_description)
        
        # If AI analysis failed, use basic scoring
        if 'error' in ai_result and 'overall_score' not in ai_result:
            basic_result = calculate_basic_score(resume_data)
            result = {
                **basic_result,
                "ai_error": ai_result.get('error'),
                "suggestions": [
                    {
                        "category": "General",
                        "priority": "high",
                        "suggestion": "AI analysis unavailable. Using basic scoring.",
                        "reason": ai_result.get('error', 'Unknown error')
                    }
                ]
            }
        else:
            result = ai_result
        
        # Output result as JSON
        print(json.dumps(result, indent=2))
        
    except json.JSONDecodeError as e:
        print(json.dumps({"error": f"Invalid JSON input: {str(e)}"}))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": f"Analysis failed: {str(e)}"}))
        sys.exit(1)

if __name__ == "__main__":
    main()
