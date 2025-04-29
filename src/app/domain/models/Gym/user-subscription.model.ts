export enum PaymentStatus {
    Unknown = 0,
    Pending = 1,
    Completed = 2,
    Failed = 3,
    Refunded = 4,
}

export interface UserSubscriptionCreate {
    userId: string;
    gymId: number;
    planId: number;
    startDate: Date;
    expiresAt: Date;
    paymentStatus: PaymentStatus;

}

export interface UserSubscriptionUpdate {
    paymentStatus: PaymentStatus;
    startDate: Date;
    expiresAt: Date;
    isExpired: boolean;
}

export interface UserSubscriptionRead {
    id: number;
    userId: string;
    gymId: number;
    planId: number;
    purchaseDate: Date;
    paymentStatus: PaymentStatus;
    startDate: Date;
    expiresAt: Date;
    isExpired: boolean;
    qrCodeData: string;
    rawData: string;
  }