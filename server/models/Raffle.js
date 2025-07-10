import mongoose from 'mongoose';

const raffleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    ticketPrice: { type: Number, required: true },
    totalTickets: { type: Number, required: true },
    soldTickets: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'paused', 'ended'], default: 'active' },
    endDate: { type: Date, required: true },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

export default mongoose.model('Raffle', raffleSchema);
