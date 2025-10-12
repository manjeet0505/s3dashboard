'use client';

import { useState, useEffect } from 'react';

export default function DashboardHome({ user }) {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { title: 'Resume Score', value: 'N/A', icon: 'fas fa-file-alt', color: 'bg-blue-500' },
    { title: 'Resumes Uploaded', value: '0', icon: 'fas fa-upload', color: 'bg-green-500' },
    { title: 'Skills Identified', value: '0', icon: 'fas fa-star', color: 'bg-purple-500' },
    { title: 'Last Analysis', value: 'Never', icon: 'fas fa-clock', color: 'bg-orange-500' },
  ]);

  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);

  useEffect(() => {
    fetchResumeData();
    
    // Also check for persistent resume analysis data
    const savedAnalysis = localStorage.getItem('resumeAnalysis');
    const savedScore = localStorage.getItem('resumeScore');
    
    if (savedAnalysis && savedScore) {
      const analysisData = JSON.parse(savedAnalysis);
      const score = parseInt(savedScore);
      
      // Update stats with persistent data
      setStats(prevStats => prevStats.map(stat => {
        if (stat.title === 'Resume Score') {
          return { ...stat, value: `${score}%` };
        }
        return stat;
      }));
    }
  }, []);

  const fetchResumeData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('/api/resume/history', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResumeData(data.resumes);
        updateStats(data.resumes);
        updateActivities(data.resumes);
      }
    } catch (error) {
      console.error('Error fetching resume data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (resumes) => {
    if (resumes && resumes.length > 0) {
      const latestResume = resumes[0];
      const skillsCount = latestResume.analysis?.skills?.length || 0;
      const lastAnalysis = new Date(latestResume.uploadedAt).toLocaleDateString();
      
      setStats([
        { title: 'Resume Score', value: `${latestResume.analysis?.atsScore || 0}%`, icon: 'fas fa-file-alt', color: 'bg-blue-500' },
        { title: 'Resumes Uploaded', value: resumes.length.toString(), icon: 'fas fa-upload', color: 'bg-green-500' },
        { title: 'Skills Identified', value: skillsCount.toString(), icon: 'fas fa-star', color: 'bg-purple-500' },
        { title: 'Last Analysis', value: lastAnalysis, icon: 'fas fa-clock', color: 'bg-orange-500' },
      ]);
    }
  };

  const updateActivities = (resumes) => {
    const activities = [];
    
    if (resumes && resumes.length > 0) {
      resumes.slice(0, 3).forEach((resume, index) => {
        const timeAgo = getTimeAgo(new Date(resume.uploadedAt));
        activities.push({
          action: `Resume "${resume.fileName}" analyzed`,
          time: timeAgo,
          type: 'resume',
          score: resume.analysis?.atsScore
        });
      });
    }

    // Add some default activities if no resumes
    if (activities.length === 0) {
      activities.push(
        { action: 'Welcome to your dashboard!', time: 'Just now', type: 'welcome' },
        { action: 'Upload your first resume to get started', time: 'Get started', type: 'upload' }
      );
    }

    setRecentActivities(activities);
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  // Get user's first name for personalized greeting
  const firstName = user?.name ? user.name.split(' ')[0] : 'Student';

  return (
    <div className="dashboard-home">
      <div className="hero-section">
        <h1 className="page-title">Welcome Back, {firstName}! 👋</h1>
        <p className="page-subtitle">Your Career Journey Starts Here. Track and Manage Your Applications Seamlessly.</p>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-card-header">
              <div className={`stat-card-icon ${stat.color.replace('bg-', '').replace('-500', '-icon')}`}>
              <i className={stat.icon}></i>
            </div>
              <i className="fas fa-arrow-right stat-card-arrow"></i>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-title">{stat.title}</div>
            <div className="stat-subtitle">
              {stat.title === 'Resume Score' && 'ATS compatibility analysis'}
              {stat.title === 'Resumes Uploaded' && 'Overview of all submitted resumes'}
              {stat.title === 'Skills Identified' && 'Technical competencies found'}
              {stat.title === 'Last Analysis' && 'Most recent resume analysis'}
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        {/* Left Column */}
        <div className="dashboard-section">
        {/* Recent Activities */}
        <div className="content-card">
          <div className="card-header">
            <h2>Recent Activities</h2>
              <button className="view-all-btn">
                <i className="fas fa-external-link-alt"></i>
                View All
              </button>
          </div>
          <div className="activities-list">
              {loading ? (
                <div className="loading-placeholder">
                  <div style={{ height: '60px', borderRadius: '12px' }}></div>
                  <div style={{ height: '60px', borderRadius: '12px' }}></div>
                  <div style={{ height: '60px', borderRadius: '12px' }}></div>
                </div>
              ) : (
                recentActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className={`activity-icon ${activity.type}`}>
                  <i className={`fas fa-${activity.type === 'resume' ? 'file-alt' : 
                                          activity.type === 'welcome' ? 'hand-wave' :
                                          activity.type === 'upload' ? 'upload' : 'chart-line'}`}></i>
                </div>
                <div className="activity-content">
                      <div className="activity-text">{activity.action}</div>
                      <div className="activity-time">{activity.time}</div>
                      {activity.score && (
                        <div className="activity-score">Score: {activity.score}%</div>
                      )}
                </div>
              </div>
                ))
              )}
          </div>
        </div>

          {/* Resume Insights */}
        <div className="content-card">
          <div className="card-header">
              <h2>Resume Insights</h2>
              <button className="view-all-btn" onClick={() => window.location.href = '#resume-analysis'}>
                <i className="fas fa-chart-line"></i>
                Analyze Resume
            </button>
          </div>
            <div className="insights-list">
              {resumeData && resumeData.length > 0 ? (
                resumeData.slice(0, 3).map((resume, index) => (
                  <div key={index} className="insight-item">
                    <div className="insight-content">
                      <div className="insight-text">
                        <strong>{resume.fileName}</strong> - Score: {resume.analysis?.atsScore || 0}%
                      </div>
                      <div className="insight-time">
                        {resume.analysis?.skills?.length || 0} skills identified
                      </div>
                </div>
                    <div className="insight-score">
                      {resume.analysis?.atsScore >= 80 ? '🟢' : resume.analysis?.atsScore >= 60 ? '🟡' : '🔴'}
                </div>
              </div>
                ))
              ) : (
                <div className="no-resumes">
                  <i className="fas fa-file-upload"></i>
                  <p>No resumes uploaded yet</p>
                  <p className="text-sm">Upload your first resume to get started with analysis</p>
                </div>
              )}
          </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="dashboard-section">
          {/* Resume Strength Analyzer */}
          <div className="content-card">
            <div className="card-header">
              <h2>Resume Strength Analyzer</h2>
            </div>
            <div className="resume-strength-section">
              {resumeData && resumeData.length > 0 ? (
                <>
                  <div className="strength-chart">
                    <div className="strength-circle">
                      <div className="strength-value">{resumeData[0].analysis?.atsScore || 0}%</div>
                      <div className="strength-label">Resume Strength</div>
                    </div>
                  </div>
                  <div className="strength-breakdown">
                    <div className="strength-item">
                      <span>Profile Summary</span>
                      <div className="strength-bar">
                        <div className="strength-fill" style={{ width: `${(resumeData[0].analysis?.atsScore || 0) * 0.9}%` }}></div>
                      </div>
                      <span>{Math.round((resumeData[0].analysis?.atsScore || 0) * 0.9)}%</span>
                    </div>
                    <div className="strength-item">
                      <span>Work Experience</span>
                      <div className="strength-bar">
                        <div className="strength-fill" style={{ width: `${resumeData[0].analysis?.atsScore || 0}%` }}></div>
                      </div>
                      <span>{resumeData[0].analysis?.atsScore || 0}%</span>
                    </div>
                    <div className="strength-item">
                      <span>Skills Section</span>
                      <div className="strength-bar">
                        <div className="strength-fill" style={{ width: `${(resumeData[0].analysis?.atsScore || 0) * 0.95}%` }}></div>
                      </div>
                      <span>{Math.round((resumeData[0].analysis?.atsScore || 0) * 0.95)}%</span>
                    </div>
                    <div className="strength-item">
                      <span>Education</span>
                      <div className="strength-bar">
                        <div className="strength-fill" style={{ width: `${(resumeData[0].analysis?.atsScore || 0) * 0.8}%` }}></div>
                      </div>
                      <span>{Math.round((resumeData[0].analysis?.atsScore || 0) * 0.8)}%</span>
                    </div>
                  </div>
                  <button className="btn-primary" onClick={() => window.location.href = '#resume-analysis'}>
                    <i className="fas fa-edit"></i>
                    Improve Resume
                  </button>
                </>
              ) : (
                <div className="no-resumes">
                  <i className="fas fa-chart-pie"></i>
                  <p>Upload a resume to see strength analysis</p>
                  <button className="btn-primary" onClick={() => window.location.href = '#resume-analysis'}>
                    <i className="fas fa-upload"></i>
                    Upload Resume
                  </button>
                </div>
              )}
        </div>
      </div>

      {/* Quick Actions */}
          <div className="content-card">
            <div className="card-header">
        <h2>Quick Actions</h2>
            </div>
        <div className="actions-grid">
              <button className="action-btn" onClick={() => window.location.href = '#resume-analysis'}>
            <i className="fas fa-upload"></i>
            <span>Upload Resume</span>
          </button>
              <button className="action-btn" onClick={() => window.location.href = '#job-recommendations'}>
            <i className="fas fa-search"></i>
            <span>Find Jobs</span>
          </button>
              <button className="action-btn" onClick={() => window.location.href = '#mentor-connect'}>
            <i className="fas fa-calendar"></i>
            <span>Schedule Session</span>
          </button>
              <button className="action-btn" onClick={() => window.location.href = '#ai-assistant'}>
            <i className="fas fa-robot"></i>
            <span>Ask AI</span>
          </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 