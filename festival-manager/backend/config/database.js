require('dotenv').config();
const { Sequelize } = require('sequelize');
const mongoose = require('mongoose');

// SQLite configuration (Primary database)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.SQLITE_DB_PATH || './database.sqlite',
  logging: false,
});

// MongoDB connection (Optional for NoSQL requirement)
const connectMongoDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.log('MongoDB URI not provided. MongoDB will not be connected.');
      return;
    }
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.warn('Warning: Could not connect to MongoDB. Continuing with SQLite only.');
    console.warn('MongoDB Error:', error.message);
  }
};

module.exports = {
  sequelize,
  connectMongoDB,
};