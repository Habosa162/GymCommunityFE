import { HttpClient, provideHttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../enviroment';
import { Review } from '../../domain/models/Ecommerce/Review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${baseUrl}/Review`
  constructor(private http:HttpClient) { }

  getReviews(productId:number):Observable<any>{
      return this.http.get(`${this.apiUrl}/${productId}}`) ;
  }

  createReview(review : Review) : Observable<any>{
    return this.http.post(`${this.apiUrl}`, review);
  }
  deleteReview(reviewId:number):Observable<any>{
    return this.http.delete(`${this.apiUrl}/${reviewId}`) ;
  }
}
