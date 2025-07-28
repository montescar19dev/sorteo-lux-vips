export interface Purchase {
  id: string;
  name: string;
  idType: 'V' | 'E';
  idNumber: string;
  phone: string;
  raffleTitle: string;
  ticketNumbers: string[];
  amount: number;
  reference: string;
  screenshot: string;
  status: 'pending' | 'verified' | 'rejected';
  createdAt: string;
}
