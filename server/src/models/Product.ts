import mongoose, { Schema, Document } from 'mongoose';

export interface ISizeMeasurement {
  chestCm?: number;
  shoulderCm?: number;
  lengthCm?: number;
  sleeveCm?: number;
  waistCm?: number;
}

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  brand: string;
  category: string;
  price: number;
  description: string;
  fitType: 'slim' | 'regular' | 'relaxed' | 'oversized';
  fabric: string;
  stretchLevel: 'none' | 'low' | 'medium' | 'high';
  images: string[];
  sizes: string[];
  sizeChart: Record<string, ISizeMeasurement>;
  availableStock: number;
  tags: string[];
  brandFitOffsetCm: number;
  createdAt: Date;
  updatedAt: Date;
}

const SizeMeasurementSchema = new Schema<ISizeMeasurement>({
  chestCm: { type: Number },
  shoulderCm: { type: Number },
  lengthCm: { type: Number },
  sleeveCm: { type: Number },
  waistCm: { type: Number }
}, { _id: false });

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true, trim: true },
  brand: { type: String, required: true, index: true },
  category: { type: String, required: true, index: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, required: true },
  fitType: { 
    type: String, 
    enum: ['slim', 'regular', 'relaxed', 'oversized'], 
    required: true 
  },
  fabric: { type: String, required: true },
  stretchLevel: { 
    type: String, 
    enum: ['none', 'low', 'medium', 'high'], 
    default: 'low' 
  },
  images: [{ type: String }],
  sizes: [{ type: String, required: true }],
  sizeChart: { type: Map, of: SizeMeasurementSchema, required: true },
  availableStock: { type: Number, default: 50 },
  tags: [{ type: String }],
  brandFitOffsetCm: { type: Number, default: 0 }
}, { timestamps: true });

ProductSchema.index({ name: 'text', brand: 'text', description: 'text' });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
