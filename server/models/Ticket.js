import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    raffleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Raffle",
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Índice único por rifa + número
ticketSchema.index({ raffleId: 1, number: 1 }, { unique: true });

export default mongoose.model("Ticket", ticketSchema);
