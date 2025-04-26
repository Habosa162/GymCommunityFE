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
}
