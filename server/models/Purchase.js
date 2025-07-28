import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    raffleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Raffle",
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
      enum: ["card", "transfer", "cash"],
      required: true,
    },
    status: {
      type: String,
      enum: ["completed", "pending", "failed"],
      default: "pending",
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    ticketNumbers: {
      type: [String],
      default: [],
    },
    receiptUrl: {
      type: String,
    },
    receiptPublicId: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Purchase", purchaseSchema);
