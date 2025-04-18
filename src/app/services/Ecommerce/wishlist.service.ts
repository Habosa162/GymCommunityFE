import { Injectable } from '@angular/core';
import { Product } from '../../domain/models/Ecommerce/product.model';
import { baseUrl } from '../enviroment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(private http: HttpClient,private auth : AuthService) { }

  private apiUrl = `${baseUrl}/wishlist`;

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    // 'Authorization': this.auth.getToken() // Assuming you have a method to get the token
  });

  private options = {
    headers: this.headers
  };

  addToWishlist(product: Product) : Observable<any> {
    return this.http.post<Product>(this.apiUrl, product, this.options) ;
  }
  removeFromWishlist(productId: number): Observable<any> {
    return this.http.delete<Product>(`${this.apiUrl}/${productId}`, this.options);
  }
  getWishlist(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl, this.options);
  }
}
