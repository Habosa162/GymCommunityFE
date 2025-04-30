import { HttpClient } from '@angular/common/http';
import { ShippingDTO } from './../../domain/models/Ecommerce/shipping.model';
import { Injectable } from '@angular/core';
import { baseUrl } from '../enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {

  private readonly STORAGE_KEY = 'shippingInfo';

  apiUrl = `${baseUrl}/Shipping` ;
  constructor(private http:HttpClient) {}

  saveShipping(shipping: ShippingDTO): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(shipping));
  }

  getShipping(): ShippingDTO | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) as ShippingDTO : null;
  }
  updateShippingStatus(shippingId:number,status:string) : Observable<any>{
    return this.http.put(`${this.apiUrl}/${shippingId}`,{Status :status})
  }

  clearShipping(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
  getShippingStatusText(status: number): string {
    switch(status) {
      case 0 : return 'Pending';
      case 1 : return 'Shipped';
      case 2 : return 'Delivered';
      case 3 : return 'Cancelled';
      default: return 'Unokdkkd';
    }
  }

}
