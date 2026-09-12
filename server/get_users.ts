import mongoose from 'mongoose';
import { User } from './src/models/User.js';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  const users = await User.find().sort({ createdAt: -1 }).limit(5);
  console.log("RECENT USERS:");
  users.forEach(u => console.log(`${u.email} - ${u.role}`));
  process.exit(0);
}
run();
