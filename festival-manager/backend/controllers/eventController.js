const Event = require('../models/Event');
const Festival = require('../models/Festival');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res, next) => {
  try {
    const { festivalId } = req.query;
    
    const whereClause = {};
    if (festivalId) {
      whereClause.festivalId = festivalId;
    }

    const events = await Event.findAll({
      where: whereClause,
      include: [{
        model: Festival,
        as: 'festival',
        attributes: ['id', 'name', 'startDate', 'endDate'],
      }],
      order: [['startTime', 'ASC']],
    });
    
    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [{
        model: Festival,
        as: 'festival',
        attributes: ['id', 'name', 'startDate', 'endDate'],
      }],
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Admin
exports.createEvent = async (req, res, next) => {
  try {
    // Check if festival exists
    const festival = await Festival.findByPk(req.body.festivalId);
    if (!festival) {
      return res.status(404).json({
        success: false,
        error: 'Festival not found',
      });
    }

    // Check if event times are within festival dates
    const eventStart = new Date(req.body.startTime);
    const eventEnd = new Date(req.body.endTime);
    const festivalStart = new Date(festival.startDate);
    const festivalEnd = new Date(festival.endDate);

    if (eventStart < festivalStart || eventEnd > festivalEnd) {
      return res.status(400).json({
        success: false,
        error: 'Event must be scheduled within the festival dates',
      });
    }

    const event = await Event.create(req.body);
    
    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({
        success: false,
        error: messages,
      });
    }
    next(error);
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin
exports.updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found',
      });
    }

    // If updating festivalId or dates, validate against the festival
    if (req.body.festivalId || req.body.startTime || req.body.endTime) {
      const festivalId = req.body.festivalId || event.festivalId;
      const festival = await Festival.findByPk(festivalId);
      
      if (!festival) {
        return res.status(404).json({
          success: false,
          error: 'Festival not found',
        });
      }

      const eventStart = req.body.startTime ? new Date(req.body.startTime) : new Date(event.startTime);
      const eventEnd = req.body.endTime ? new Date(req.body.endTime) : new Date(event.endTime);
      const festivalStart = new Date(festival.startDate);
      const festivalEnd = new Date(festival.endDate);

      if (eventStart < festivalStart || eventEnd > festivalEnd) {
        return res.status(400).json({
          success: false,
          error: 'Event must be scheduled within the festival dates',
        });
      }
    }

    const updatedEvent = await event.update(req.body);

    res.status(200).json({
      success: true,
      data: updatedEvent,
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({
        success: false,
        error: messages,
      });
    }
    next(error);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found',
      });
    }

    await event.destroy();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
