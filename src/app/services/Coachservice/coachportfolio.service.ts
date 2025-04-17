import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Coachportfolio } from '../../domain/models/CoachModels/coachportfolio.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoachportfolioService {

  private baseUrl = 'https://localhost:5299/api/CoachPortfolio';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Coachportfolio[]> {
    return this.http.get<Coachportfolio[]>(this.baseUrl);
  }

  getByCoachId(coachId: string): Observable<Coachportfolio> {
    return this.http.get<Coachportfolio>(`${this.baseUrl}/byCoach/${coachId}`);
  }

  addPortfolio(portfolio: Coachportfolio): Observable<any> {
    return this.http.post(this.baseUrl, portfolio);
  }

  updatePortfolio(id: number, portfolio: Coachportfolio): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, portfolio);
  }

  deletePortfolio(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
