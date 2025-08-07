export interface Raffle {
  _id: string;
  title: string;
  description: string;
  ticketPrice: number;
  totalTickets?: number;
  ticketsSold?: number;
  minTicketsPerUser: number;
  status: "active" | "paused" | "ended";
  endDate: string;
  imageUrl?: string;
  winner?: string;
  winnerImage?: string;
  createdAt?: string;
}