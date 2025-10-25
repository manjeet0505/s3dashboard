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
    """Extract ONLY real technical skills - STRICT filtering"""
    skills = set()
    text_lower = text.lower()
    
    # Comprehensive list of valid technical skills
    valid_skills = {
        # Programming Languages
        'python', 'javascript', 'java', 'c++', 'c#', 'php', 'ruby', 'swift', 'kotlin', 'go', 'rust',
        'typescript', 'scala', 'perl', 'r', 'matlab', 'dart', 'c', 'objective-c',
        
        # Frontend Technologies
        'react', 'reactjs', 'react.js', 'angular', 'vue', 'vue.js', 'vuejs', 'svelte', 'ember',
        'jquery', 'next.js', 'nextjs', 'nuxt', 'gatsby', 'html', 'html5', 'css', 'css3',
        'sass', 'scss', 'less', 'tailwind', 'tailwindcss', 'bootstrap', 'material-ui', 'mui',
        'webpack', 'vite', 'parcel', 'rollup', 'babel', 'redux', 'mobx', 'zustand',
        
        # Backend Technologies
        'node.js', 'nodejs', 'node', 'express', 'expressjs', 'express.js', 'django', 'flask',
        'fastapi', 'spring', 'spring boot', 'springboot', 'laravel', 'rails', 'ruby on rails',
        'asp.net', '.net', 'dotnet', 'nestjs', 'fastify', 'koa', 'hapi',
        
        # Databases
        'sql', 'mysql', 'postgresql', 'postgres', 'mongodb', 'redis', 'sqlite', 'mariadb',
        'oracle', 'mssql', 'sql server', 'dynamodb', 'cassandra', 'couchdb', 'firebase',
        'firestore', 'realm', 'nosql', 'elasticsearch', 'neo4j',
        
        # Cloud & DevOps
        'aws', 'amazon web services', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes',
        'k8s', 'jenkins', 'ci/cd', 'gitlab', 'github actions', 'travis ci', 'circleci',
        'terraform', 'ansible', 'chef', 'puppet', 'vagrant', 'heroku', 'netlify', 'vercel',
        
        # Tools & Platforms
        'git', 'github', 'gitlab', 'bitbucket', 'svn', 'mercurial', 'jira', 'confluence',
        'slack', 'trello', 'asana', 'postman', 'insomnia', 'swagger', 'vscode', 'intellij',
        'pycharm', 'webstorm', 'eclipse', 'visual studio', 'vim', 'emacs', 'sublime',
        
        # APIs & Protocols
        'rest', 'restful', 'rest api', 'graphql', 'websocket', 'grpc', 'soap', 'json', 'xml',
        'api', 'microservices', 'oauth', 'jwt', 'http', 'https', 'tcp/ip', 'websockets',
        
        # Testing
        'jest', 'mocha', 'chai', 'jasmine', 'karma', 'cypress', 'selenium', 'puppeteer',
        'playwright', 'junit', 'pytest', 'unittest', 'testng', 'rspec', 'enzyme',
        
        # Mobile Development
        'react native', 'flutter', 'ios', 'android', 'xamarin', 'ionic', 'cordova',
        'react-native', 'swift ui', 'swiftui', 'jetpack compose',
        
        # Data Science & AI
        'machine learning', 'deep learning', 'artificial intelligence', 'ai', 'ml',
        'data science', 'data analysis', 'pandas', 'numpy', 'scikit-learn', 'tensorflow',
        'pytorch', 'keras', 'opencv', 'nlp', 'computer vision', 'data visualization',
        
        # Methodologies
        'agile', 'scrum', 'kanban', 'waterfall', 'devops', 'tdd', 'bdd', 'ci/cd',
        'continuous integration', 'continuous deployment',
        
        # Other Technical
        'linux', 'unix', 'windows', 'macos', 'bash', 'powershell', 'shell scripting',
        'regex', 'markdown', 'latex', 'nginx', 'apache', 'tomcat', 'iis',
        'rabbitmq', 'kafka', 'activemq', 'memcached', 'varnish', 'prometheus', 'grafana'
    }
    
    # ONLY match skills from the whitelist
    for skill in valid_skills:
        if skill in text_lower:
            # Capitalize properly for display
            display_skill = skill.title() if skill.islower() else skill
            if skill in ['html', 'css', 'sql', 'api', 'xml', 'json', 'jwt', 'http', 'https', 'ai', 'ml', 'nlp']:
                display_skill = skill.upper()
            elif skill in ['node.js', 'next.js', 'vue.js', 'react.js', 'express.js']:
                display_skill = skill
            elif skill in ['javascript', 'typescript']:
                display_skill = skill.capitalize()
            skills.add(display_skill)
    
    # Sort and return only unique, valid skills
    return sorted(list(skills))[:25]  # Limit to 25 skills

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
