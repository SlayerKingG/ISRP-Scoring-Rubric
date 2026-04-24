import React, { useState } from 'react';
import './AddOfficerForm.css';

function AddOfficerForm({ onSubmit, ranks }) {
  const [formData, setFormData] = useState({
    name: '',
    currentRank: 'Recruit',
    joinDate: new Date().toISOString().split('T')[0],
    dateJoinedCurrentRank: new Date().toISOString().split('T')[0],
    evaluationNotes: '',
    readyForPromotion: false
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.currentRank) newErrors.currentRank = 'Rank is required';
    if (!formData.joinDate) newErrors.joinDate = 'Join date is required';
    if (!formData.dateJoinedCurrentRank) newErrors.dateJoinedCurrentRank = 'Date joined current rank is required';
    
    const joinDate = new Date(formData.joinDate);
    const rankDate = new Date(formData.dateJoinedCurrentRank);
    if (rankDate < joinDate) {
      newErrors.dateJoinedCurrentRank = 'Date joined rank cannot be before join date';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit({
        ...formData,
        joinDate: new Date(formData.joinDate).toISOString(),
        dateJoinedCurrentRank: new Date(formData.dateJoinedCurrentRank).toISOString()
      });
      // Reset form
      setFormData({
        name: '',
        currentRank: 'Recruit',
        joinDate: new Date().toISOString().split('T')[0],
        dateJoinedCurrentRank: new Date().toISOString().split('T')[0],
        evaluationNotes: '',
        readyForPromotion: false
      });
      setErrors({});
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <form className="add-officer-form" onSubmit={handleSubmit}>
      <h2>Add New Officer</h2>

      <div className="form-group">
        <label htmlFor="name">Officer Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter officer name"
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="currentRank">Current Rank *</label>
        <select
          id="currentRank"
          name="currentRank"
          value={formData.currentRank}
          onChange={handleChange}
          className={errors.currentRank ? 'error' : ''}
        >
          {ranks.map(rank => (
            <option key={rank} value={rank}>{rank}</option>
          ))}
        </select>
        {errors.currentRank && <span className="error-text">{errors.currentRank}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="joinDate">Join Date *</label>
          <input
            type="date"
            id="joinDate"
            name="joinDate"
            value={formData.joinDate}
            onChange={handleChange}
            className={errors.joinDate ? 'error' : ''}
          />
          {errors.joinDate && <span className="error-text">{errors.joinDate}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="dateJoinedCurrentRank">Date Joined Current Rank *</label>
          <input
            type="date"
            id="dateJoinedCurrentRank"
            name="dateJoinedCurrentRank"
            value={formData.dateJoinedCurrentRank}
            onChange={handleChange}
            className={errors.dateJoinedCurrentRank ? 'error' : ''}
          />
          {errors.dateJoinedCurrentRank && <span className="error-text">{errors.dateJoinedCurrentRank}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="evaluationNotes">Evaluation Notes</label>
        <textarea
          id="evaluationNotes"
          name="evaluationNotes"
          value={formData.evaluationNotes}
          onChange={handleChange}
          placeholder="Add any evaluation notes or comments..."
          rows="4"
        />
      </div>

      <div className="form-group checkbox">
        <input
          type="checkbox"
          id="readyForPromotion"
          name="readyForPromotion"
          checked={formData.readyForPromotion}
          onChange={handleChange}
        />
        <label htmlFor="readyForPromotion">Mark as Ready for Promotion</label>
      </div>

      <button type="submit" className="submit-btn">Add Officer</button>
    </form>
  );
}

export default AddOfficerForm;
