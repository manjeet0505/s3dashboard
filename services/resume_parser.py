import sys
import json
import re
import pdfplumber
import docx2txt
import spacy
from pathlib import Path

# Load English language model
nlp = spacy.load("en_core_web_sm")

def extract_text(file_path):
    """Extract text from PDF or DOCX files"""
    file_path = Path(file_path)
    try:
        if file_path.suffix.lower() == '.pdf':
            with pdfplumber.open(file_path) as pdf:
                return " ".join(page.extract_text() for page in pdf.pages if page.extract_text())
        elif file_path.suffix.lower() in ['.docx', '.doc']:
            return docx2txt.process(file_path)
        else:
            raise ValueError("Unsupported file format. Please upload a PDF or DOCX file.")
    except Exception as e:
        raise ValueError(f"Error reading file: {str(e)}")

def extract_skills(text):
    """Extract skills using spaCy"""
    doc = nlp(text.lower())
    skills = set()
    
    # Common resume skills to look for
    common_skills = {
        'python', 'javascript', 'java', 'c++', 'c#', 'php', 'ruby', 'swift', 'kotlin',
        'html', 'css', 'react', 'angular', 'vue', 'node.js', 'django', 'flask', 'express',
        'sql', 'mongodb', 'postgresql', 'mysql', 'aws', 'docker', 'kubernetes', 'git',
        'machine learning', 'artificial intelligence', 'data analysis', 'rest api', 'graphql',
        'typescript', 'next.js', 'tailwind', 'bootstrap', 'sass', 'webpack', 'redux',
        'spring boot', 'hibernate', 'microservices', 'agile', 'scrum', 'jira', 'jenkins',
        'ci/cd', 'devops', 'linux', 'bash', 'powershell', 'azure', 'gcp', 'terraform',
        'ansible', 'prometheus', 'grafana', 'elasticsearch', 'redis', 'rabbitmq', 'kafka'
    }
    
    # Check for common skills
    for skill in common_skills:
        if skill in text.lower():
            skills.add(skill)
    
    # Extract noun phrases that might be skills
    for chunk in doc.noun_chunks:
        chunk_text = chunk.text.lower().strip()
        if 1 < len(chunk_text.split()) <= 3:  # Single or two-word phrases
            skills.add(chunk_text)
    
    return sorted(list(skills))[:30]  # Limit to 30 skills

def extract_experience(text):
    """Extract work experience information"""
    doc = nlp(text)
    experience = []
    
    # Look for experience section
    exp_patterns = [
        r'(?i)(?:work|employment|professional)\s*(?:history|experience|background)',
        r'(?i)experience\s*:',
        r'(?i)work\s*:'
    ]
    
    lines = text.split('\n')
    in_experience_section = False
    
    for i, line in enumerate(lines):
        # Check if we're entering the experience section
        if any(re.search(pattern, line) for pattern in exp_patterns):
            in_experience_section = True
            continue
        
        # Check if we're leaving the experience section (new section starts)
        if in_experience_section and re.search(r'(?i)^(education|skills|projects|certifications|awards)', line.strip()):
            break
        
        # Collect experience lines
        if in_experience_section and line.strip() and len(line.strip()) > 10:
            experience.append(line.strip())
    
    if not experience:
        return ["No work experience section found or couldn't be parsed."]
    
    return experience[:10]  # Limit to 10 entries

def extract_education(text):
    """Extract education information"""
    doc = nlp(text)
    education = []
    
    # Look for education section
    edu_patterns = [
        r'(?i)education',
        r'(?i)academic\s*(?:background|qualifications)',
        r'(?i)degrees?'
    ]
    
    lines = text.split('\n')
    in_education_section = False
    
    for i, line in enumerate(lines):
        # Check if we're entering the education section
        if any(re.search(pattern, line) for pattern in edu_patterns):
            in_education_section = True
            continue
        
        # Check if we're leaving the education section (new section starts)
        if in_education_section and re.search(r'(?i)^(experience|work|skills|projects|certifications)', line.strip()):
            break
        
        # Collect education lines
        if in_education_section and line.strip() and len(line.strip()) > 10:
            education.append(line.strip())
    
    if not education:
        return ["No education section found or couldn't be parsed."]
    
    return education[:10]  # Limit to 10 entries

def extract_contact_info(text):
    """Extract contact information"""
    # Email
    emails = re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text)
    # Phone numbers (international format)
    phones = re.findall(r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
    
    return {
        'emails': list(set(emails)),
        'phones': list(set(phones))
    }

def main(file_path):
    try:
        # Extract text from the file
        text = extract_text(file_path)
        
        if not text or len(text.strip()) < 50:  # At least 50 characters
            return {"error": "The document appears to be empty or too short to process."}
        
        # Process the text
        result = {
            "skills": extract_skills(text),
            "experience": extract_experience(text),
            "education": extract_education(text),
            "contact": extract_contact_info(text),
            "summary": text[:500] + ("..." if len(text) > 500 else ""),
            "word_count": len(text.split()),
            "char_count": len(text)
        }
        
        return result
        
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) > 1:
        result = main(sys.argv[1])
        print(json.dumps(result))
    else:
        print(json.dumps({"error": "No file path provided"}))
