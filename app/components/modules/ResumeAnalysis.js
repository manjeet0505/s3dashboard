'use client';

import { useState } from 'react';

export default function ResumeAnalysis() {
  const [isUploading, setIsUploading] = useState(false);
  const [resumeScore, setResumeScore] = useState(85);
  const [analysisComplete, setAnalysisComplete] = useState(true);

  const analysisResults = {
    atsScore: 85,
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
    missingSkills: ['Docker', 'AWS', 'TypeScript'],
    suggestions: [
      'Add more quantifiable achievements to your experience section',
      'Include relevant certifications',
      'Optimize keywords for ATS systems',
      'Add a professional summary section'
    ],
    strengths: [
      'Strong technical skills in modern web technologies',
      'Good project experience',
      'Clear and concise writing style'
    ]
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true);
      // Simulate upload and analysis
      setTimeout(() => {
        setIsUploading(false);
        setAnalysisComplete(true);
      }, 2000);
    }
  };

  return (
    <div className="resume-analysis">
      <div className="page-header">
        <h1>Resume Analysis</h1>
        <p className="text-gray-600">Upload your resume and get AI-powered insights to improve your chances</p>
      </div>

      {!analysisComplete ? (
        <div className="upload-section">
          <div className="upload-card">
            <div className="upload-icon">
              <i className="fas fa-cloud-upload-alt"></i>
            </div>
            <h2>Upload Your Resume</h2>
            <p>Supported formats: PDF, DOC, DOCX (Max 5MB)</p>
            
            <div className="upload-area">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="file-input"
                id="resume-upload"
              />
              <label htmlFor="resume-upload" className="upload-btn">
                {isUploading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-upload"></i>
                    Choose File
                  </>
                )}
              </label>
            </div>
          </div>
        </div>
      ) : (
        <div className="analysis-results">
          {/* Score Overview */}
          <div className="score-overview">
            <div className="score-card">
              <div className="score-circle">
                <div className="score-value">{resumeScore}%</div>
                <div className="score-label">ATS Score</div>
              </div>
              <div className="score-description">
                <h3>Great job! Your resume is well-optimized</h3>
                <p>Your resume has a strong chance of passing through ATS systems and reaching human recruiters.</p>
              </div>
            </div>
          </div>

          <div className="analysis-grid">
            {/* Skills Analysis */}
            <div className="analysis-card">
              <h3>Skills Analysis</h3>
              <div className="skills-section">
                <div className="skills-found">
                  <h4>Skills Found</h4>
                  <div className="skills-list">
                    {analysisResults.skills.map((skill, index) => (
                      <span key={index} className="skill-tag found">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="skills-missing">
                  <h4>Recommended Skills</h4>
                  <div className="skills-list">
                    {analysisResults.missingSkills.map((skill, index) => (
                      <span key={index} className="skill-tag missing">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths */}
            <div className="analysis-card">
              <h3>Your Strengths</h3>
              <ul className="strengths-list">
                {analysisResults.strengths.map((strength, index) => (
                  <li key={index} className="strength-item">
                    <i className="fas fa-check-circle text-green-500"></i>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvement Suggestions */}
            <div className="analysis-card">
              <h3>Improvement Suggestions</h3>
              <ul className="suggestions-list">
                {analysisResults.suggestions.map((suggestion, index) => (
                  <li key={index} className="suggestion-item">
                    <i className="fas fa-lightbulb text-yellow-500"></i>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="btn-primary">
              <i className="fas fa-download"></i>
              Download Analysis Report
            </button>
            <button className="btn-secondary">
              <i className="fas fa-edit"></i>
              Get Resume Builder
            </button>
            <button className="btn-outline" onClick={() => setAnalysisComplete(false)}>
              <i className="fas fa-upload"></i>
              Upload New Resume
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 