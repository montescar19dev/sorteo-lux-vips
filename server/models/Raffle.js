import mongoose from "mongoose";

const raffleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    ticketPrice: { type: Number, required: true },
    totalTickets: { type: Number, required: true },
    endDate: { type: Date, required: true },
    description: { type: String },
    imageUrl: { type: String }, // URL de la imagen en Cloudinary
    ticketsSold: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["active", "paused", "ended"],
      default: "active",
    },
    winner: {
      type: String,
      default: null,
    },
    // ——————————— Añadido ———————————
    winnerImage: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Raffle", raffleSchema);
