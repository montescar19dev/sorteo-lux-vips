import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    raffleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Raffle',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    ticketCount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'transfer', 'cash'],
      required: true,
    },
    status: {
      type: String,
      enum: ['completed', 'pending', 'failed'],
      default: 'pending',
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Purchase', purchaseSchema);
