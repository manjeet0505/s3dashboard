'use client';

import { useState } from 'react';

export default function JobRecommendations() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const jobRecommendations = [
    {
      id: 1,
      title: 'Software Engineer',
      company: 'Google',
      location: 'Mountain View, CA',
      salary: '$120k - $180k',
      matchScore: 95,
      skills: ['JavaScript', 'React', 'Node.js', 'Python'],
      posted: '2 days ago',
      type: 'Full-time',
      remote: true
    },
    {
      id: 2,
      title: 'Frontend Developer',
      company: 'Microsoft',
      location: 'Seattle, WA',
      salary: '$100k - $150k',
      matchScore: 88,
      skills: ['React', 'TypeScript', 'CSS', 'HTML'],
      posted: '1 day ago',
      type: 'Full-time',
      remote: false
    },
    {
      id: 3,
      title: 'Full Stack Developer',
      company: 'Amazon',
      location: 'Seattle, WA',
      salary: '$110k - $170k',
      matchScore: 82,
      skills: ['JavaScript', 'React', 'Node.js', 'AWS'],
      posted: '3 days ago',
      type: 'Full-time',
      remote: true
    }
  ];

  const filters = [
    { id: 'all', label: 'All Jobs' },
    { id: 'remote', label: 'Remote' },
    { id: 'onsite', label: 'On-site' },
    { id: 'high-match', label: 'High Match' }
  ];

  return (
    <div className="job-recommendations">
      <div className="page-header">
        <h1>Job Recommendations</h1>
        <p className="text-gray-600">AI-powered job matches based on your skills and preferences</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-tabs">
          {filters.map((filter) => (
            <button
              key={filter.id}
              className={`filter-tab ${selectedFilter === filter.id ? 'active' : ''}`}
              onClick={() => setSelectedFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Job Listings */}
      <div className="jobs-grid">
        {jobRecommendations.map((job) => (
          <div key={job.id} className="job-card">
            <div className="job-header">
              <div className="job-title-section">
                <h3 className="job-title">{job.title}</h3>
                <p className="job-company">{job.company}</p>
              </div>
              <div className="match-score">
                <div className="score-circle">
                  <span>{job.matchScore}%</span>
                </div>
                <span className="match-label">Match</span>
              </div>
            </div>

            <div className="job-details">
              <div className="job-meta">
                <span className="job-location">
                  <i className="fas fa-map-marker-alt"></i>
                  {job.location}
                </span>
                <span className="job-salary">
                  <i className="fas fa-dollar-sign"></i>
                  {job.salary}
                </span>
                <span className="job-type">
                  <i className="fas fa-clock"></i>
                  {job.type}
                </span>
                {job.remote && (
                  <span className="job-remote">
                    <i className="fas fa-home"></i>
                    Remote
                  </span>
                )}
              </div>

              <div className="job-skills">
                <h4>Required Skills</h4>
                <div className="skills-tags">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="job-footer">
                <span className="posted-time">Posted {job.posted}</span>
                <div className="job-actions">
                  <button className="btn-apply">Apply Now</button>
                  <button className="btn-save">
                    <i className="fas fa-bookmark"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="load-more-section">
        <button className="btn-load-more">
          <i className="fas fa-plus"></i>
          Load More Jobs
        </button>
      </div>
    </div>
  );
} 