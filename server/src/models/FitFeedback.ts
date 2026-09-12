import mongoose, { Schema, Document } from 'mongoose';

export type ReturnReason = 
  | 'too_small' 
  | 'too_large' 
  | 'tight_chest' 
  | 'loose_shoulder' 
  | 'too_long' 
  | 'too_short' 
  | 'uncomfortable_fabric' 
  | 'different_fit' 
  | 'other';

export interface IFitFeedback extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  purchaseId: mongoose.Types.ObjectId;
  size: string;
  status: 'kept' | 'returned';
  returnReason?: ReturnReason;
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FitFeedbackSchema = new Schema<IFitFeedback>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  purchaseId: { type: Schema.Types.ObjectId, ref: 'Purchase', required: true, index: true },
  size: { type: String, required: true },
  status: { type: String, enum: ['kept', 'returned'], required: true },
  returnReason: { 
    type: String, 
    enum: [
      'too_small', 
      'too_large', 
      'tight_chest', 
      'loose_shoulder', 
      'too_long', 
      'too_short', 
      'uncomfortable_fabric', 
      'different_fit', 
      'other'
    ] 
  },
  comments: { type: String }
}, { timestamps: true });

export const FitFeedback = mongoose.model<IFitFeedback>('FitFeedback', FitFeedbackSchema);
