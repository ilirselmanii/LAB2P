const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').sequelize;

const Festival = sequelize.define('Festivali', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  EmriFestivalit: {
    type: DataTypes.STRING,
    allowNull: false
  },
  LlojiFestivalit: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'Festivali',
  timestamps: false
});

module.exports = Festival;
