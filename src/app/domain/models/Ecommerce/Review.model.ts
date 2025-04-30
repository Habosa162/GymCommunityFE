export interface Review {
  id?: number; // Make optional for new reviews
  rating: number;
  comment: string;
  createdAt?: Date; // Made consistent casing
  productId: number;
  userId?: string;
  userName?: string | null;  // Allow null
  userAvatar?: string | null; // Allow null
}