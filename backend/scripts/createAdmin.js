#!/usr/bin/env node
/**
 * createAdmin.js
 *
 * Usage:
 *  node createAdmin.js --email admin@example.com --password MyP@ssw0rd --name Admin
 *
 * This script will create a new user with role 'admin' or promote an existing user to admin.
 * Run this locally where you have access to your project's .env (or set MONGODB_URI env var).
 * WARNING: Remove or protect this script after use in production.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

// Load User model
const User = require(path.join(__dirname, '..', '..', 'models', 'User'));

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].replace(/^--/, '');
      const val = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true;
      out[key] = val;
      if (val !== true) i++;
    }
  }
  return out;
}

async function main() {
  const { email, password, name } = parseArgs();

  if (!email || !password || !name) {
    console.error('Missing required args. Usage: node createAdmin.js --email admin@example.com --password P@ss --name Admin');
    process.exit(1);
  }

  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('MONGODB_URI not found in environment. Set it in .env or export MONGODB_URI.');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    let user = await User.findOne({ email: email.toLowerCase() });
    const hashed = await bcrypt.hash(password, 10);

    if (user) {
      console.log(`Found existing user (${user._id}). Updating role to 'admin' and setting new password.`);
      user.role = 'admin';
      user.password = hashed;
      user.name = name;
      await user.save();
    } else {
      console.log('Creating new admin user...');
      user = new User({
        name,
        email: email.toLowerCase(),
        password: hashed,
        role: 'admin',
      });
      await user.save();
    }

    console.log('Success! Admin user created/updated:');
    console.log(` - id: ${user._id}`);
    console.log(` - email: ${user.email}`);
    console.log('IMPORTANT: Do NOT share this output publicly. Remove the script after use in production.');
  } catch (err) {
    console.error('Error creating admin user:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

main();
