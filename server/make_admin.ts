import mongoose from 'mongoose';
import { User } from './src/models/User.js';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  const email = 'ankitchaudhary9876543@gmail.com';
  const user = await User.findOne({ email });
  
  if (!user) {
    console.log(`User with email ${email} not found!`);
  } else {
    user.role = 'admin';
    await user.save();
    console.log(`Successfully promoted ${email} to admin!`);
  }
  process.exit(0);
}
run();
