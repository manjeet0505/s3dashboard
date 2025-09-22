'use client';

export default function DashboardHome({ user }) {
  const stats = [
    { title: 'Resume Score', value: '85%', icon: 'fas fa-file-alt', color: 'bg-blue-500' },
    { title: 'Jobs Applied', value: '12', icon: 'fas fa-briefcase', color: 'bg-green-500' },
    { title: 'Interviews', value: '3', icon: 'fas fa-handshake', color: 'bg-purple-500' },
    { title: 'Skills Mastered', value: '8', icon: 'fas fa-star', color: 'bg-orange-500' },
  ];

  const recentActivities = [
    { action: 'Resume updated', time: '2 hours ago', type: 'resume' },
    { action: 'Applied to Software Engineer at Google', time: '1 day ago', type: 'application' },
    { action: 'Completed DSA problem #45', time: '2 days ago', type: 'progress' },
    { action: 'Scheduled mentor session', time: '3 days ago', type: 'mentor' },
  ];

  const upcomingTasks = [
    { task: 'Complete React.js certification', due: 'Tomorrow', priority: 'high' },
    { task: 'Prepare for Google interview', due: 'Next week', priority: 'high' },
    { task: 'Update LinkedIn profile', due: 'This week', priority: 'medium' },
    { task: 'Practice system design', due: 'Next month', priority: 'low' },
  ];

  // Get user's first name for personalized greeting
  const firstName = user?.name ? user.name.split(' ')[0] : 'Student';

  return (
    <div className="dashboard-home">
      <div className="page-header">
        <h1>Welcome, {firstName} 👋</h1>
        <p className="text-gray-600">Here's your student success journey</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className={`stat-icon ${stat.color}`}>
              <i className={stat.icon}></i>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-title">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        {/* Recent Activities */}
        <div className="content-card">
          <div className="card-header">
            <h2>Recent Activities</h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="activities-list">
            {recentActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className={`activity-icon ${activity.type}`}>
                  <i className={`fas fa-${activity.type === 'resume' ? 'file-alt' : 
                                      activity.type === 'application' ? 'briefcase' :
                                      activity.type === 'progress' ? 'chart-line' : 'users'}`}></i>
                </div>
                <div className="activity-content">
                  <p className="activity-text">{activity.action}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="content-card">
          <div className="card-header">
            <h2>Upcoming Tasks</h2>
            <button className="add-task-btn">
              <i className="fas fa-plus"></i> Add Task
            </button>
          </div>
          <div className="tasks-list">
            {upcomingTasks.map((task, index) => (
              <div key={index} className={`task-item priority-${task.priority}`}>
                <div className="task-content">
                  <p className="task-text">{task.task}</p>
                  <span className="task-due">Due: {task.due}</span>
                </div>
                <div className={`priority-badge ${task.priority}`}>
                  {task.priority}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn">
            <i className="fas fa-upload"></i>
            <span>Upload Resume</span>
          </button>
          <button className="action-btn">
            <i className="fas fa-search"></i>
            <span>Find Jobs</span>
          </button>
          <button className="action-btn">
            <i className="fas fa-calendar"></i>
            <span>Schedule Session</span>
          </button>
          <button className="action-btn">
            <i className="fas fa-robot"></i>
            <span>Ask AI</span>
          </button>
        </div>
      </div>
    </div>
  );
} 