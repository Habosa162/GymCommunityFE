import { Injectable } from '@angular/core';
import { OrderRequestDTO } from '../../domain/models/Ecommerce/order.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { baseUrl } from '../enviroment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${baseUrl}/Order`;

  constructor(private http: HttpClient) {}
  createOrder(orderDto: OrderRequestDTO):Observable<any> {
    return this.http.post(this.apiUrl, orderDto);
  }

}
