const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Officer = require('../models/Officer');

// Get promotion history for an officer
router.get('/history/:officerId', async (req, res) => {
  try {
    const officer = await Officer.findById(req.params.officerId);
    if (!officer) return res.status(404).json({ error: 'Officer not found' });
    
    res.json(officer.promotionHistory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Promote officer
router.post('/promote/:officerId',
  body('toRank').notEmpty(),
  body('promotedBy').optional().trim(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const officer = await Officer.findById(req.params.officerId);
      if (!officer) return res.status(404).json({ error: 'Officer not found' });

      const fromRank = officer.currentRank;
      const toRank = req.body.toRank;

      // Add to promotion history
      officer.promotionHistory.push({
        fromRank,
        toRank,
        date: new Date(),
        promotedBy: req.body.promotedBy || 'Admin'
      });

      // Update rank and reset promotion ready status
      officer.currentRank = toRank;
      officer.dateJoinedCurrentRank = new Date();
      officer.readyForPromotion = false;
      officer.updatedAt = new Date();

      await officer.save();

      res.json({
        ...officer.toObject(),
        daysInCurrentRank: officer.getDaysInCurrentRank(),
        isAppointmentOnly: officer.isAppointmentOnlyRank(),
        nextRank: officer.getNextRank()
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get all officers ready for promotion
router.get('/ready/list', async (req, res) => {
  try {
    const officers = await Officer.find({ readyForPromotion: true });
    
    const enrichedOfficers = officers.map(officer => ({
      ...officer.toObject(),
      daysInCurrentRank: officer.getDaysInCurrentRank(),
      isAppointmentOnly: officer.isAppointmentOnlyRank(),
      nextRank: officer.getNextRank()
    }));

    res.json(enrichedOfficers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
