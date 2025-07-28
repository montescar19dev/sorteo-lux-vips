import Purchase from "../models/Purchase.js";
import Ticket from "../models/Ticket.js";
import Raffle from "../models/Raffle.js";
import mongoose from "mongoose";
import cloudinary from "cloudinary";

// Config Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// -------- Helpers --------

// genera entero aleatorio en [0, maxExclusive)
const randInt = (maxExclusive) => Math.floor(Math.random() * maxExclusive);

// genera un número string padded con 'digits' dígitos
const formatNumber = (n, digits) => n.toString().padStart(digits, "0");

/**
 * Reserva 'qty' tickets únicos para una rifa, verificando límite total
 * - maxTickets: totalTickets de la rifa
 * - digits: cantidad de dígitos a usar para padStart
 * - usa índice único en Ticket y transacción
 */
async function reserveTicketsStrict(raffleId, qty, maxTickets, digits, session) {
  // 1) Cuántos están vendidos ya
  const sold = await Ticket.countDocuments({ raffleId }).session(session);
  const remaining = maxTickets - sold;

  if (qty > remaining) {
    throw new Error(`No hay suficientes números disponibles. Quedan ${remaining}.`);
  }

  const reserved = [];
  let attempts = 0;
  const MAX_ATTEMPTS = qty * 20; // margen por si hay colisiones

  while (reserved.length < qty && attempts < MAX_ATTEMPTS) {
    attempts++;

    const raw = randInt(maxTickets);                 // [0, maxTickets)
    const num = formatNumber(raw, digits);           // padded
    if (reserved.includes(num)) continue;            // evita duplicados locales

    try {
      await Ticket.create([{ raffleId, number: num }], { session });
      reserved.push(num);
    } catch (err) {
      if (err.code === 11000) {
        // ya existía en DB, intenta otro
        continue;
      }
      throw err;
    }
  }

  if (reserved.length < qty) {
    throw new Error("No fue posible asignar todos los números. Intenta de nuevo.");
  }

  return reserved;
}

// -------- Controller --------
export const createPurchase = async (req, res) => {
  console.log("🟩 req.body:", req.body);
  console.log("🟩 req.file:", req.file);
  console.log("🟩 req.files:", req.files);

  const {
    fullName,
    phoneNumber,
    raffleId,
    amount,
    ticketCount,
    paymentMethod,
    status,
    transactionId,
  } = req.body;

  const numAmount = Number(amount);
  const numTicketCount = Number(ticketCount);

  if (Number.isNaN(numAmount) || Number.isNaN(numTicketCount) || !transactionId) {
    return res.status(400).json({
      success: false,
      message: "Datos inválidos: amount/ticketCount/transactionId faltan o son inválidos",
    });
  }

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Falta el archivo del comprobante",
    });
  }

  // Imagen ya subida por multer-cloudinary
  const receiptUrl      = req.file.path;
  const receiptPublicId = req.file.filename;

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      // 0) Obtener la rifa
      const raffle = await Raffle.findById(raffleId).session(session);
      if (!raffle) {
        throw new Error("Rifa no encontrada");
      }
      if (raffle.status === "closed") {
        throw new Error("Esta rifa está cerrada");
      }

      // digits para pad: ej. totalTickets=60 => digits=2 (00-59)
      // totalTickets=1000 => digits=4 (0000-0999)
      const digits = String(raffle.totalTickets - 1).length;

      // 1) Reservar tickets únicos y NO exceder el total
      const ticketNumbers = await reserveTicketsStrict(
        raffleId,
        numTicketCount,
        raffle.totalTickets,
        digits,
        session
      );

      // 2) Crear purchase
      const newPurchase = new Purchase({
        fullName,
        phoneNumber,
        raffleId,
        ticketCount: numTicketCount,
        amount: numAmount,
        paymentMethod,
        status: status || "pending",
        transactionId,
        receiptUrl,
        receiptPublicId,
        ticketNumbers,
      });
      await newPurchase.save({ session });

      // 3) Actualizar contador vendidas en Raffle
      raffle.ticketsSold += numTicketCount;
      // opcional: cerrar si se vendió todo
      if (raffle.ticketsSold >= raffle.totalTickets) {
        raffle.status = "closed";
      }
      await raffle.save({ session });

      // 4) Responder
      res.status(201).json({ success: true, data: newPurchase });
    });
  } catch (error) {
    console.error("Error al registrar compra:", error);

    if (error.code === 11000 && error.keyPattern?.transactionId) {
      return res.status(409).json({
        success: false,
        message: "El número de referencia ya fue usado. Verifica e intenta de nuevo.",
      });
    }

    return res
      .status(500)
      .json({ success: false, message: error.message || "Error al registrar compra" });
  } finally {
    session.endSession();
  }
};
