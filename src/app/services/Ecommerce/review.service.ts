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

  getReviews(productId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/${productId}`);
}

  // createReview(review : Review) : Observable<any>{
  //   return this.http.post(`${this.apiUrl}`, review);
  // }
  createReview(review: Review): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, review);
}
  deleteReview(reviewId:number):Observable<any>{
    return this.http.delete(`${this.apiUrl}/${reviewId}`) ;
  }
}
