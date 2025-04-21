import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Coachrating } from '../../domain/models/CoachModels/coachrating.model';
import { baseUrl } from '../enviroment';

@Injectable({
  providedIn: 'root'
})
export class CoachratingService {

  private baseUrl = `${baseUrl}/CoachRating`;

  constructor(private http: HttpClient) { }

  getByCoachId(coachId: string): Observable<Coachrating[]> {
    return this.http.get<Coachrating[]>(`${this.baseUrl}/byCoach/${coachId}`);
  }

  addRating(rating: any): Observable<any> {
    return this.http.post(this.baseUrl, rating);
  }

  deleteRating(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
