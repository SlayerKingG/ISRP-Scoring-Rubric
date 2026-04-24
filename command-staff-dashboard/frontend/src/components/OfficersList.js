import React from 'react';
import './OfficersList.css';

function OfficersList({ officers, onViewOfficer, onUpdateReady }) {
  const formatDays = (days) => {
    if (days === 1) return '1 day';
    return `${days} days`;
  };

  const getRankColor = (rank) => {
    const colors = {
      'Recruit': '#6c757d',
      'Officer': '#3b82f6',
      'Corporal': '#8b5cf6',
      'Sergeant': '#dc2626',
      'Staff Sergeant': '#d97706',
      'Lieutenant': '#059669',
      'Captain': '#7c3aed',
      'Major': '#0891b2'
    };
    return colors[rank] || '#666';
  };

  if (officers.length === 0) {
    return <div className="no-officers">No officers found</div>;
  }

  return (
    <div className="officers-list">
      {officers.map(officer => (
        <div key={officer._id} className="officer-card">
          <div className="officer-header">
            <div className="officer-info">
              <h3 className="officer-name">{officer.name}</h3>
              <div className="officer-rank-badge" style={{ backgroundColor: getRankColor(officer.currentRank) }}>
                {officer.currentRank}
              </div>
            </div>
            <div className="officer-actions">
              <button 
                className="view-btn"
                onClick={() => onViewOfficer(officer)}
              >
                View Details
              </button>
              <button 
                className={`ready-btn ${officer.readyForPromotion ? 'active' : ''}`}
                onClick={() => onUpdateReady(officer._id, !officer.readyForPromotion)}
              >
                {officer.readyForPromotion ? '✓ Ready' : 'Mark Ready'}
              </button>
            </div>
          </div>

          <div className="officer-stats">
            <div className="stat">
              <span className="stat-label">Time in Rank:</span>
              <span className="stat-value">{formatDays(officer.daysInCurrentRank)}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Joined:</span>
              <span className="stat-value">{new Date(officer.joinDate).toLocaleDateString()}</span>
            </div>
            {officer.nextRank && (
              <div className="stat">
                <span className="stat-label">Next Rank:</span>
                <span className="stat-value">{officer.nextRank}</span>
              </div>
            )}
          </div>

          {officer.evaluationNotes && (
            <div className="officer-notes">
              <strong>Notes:</strong> {officer.evaluationNotes}
            </div>
          )}

          {officer.isAppointmentOnly && (
            <div className="appointment-badge">
              📋 Appointment Only Rank
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default OfficersList;
