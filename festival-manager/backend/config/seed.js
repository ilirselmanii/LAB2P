require('dotenv').config();
const { sequelize } = require('./database');
const Festival = require('../models/Festival');
const Event = require('../models/Event');

const seedDatabase = async () => {
  try {
    // Sync all models
    await sequelize.sync({ force: true });
    console.log('Database synced!');

    // Create test festivals
    const festivals = await Festival.bulkCreate([
      {
        name: 'Summer Music Festival',
        type: 'Music',
        description: 'Annual summer music festival featuring various artists',
        startDate: '2023-07-15',
        endDate: '2023-07-17',
        location: 'Central Park, New York',
        isActive: true,
      },
      {
        name: 'Tech Conference 2023',
        type: 'Technology',
        description: 'Leading technology conference with industry experts',
        startDate: '2023-09-20',
        endDate: '2023-09-22',
        location: 'Moscone Center, San Francisco',
        isActive: true,
      },
      {
        name: 'Food & Wine Expo',
        type: 'Food & Drink',
        description: 'Experience the finest food and wine from around the world',
        startDate: '2023-10-10',
        endDate: '2023-10-12',
        location: 'McCormick Place, Chicago',
        isActive: true,
      },
    ]);

    console.log('Created festivals:', festivals.map(f => f.name));

    // Create test events
    const events = await Event.bulkCreate([
      // Events for Summer Music Festival
      {
        name: 'Opening Concert',
        description: 'Kick-off concert with headlining artists',
        startTime: '2023-07-15T18:00:00',
        endTime: '2023-07-15T23:00:00',
        location: 'Main Stage',
        capacity: 10000,
        festivalId: festivals[0].id,
        isActive: true,
      },
      {
        name: 'Indie Showcase',
        description: 'Showcasing up-and-coming indie artists',
        startTime: '2023-07-16T14:00:00',
        endTime: '2023-07-16T18:00:00',
        location: 'Indie Stage',
        capacity: 2000,
        festivalId: festivals[0].id,
        isActive: true,
      },
      // Events for Tech Conference 2023
      {
        name: 'Keynote: Future of AI',
        description: 'Opening keynote on artificial intelligence trends',
        startTime: '2023-09-20T09:00:00',
        endTime: '2023-09-20T10:30:00',
        location: 'Grand Ballroom',
        capacity: 5000,
        festivalId: festivals[1].id,
        isActive: true,
      },
      {
        name: 'Blockchain Workshop',
        description: 'Hands-on workshop on blockchain development',
        startTime: '2023-09-21T13:00:00',
        endTime: '2023-09-21T16:00:00',
        location: 'Workshop Room A',
        capacity: 50,
        festivalId: festivals[1].id,
        isActive: true,
      },
      // Events for Food & Wine Expo
      {
        name: 'Wine Tasting Masterclass',
        description: 'Learn about wine varieties and tasting techniques',
        startTime: '2023-10-10T11:00:00',
        endTime: '2023-10-10T13:00:00',
        location: 'Tasting Room 1',
        capacity: 30,
        festivalId: festivals[2].id,
        isActive: true,
      },
      {
        name: 'Celebrity Chef Demo',
        description: 'Live cooking demonstration by a celebrity chef',
        startTime: '2023-10-11T15:00:00',
        endTime: '2023-10-11T17:00:00',
        location: 'Main Stage',
        capacity: 200,
        festivalId: festivals[2].id,
        isActive: true,
      },
    ]);

    console.log('Created events:', events.map(e => e.name));
    console.log('\nDatabase seeded successfully! 🎉');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
