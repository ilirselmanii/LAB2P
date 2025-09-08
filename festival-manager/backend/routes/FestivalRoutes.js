const express = require('express');
const router = express.Router();
const Festival = require('../models/Festival');

// Get all festivals
router.get('/', async (req, res) => {
  try {
    const festivals = await Festival.findAll();
    res.json(festivals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single festival by ID
router.get('/:id', async (req, res) => {
  try {
    const festival = await Festival.findByPk(req.params.id);
    if (!festival) {
      return res.status(404).json({ message: 'Festival not found' });
    }
    res.json(festival);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new festival
router.post('/', async (req, res) => {
  try {
    const { EmriFestivalit, LlojiFestivalit } = req.body;
    const newFestival = await Festival.create({ EmriFestivalit, LlojiFestivalit });
    res.status(201).json(newFestival);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a festival
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { EmriFestivalit, LlojiFestivalit } = req.body;
    
    const festival = await Festival.findByPk(id);
    if (!festival) {
      return res.status(404).json({ message: 'Festival not found' });
    }
    
    festival.EmriFestivalit = EmriFestivalit || festival.EmriFestivalit;
    festival.LlojiFestivalit = LlojiFestivalit || festival.LlojiFestivalit;
    
    await festival.save();
    res.json(festival);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a festival
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Festival.destroy({
      where: { ID: id }
    });
    
    if (!deleted) {
      return res.status(404).json({ message: 'Festival not found' });
    }
    
    res.json({ message: 'Festival deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
