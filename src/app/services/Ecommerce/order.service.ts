import { Injectable } from '@angular/core';
import { OrderRequestDTO } from '../../domain/models/Ecommerce/order.model';
import { HttpClient, HttpParams } from '@angular/common/http';
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
  getOneOrder(orderId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${orderId}`);
  }
  getUserOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`);
  }



  getAllOrders(
  query: string = '',
  page: number = 1,
  eleNo: number = 10,
  sort: string | null = null,
  status?: number | null,
  date?: Date | null
): Observable<any> {
  let params = new HttpParams()
    .set('query', query)
    .set('page', page.toString())
    .set('eleNo', eleNo.toString());
  if (sort) params = params.set('sort', sort);
  if (status !== null && status !== undefined) {
    params = params.set('status', status.toString());
  }
  if (date) {
    const formattedDate = date.toISOString().split('T')[0]; 
    params = params.set('date', formattedDate);
  }
    return this.http.get(`${this.apiUrl}/admin`, { params });
  }

}
