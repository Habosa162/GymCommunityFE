export interface ShippingDTO {
  Carrier: string;
  TrackingNumber: string;
  CustomerName: string;
  PhoneNumber: string;
  Latitude: number;
  Longitude: number;
  EstimatedDeliveryDate: string | null;
  ShippingAddress: string;
}
