import { ShippingDTO } from './shipping.model';
import { OrderItemDTO } from './orderItem.model';

export interface OrderRequestDTO {
  PaymentId: number;
  OrderItems: OrderItemDTO[];
  Shipping: ShippingDTO;
}
