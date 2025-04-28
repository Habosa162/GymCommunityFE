import { ShippingDTO } from './../../domain/models/Ecommerce/shipping.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {

  private readonly STORAGE_KEY = 'shippingInfo';

  constructor() {}

  saveShipping(shipping: ShippingDTO): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(shipping));
  }

  getShipping(): ShippingDTO | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) as ShippingDTO : null;
  }

  clearShipping(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
  getShippingStatusText(status: number): string {
    switch(status) {
      case 0: return 'Pending';
      case 1: return 'Shipped';
      case 2: return 'Delivered';
      case 3: return 'Cancelled';
      default: return 'Unknown';
    }
  }

}
