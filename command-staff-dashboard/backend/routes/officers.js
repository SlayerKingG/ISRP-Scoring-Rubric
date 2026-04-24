const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const Officer = require('../models/Officer');

// Get all officers with filtering and sorting
router.get('/', async (req, res) => {
  try {
    const { rank, readyForPromotion, search, sortBy } = req.query;
    let filter = {};

    if (rank) filter.currentRank = rank;
    if (readyForPromotion !== undefined) filter.readyForPromotion = readyForPromotion === 'true';
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    let query = Officer.find(filter);

    // Sorting
    if (sortBy === 'daysInRank') {
      // Fetch all and sort client-side since we need computed property
      const officers = await query.exec();
      officers.sort((a, b) => b.getDaysInCurrentRank() - a.getDaysInCurrentRank());
      return res.json(officers);
    } else if (sortBy === 'name') {
      query = query.sort({ name: 1 });
    } else if (sortBy === 'rank') {
      query = query.sort({ currentRank: 1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const officers = await query.exec();
    
    // Add computed properties
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

// Get officers grouped by rank
router.get('/grouped/byrank', async (req, res) => {
  try {
    const officers = await Officer.find().sort({ currentRank: 1 });
    
    const grouped = {};
    officers.forEach(officer => {
      if (!grouped[officer.currentRank]) {
        grouped[officer.currentRank] = [];
      }
      grouped[officer.currentRank].push({
        ...officer.toObject(),
        daysInCurrentRank: officer.getDaysInCurrentRank(),
        isAppointmentOnly: officer.isAppointmentOnlyRank(),
        nextRank: officer.getNextRank()
      });
    });

    res.json(grouped);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single officer
router.get('/:id', async (req, res) => {
  try {
    const officer = await Officer.findById(req.params.id);
    if (!officer) return res.status(404).json({ error: 'Officer not found' });
    
    res.json({
      ...officer.toObject(),
      daysInCurrentRank: officer.getDaysInCurrentRank(),
      isAppointmentOnly: officer.isAppointmentOnlyRank(),
      nextRank: officer.getNextRank()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create officer
router.post('/',
  body('name').notEmpty().trim(),
  body('currentRank').notEmpty(),
  body('joinDate').isISO8601(),
  body('dateJoinedCurrentRank').isISO8601(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const officer = new Officer({
        name: req.body.name,
        currentRank: req.body.currentRank,
        joinDate: new Date(req.body.joinDate),
        dateJoinedCurrentRank: new Date(req.body.dateJoinedCurrentRank),
        evaluationNotes: req.body.evaluationNotes || '',
        readyForPromotion: req.body.readyForPromotion || false
      });

      await officer.save();
      
      res.status(201).json({
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

// Update officer
router.put('/:id',
  body('name').optional().trim(),
  body('currentRank').optional(),
  body('evaluationNotes').optional(),
  async (req, res) => {
    try {
      const officer = await Officer.findById(req.params.id);
      if (!officer) return res.status(404).json({ error: 'Officer not found' });

      if (req.body.name) officer.name = req.body.name;
      if (req.body.evaluationNotes !== undefined) officer.evaluationNotes = req.body.evaluationNotes;
      if (req.body.readyForPromotion !== undefined) officer.readyForPromotion = req.body.readyForPromotion;
      
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

// Delete officer
router.delete('/:id', async (req, res) => {
  try {
    const officer = await Officer.findByIdAndDelete(req.params.id);
    if (!officer) return res.status(404).json({ error: 'Officer not found' });
    
    res.json({ message: 'Officer deleted', officer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
