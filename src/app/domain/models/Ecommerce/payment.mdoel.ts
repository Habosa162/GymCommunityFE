export interface PaymentDTO{
  id?: number;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: number; // The status of the payment (e.g., 0 for pending, 1 for completed, 2 for failed)
  createdAt: string;
  updatedAt: string;
}

