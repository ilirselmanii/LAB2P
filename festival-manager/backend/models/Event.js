const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').sequelize;

const Event = sequelize.define('Eventi', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  EmriEventit: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Data: {
    type: DataTypes.DATE,
    allowNull: false
  },
  Ora: {
    type: DataTypes.TIME,
    allowNull: false
  },
  ID_Festivali: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Festivali',
      key: 'ID'
    }
  }
}, {
  tableName: 'Eventi',
  timestamps: false
});

// Import Festival model after defining Event to avoid circular dependency
const Festival = require('./Festival');

// Define associations
Event.belongsTo(Festival, { foreignKey: 'ID_Festivali' });
Festival.hasMany(Event, { foreignKey: 'ID_Festivali' });

module.exports = Event;
