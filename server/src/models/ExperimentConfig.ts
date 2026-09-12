import mongoose, { Schema, Document } from 'mongoose';

export interface IExperimentConfig extends Document {
  _id: mongoose.Types.ObjectId;
  key: string;
  name: string;
  description: string;
  isEnabled: boolean;
  variant: string;
  weights: {
    bodyMeasurementsWeight: number;
    purchaseHistoryWeight: number;
    brandHistoryWeight: number;
    feedbackHistoryWeight: number;
  };
  updatedAt: Date;
}

const ExperimentConfigSchema = new Schema<IExperimentConfig>({
  key: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  isEnabled: { type: Boolean, default: true },
  variant: { type: String, default: 'variant_a' },
  weights: {
    bodyMeasurementsWeight: { type: Number, default: 0.40 },
    purchaseHistoryWeight: { type: Number, default: 0.35 },
    brandHistoryWeight: { type: Number, default: 0.15 },
    feedbackHistoryWeight: { type: Number, default: 0.10 }
  }
}, { timestamps: true });

export const ExperimentConfig = mongoose.model<IExperimentConfig>('ExperimentConfig', ExperimentConfigSchema);
