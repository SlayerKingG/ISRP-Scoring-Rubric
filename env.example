const mongoose = require('mongoose');

const RANKS = {
  PROMOTABLE: ['Recruit', 'Officer', 'Corporal', 'Sergeant', 'Staff Sergeant'],
  APPOINTMENT: ['Lieutenant', 'Captain', 'Major']
};

const promotionHistorySchema = new mongoose.Schema({
  fromRank: String,
  toRank: String,
  date: { type: Date, default: Date.now },
  promotedBy: String
});

const officerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  currentRank: {
    type: String,
    enum: [...RANKS.PROMOTABLE, ...RANKS.APPOINTMENT],
    default: 'Recruit'
  },
  joinDate: {
    type: Date,
    required: true
  },
  dateJoinedCurrentRank: {
    type: Date,
    required: true
  },
  evaluationNotes: {
    type: String,
    default: ''
  },
  readyForPromotion: {
    type: Boolean,
    default: false
  },
  promotionHistory: [promotionHistorySchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Get days in current rank
officerSchema.methods.getDaysInCurrentRank = function() {
  const now = new Date();
  const daysMs = now - this.dateJoinedCurrentRank;
  return Math.floor(daysMs / (1000 * 60 * 60 * 24));
};

// Check if rank is appointment-only
officerSchema.methods.isAppointmentOnlyRank = function() {
  return RANKS.APPOINTMENT.includes(this.currentRank);
};

// Get next rank
officerSchema.methods.getNextRank = function() {
  const allRanks = [...RANKS.PROMOTABLE, ...RANKS.APPOINTMENT];
  const currentIndex = allRanks.indexOf(this.currentRank);
  return currentIndex < allRanks.length - 1 ? allRanks[currentIndex + 1] : null;
};

module.exports = mongoose.model('Officer', officerSchema);
module.exports.RANKS = RANKS;
