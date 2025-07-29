export interface Purchase {
  _id: string;
  fullName: string;
  phoneNumber: string;
  raffleId: string | { _id: string; title: string };
  amount: number;
  status: 'pending' | 'verified' | 'rejected' | 'failed' | 'completed';
  transactionId: string;
  receiptUrl: string;
  ticketNumbers: string[];
  createdAt: string;
}
