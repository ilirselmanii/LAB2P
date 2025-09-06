const Festival = require('../models/Festival');
const Event = require('../models/Event');

// @desc    Get all festivals
// @route   GET /api/festivals
// @access  Public
exports.getFestivals = async (req, res, next) => {
  try {
    const festivals = await Festival.findAll({
      include: [{
        model: Event,
        as: 'events',
        attributes: ['id', 'name', 'startTime', 'endTime', 'location'],
      }],
      order: [['startDate', 'ASC']],
    });
    
    res.status(200).json({
      success: true,
      count: festivals.length,
      data: festivals,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single festival
// @route   GET /api/festivals/:id
// @access  Public
exports.getFestival = async (req, res, next) => {
  try {
    const festival = await Festival.findByPk(req.params.id, {
      include: [{
        model: Event,
        as: 'events',
        attributes: ['id', 'name', 'startTime', 'endTime', 'location'],
      }],
    });

    if (!festival) {
      return res.status(404).json({
        success: false,
        error: 'Festival not found',
      });
    }

    res.status(200).json({
      success: true,
      data: festival,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new festival
// @route   POST /api/festivals
// @access  Private/Admin
exports.createFestival = async (req, res, next) => {
  try {
    const festival = await Festival.create(req.body);
    
    res.status(201).json({
      success: true,
      data: festival,
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

// @desc    Update festival
// @route   PUT /api/festivals/:id
// @access  Private/Admin
exports.updateFestival = async (req, res, next) => {
  try {
    const festival = await Festival.findByPk(req.params.id);

    if (!festival) {
      return res.status(404).json({
        success: false,
        error: 'Festival not found',
      });
    }

    const updatedFestival = await festival.update(req.body);

    res.status(200).json({
      success: true,
      data: updatedFestival,
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

// @desc    Delete festival
// @route   DELETE /api/festivals/:id
// @access  Private/Admin
exports.deleteFestival = async (req, res, next) => {
  try {
    const festival = await Festival.findByPk(req.params.id);

    if (!festival) {
      return res.status(404).json({
        success: false,
        error: 'Festival not found',
      });
    }

    await festival.destroy();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
