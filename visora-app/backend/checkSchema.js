// Script to check the User schema in MongoDB
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully\n');

    // Get the User model
    const User = require('./models/User');
    
    // Get schema paths
    const schemaPaths = User.schema.paths;
    
    console.log('📋 USER SCHEMA STRUCTURE:\n');
    console.log('='.repeat(60));
    
    // Display main fields
    console.log('\n📌 Main Fields:');
    Object.keys(schemaPaths).forEach(path => {
      if (!path.startsWith('preferences.') && path !== '__v' && path !== '_id') {
        const field = schemaPaths[path];
        console.log(`  - ${path}: ${field.instance || field.constructor.name}`);
      }
    });
    
    // Display preferences fields
    console.log('\n🎨 Preferences Fields:');
    Object.keys(schemaPaths).forEach(path => {
      if (path.startsWith('preferences.')) {
        const field = schemaPaths[path];
        const fieldName = path.replace('preferences.', '');
        const fieldType = field.instance || field.constructor.name;
        const defaultValue = field.defaultValue;
        
        console.log(`  - ${fieldName}: ${fieldType} (default: ${JSON.stringify(defaultValue)})`);
      }
    });
    
    console.log('\n' + '='.repeat(60));
    
    // Count users
    const userCount = await User.countDocuments();
    console.log(`\n👥 Total users in database: ${userCount}`);
    
    // Show sample user preferences structure
    if (userCount > 0) {
      const sampleUser = await User.findOne().select('name email preferences');
      console.log('\n📄 Sample User Preferences Structure:');
      console.log(JSON.stringify(sampleUser.preferences, null, 2));
    }
    
    console.log('\n✅ Schema check complete!\n');
    
    mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

connectDB();
