import mongoose from 'mongoose';
import { Product } from './src/models/Product';
import { ENV } from './src/config/env';

async function run() {
  await mongoose.connect(ENV.MONGODB_URI);
  await Product.updateOne(
    { name: 'FlexFit Relaxed Denim Jeans' },
    { $set: { images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop'] } }
  );
  console.log('Fixed image');
  process.exit(0);
}
run();
