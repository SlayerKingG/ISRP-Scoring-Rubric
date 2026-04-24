import React, { useState } from 'react';
import './OfficerDetail.css';

function OfficerDetail({ officer, onClose, onUpdate, onPromote, onDelete, ranks }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: officer.name,
    evaluationNotes: officer.evaluationNotes
  });
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [promoteData, setPromoteData] = useState({
    toRank: officer.nextRank || '',
    promotedBy: 'Admin'
  });

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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDays = (days) => {
    if (days === 1) return '1 day';
    return `${days} days`;
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleSaveEdit = () => {
    onUpdate(officer._id, editData);
    setIsEditing(false);
  };

  const handlePromoteChange = (e) => {
    const { name, value } = e.target;
    setPromoteData({ ...promoteData, [name]: value });
  };

  const handlePromote = () => {
    onPromote(officer._id, promoteData.toRank, promoteData.promotedBy);
    setShowPromoteModal(false);
  };

  const promotableRanks = ranks.filter(r => r !== officer.currentRank);

  return (
    <div className="officer-detail">
      <div className="detail-header">
        <button className="close-btn" onClick={onClose}>← Back</button>
        <h2>{officer.name}</h2>
        <div className="rank-badge" style={{ backgroundColor: getRankColor(officer.currentRank) }}>
          {officer.currentRank}
        </div>
      </div>

      <div className="detail-content">
        <section className="detail-section">
          <h3>Basic Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Current Rank</label>
              <div className="info-value">{officer.currentRank}</div>
            </div>
            <div className="info-item">
              <label>Join Date</label>
              <div className="info-value">{formatDate(officer.joinDate)}</div>
            </div>
            <div className="info-item">
              <label>Time in Current Rank</label>
              <div className="info-value">{formatDays(officer.daysInCurrentRank)}</div>
            </div>
            <div className="info-item">
              <label>Joined Current Rank</label>
              <div className="info-value">{formatDate(officer.dateJoinedCurrentRank)}</div>
            </div>
            {officer.nextRank && !officer.isAppointmentOnly && (
              <div className="info-item">
                <label>Next Rank</label>
                <div className="info-value">{officer.nextRank}</div>
              </div>
            )}
            {officer.isAppointmentOnly && (
              <div className="info-item appointment-only">
                <label>Rank Type</label>
                <div className="info-value">📋 Appointment Only</div>
              </div>
            )}
          </div>
        </section>

        <section className="detail-section">
          <h3>Evaluation Notes</h3>
          {isEditing ? (
            <div className="edit-section">
              <textarea
                name="evaluationNotes"
                value={editData.evaluationNotes}
                onChange={handleEditChange}
                rows="4"
              />
              <div className="edit-actions">
                <button className="save-btn" onClick={handleSaveEdit}>Save</button>
                <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="notes-display">
              <p>{officer.evaluationNotes || 'No evaluation notes'}</p>
              <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
            </div>
          )}
        </section>

        {officer.promotionHistory && officer.promotionHistory.length > 0 && (
          <section className="detail-section">
            <h3>Promotion History</h3>
            <div className="promotion-history">
              {officer.promotionHistory.map((promotion, idx) => (
                <div key={idx} className="promotion-item">
                  <div className="promotion-ranks">
                    <span className="from-rank">{promotion.fromRank}</span>
                    <span className="arrow">→</span>
                    <span className="to-rank">{promotion.toRank}</span>
                  </div>
                  <div className="promotion-details">
                    <span className="date">{formatDate(promotion.date)}</span>
                    <span className="by">by {promotion.promotedBy}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="detail-section actions-section">
          <h3>Actions</h3>
          <div className="action-buttons">
            <button 
              className={`mark-ready-btn ${officer.readyForPromotion ? 'active' : ''}`}
              onClick={() => onUpdate(officer._id, { readyForPromotion: !officer.readyForPromotion })}
            >
              {officer.readyForPromotion ? '✓ Mark as Not Ready' : '✓ Mark as Ready for Promotion'}
            </button>

            {!officer.isAppointmentOnly && officer.nextRank && (
              <button 
                className="promote-btn"
                onClick={() => setShowPromoteModal(true)}
              >
                Promote to {officer.nextRank}
              </button>
            )}

            {officer.isAppointmentOnly && (
              <button 
                className="appoint-btn"
                onClick={() => setShowPromoteModal(true)}
              >
                Appoint to Different Rank
              </button>
            )}

            <button 
              className="delete-btn"
              onClick={() => onDelete(officer._id)}
            >
              Delete Officer
            </button>
          </div>
        </section>
      </div>

      {showPromoteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{officer.isAppointmentOnly ? 'Appoint Officer' : 'Promote Officer'}</h3>
            
            <div className="form-group">
              <label>New Rank</label>
              <select
                name="toRank"
                value={promoteData.toRank}
                onChange={handlePromoteChange}
              >
                <option value="">Select new rank...</option>
                {promotableRanks.map(rank => (
                  <option key={rank} value={rank}>{rank}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Promoted By</label>
              <input
                type="text"
                name="promotedBy"
                value={promoteData.promotedBy}
                onChange={handlePromoteChange}
                placeholder="Enter your name or admin ID"
              />
            </div>

            <div className="modal-actions">
              <button 
                className="confirm-btn"
                onClick={handlePromote}
                disabled={!promoteData.toRank}
              >
                Confirm {officer.isAppointmentOnly ? 'Appointment' : 'Promotion'}
              </button>
              <button 
                className="cancel-btn"
                onClick={() => setShowPromoteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OfficerDetail;
