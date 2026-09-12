import mongoose, { Schema, Document } from 'mongoose';

export interface IPurchase extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  sizePurchased: string;
  priceAtPurchase: number;
  status: 'retained' | 'returned' | 'pending_feedback';
  shippingStatus: 'processing' | 'shipped' | 'delivered';
  recommendedSize: string;
  confidenceScore: number;
  returnRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: Date;
  updatedAt: Date;
}

const PurchaseSchema = new Schema<IPurchase>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  sizePurchased: { type: String, required: true },
  priceAtPurchase: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['retained', 'returned', 'pending_feedback'], 
    default: 'pending_feedback' 
  },
  shippingStatus: {
    type: String,
    enum: ['processing', 'shipped', 'delivered'],
    default: 'processing'
  },
  recommendedSize: { type: String, required: true },
  confidenceScore: { type: Number, required: true },
  returnRiskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], required: true }
}, { timestamps: true });

export const Purchase = mongoose.model<IPurchase>('Purchase', PurchaseSchema);
