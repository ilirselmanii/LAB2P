const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Festival = require('../models/Festival');

// Get all events with optional festival filter
router.get('/', async (req, res) => {
  try {
    const { festivalId } = req.query;
    const whereClause = festivalId ? { ID_Festivali: festivalId } : {};
    
    const events = await Event.findAll({
      where: whereClause,
      include: [{
        model: Festival,
        attributes: ['ID', 'EmriFestivalit', 'LlojiFestivalit']
      }]
    });
    
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new event
router.post('/', async (req, res) => {
  try {
    const { EmriEventit, Data, Ora, ID_Festivali } = req.body;
    
    // Check if festival exists
    const festival = await Festival.findByPk(ID_Festivali);
    if (!festival) {
      return res.status(404).json({ message: 'Festival not found' });
    }
    
    const newEvent = await Event.create({
      EmriEventit,
      Data,
      Ora,
      ID_Festivali
    });
    
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all festivals for dropdown
router.get('/festivals', async (req, res) => {
  try {
    const festivals = await Festival.findAll({
      attributes: ['ID', 'EmriFestivalit']
    });
    res.json(festivals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [{
        model: Festival,
        attributes: ['ID', 'EmriFestivalit', 'LlojiFestivalit']
      }]
    });
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an event
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { EmriEventit, Data, Ora, ID_Festivali } = req.body;
    
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Update the event fields
    event.EmriEventit = EmriEventit || event.EmriEventit;
    event.Data = Data || event.Data;
    event.Ora = Ora || event.Ora;
    
    if (ID_Festivali) {
      const festival = await Festival.findByPk(ID_Festivali);
      if (!festival) {
        return res.status(404).json({ message: 'Festival not found' });
      }
      event.ID_Festivali = ID_Festivali;
    }
    
    await event.save();
    res.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
});

// Delete an event
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    await event.destroy();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;