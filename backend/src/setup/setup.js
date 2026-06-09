require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const mongoose = require('mongoose');
const { seedDatabase } = require('./seedFactory');

mongoose.connect(process.env.DATABASE);

async function setupApp() {
  try {
    await seedDatabase();

    console.log('Setup completed: success.');
    process.exit();
  } catch (error) {
    console.log('\nSetup failed. Error details:');
    console.log(error);
    process.exit(1);
  }
}

setupApp();
