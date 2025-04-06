import React from 'react';
import { FiClock, FiEye, FiCheckCircle, FiClipboard } from 'react-icons/fi';
import './RecentActivity.css';

const RecentActivity = () => {
  // Mock data for recent activities
  // In a real app, this would be fetched from the API
  const recentActivities = [
    {
      id: 1,
      type: 'view',
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      date: new Date(Date.now() - 86400000 * 2), // 2 days ago
      icon: <FiEye />
    },
    {
      id: 2,
      type: 'save',
      title: 'UX Designer',
      company: 'DesignStudio',
      date: new Date(Date.now() - 86400000 * 3), // 3 days ago
      icon: <FiClipboard />
    },
    {
      id: 3,
      type: 'apply',
      title: 'Product Manager',
      company: 'ProductHub',
      date: new Date(Date.now() - 86400000 * 5), // 5 days ago
      icon: <FiCheckCircle />
    }
  ];

  // Function to format date relative to now
  const formatRelativeDate = (date) => {
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Function to get activity text based on type
  const getActivityText = (activity) => {
    switch (activity.type) {
      case 'view':
        return `Viewed ${activity.title} at ${activity.company}`;
      case 'save':
        return `Saved ${activity.title} at ${activity.company}`;
      case 'apply':
        return `Applied to ${activity.title} at ${activity.company}`;
      default:
        return `Interacted with ${activity.title}`;
    }
  };

  return (
    <div className="recent-activity">
      <div className="activity-header">
        <h3><FiClock /> Recent Activity</h3>
      </div>
      
      {recentActivities.length === 0 ? (
        <div className="no-activity">
          <p>No recent activity to display.</p>
        </div>
      ) : (
        <ul className="activity-list">
          {recentActivities.map(activity => (
            <li key={activity.id} className={`activity-item ${activity.type}`}>
              <div className="activity-icon">
                {activity.icon}
              </div>
              <div className="activity-content">
                <p className="activity-text">{getActivityText(activity)}</p>
                <span className="activity-date">{formatRelativeDate(activity.date)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
      
      <div className="view-all-activity">
        <button className="view-all-button">View All Activity</button>
      </div>
    </div>
  );
};

export default RecentActivity; 