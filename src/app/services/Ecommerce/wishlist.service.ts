import { Injectable } from '@angular/core';
import { Product } from '../../domain/models/Ecommerce/product.model';
import { baseUrl } from '../enviroment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { wishlistItem } from '../../domain/models/Ecommerce/wishList.model';
@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(private http: HttpClient, private auth: AuthService) { }

  private apiUrl = `${baseUrl}/WishList`;

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.auth.getToken() ? `Bearer ${this.auth.getToken()}` : ''
    });
  }

  addToWishlist(productID: number): Observable<any> {
    return this.http.post<any>(this.apiUrl, productID, { headers: this.getHeaders() });
  }

  removeFromWishlist(productId: number): Observable<any> {
    console.log(productId); 
    return this.http.delete<any>(`${this.apiUrl}/${productId}`, { headers: this.getHeaders() });
  }

  getWishlist(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }
}
