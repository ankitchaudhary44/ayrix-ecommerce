import mongoose, { Schema, Document } from 'mongoose';

export interface IUserProfile {
  heightCm?: number;
  weightKg?: number;
  chestCm?: number;
  waistCm?: number;
  shoulderCm?: number;
  preferredFit?: 'tight' | 'regular' | 'relaxed' | 'oversized';
  usualSizes?: Record<string, string>;
  preferredBrands?: string[];
}

export interface IWalletTransaction {
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  date: Date;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash?: string;
  role: 'customer' | 'admin' | 'product_manager';
  googleId?: string;
  picture?: string;
  profile: IUserProfile;
  walletBalance: number;
  walletHistory: IWalletTransaction[];
  createdAt: Date;
  updatedAt: Date;
}

const UserProfileSchema = new Schema<IUserProfile>({
  heightCm: { type: Number },
  weightKg: { type: Number },
  chestCm: { type: Number },
  waistCm: { type: Number },
  shoulderCm: { type: Number },
  preferredFit: { 
    type: String, 
    enum: ['tight', 'regular', 'relaxed', 'oversized'],
    default: 'regular'
  },
  usualSizes: { type: Map, of: String, default: {} },
  preferredBrands: [{ type: String }]
}, { _id: false });

const WalletTransactionSchema = new Schema<IWalletTransaction>({
  amount: { type: Number, required: true },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now }
}, { _id: true });

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String },
  role: { type: String, enum: ['customer', 'admin', 'product_manager'], default: 'customer' },
  googleId: { type: String, unique: true, sparse: true },
  picture: { type: String },
  profile: { type: UserProfileSchema, default: {} },
  walletBalance: { type: Number, default: 0 },
  walletHistory: { type: [WalletTransactionSchema], default: [] }
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', UserSchema);
