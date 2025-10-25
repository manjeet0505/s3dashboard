import sys
import json
import os

try:
    import google.generativeai as genai
except ImportError:
    print(json.dumps({"error": "google-generativeai not installed"}))
    sys.exit(1)

def generate_improvement_suggestions(resume_data):
    """
    Generate detailed resume improvement suggestions using Gemini AI
    """
    
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        return {"error": "GEMINI_API_KEY not found"}
    
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('models/gemini-2.0-flash-exp')
        
        # Prepare resume context
        skills = ', '.join(resume_data.get('skills', [])[:30])
        experience = ' | '.join(resume_data.get('experience', [])[:5])
        education = ' | '.join(resume_data.get('education', [])[:3])
        current_score = resume_data.get('current_score', 0)
        
        prompt = f"""You are an expert resume consultant and ATS optimization specialist. Analyze this resume and provide actionable improvement suggestions.

CURRENT RESUME DATA:
- Skills: {skills}
- Experience: {experience}
- Education: {education}
- Current Score: {current_score}/100

Provide detailed suggestions in this EXACT JSON format (ensure valid JSON):

{{
  "overall_score": <number 70-95>,
  "improvement_potential": <number 5-30>,
  "critical_improvements": [
    {{
      "title": "Brief title",
      "description": "Clear description of what to improve",
      "priority": "high|medium|low",
      "impact": "How this affects ATS score",
      "examples": ["Example 1", "Example 2", "Example 3"]
    }}
  ],
  "skills_recommendations": {{
    "trending_skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
    "missing_keywords": ["Keyword 1", "Keyword 2", "Keyword 3", "Keyword 4"],
    "skills_to_highlight": ["Important skill 1", "Important skill 2"]
  }},
  "content_improvements": {{
    "experience": ["Tip 1", "Tip 2", "Tip 3", "Tip 4"],
    "format": ["Format tip 1", "Format tip 2", "Format tip 3"],
    "summary": ["Summary tip 1", "Summary tip 2"]
  }},
  "ats_optimization_tips": [
    "Specific ATS tip 1",
    "Specific ATS tip 2",
    "Specific ATS tip 3",
    "Specific ATS tip 4",
    "Specific ATS tip 5"
  ],
  "next_steps": [
    {{
      "step": 1,
      "action": "First action to take",
      "time": "Estimated time"
    }},
    {{
      "step": 2,
      "action": "Second action",
      "time": "Estimated time"
    }},
    {{
      "step": 3,
      "action": "Third action",
      "time": "Estimated time"
    }}
  ],
  "industry_insights": {{
    "current_trends": ["Trend 1", "Trend 2", "Trend 3"],
    "recruiter_preferences": ["Preference 1", "Preference 2"],
    "common_mistakes": ["Mistake 1", "Mistake 2"]
  }}
}}

IMPORTANT:
1. Provide 3-5 critical improvements with HIGH priority items first
2. Focus on actionable, specific advice
3. Include modern industry trends and ATS requirements
4. Suggest 5-7 trending skills relevant to their experience
5. Return ONLY valid JSON, no markdown, no code blocks
6. Be encouraging but honest about improvement areas"""

        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        # Clean up response
        if response_text.startswith('```json'):
            response_text = response_text[7:]
        if response_text.startswith('```'):
            response_text = response_text[3:]
        if response_text.endswith('```'):
            response_text = response_text[:-3]
        response_text = response_text.strip()
        
        # Parse and validate JSON
        suggestions = json.loads(response_text)
        
        # Ensure all required fields exist
        if 'overall_score' not in suggestions:
            suggestions['overall_score'] = 75
        if 'improvement_potential' not in suggestions:
            suggestions['improvement_potential'] = 25
        
        return suggestions
        
    except json.JSONDecodeError as e:
        return {
            "error": f"JSON parsing error: {str(e)}",
            "raw_response": response_text[:500] if 'response_text' in locals() else "No response"
        }
    except Exception as e:
        return {"error": f"AI generation failed: {str(e)}"}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Resume data required"}))
        sys.exit(1)
    
    try:
        resume_data = json.loads(sys.argv[1])
        result = generate_improvement_suggestions(resume_data)
        print(json.dumps(result, ensure_ascii=False, indent=2))
    except json.JSONDecodeError:
        print(json.dumps({"error": "Invalid JSON input"}))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
