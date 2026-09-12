import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: { type: String, required: true },
  isAI: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

const ticketSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subject: { type: String, required: true },
  status: { type: String, enum: ['open', 'resolved', 'closed'], default: 'open' },
  messages: [messageSchema],
  feedbackScore: { type: Number, min: 1, max: 5 },
  feedbackText: { type: String }
}, { timestamps: true });

export const Ticket = mongoose.model('Ticket', ticketSchema);
