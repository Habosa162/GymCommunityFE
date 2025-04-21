import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Coachportfolio } from '../../domain/models/CoachModels/coachportfolio.model';
import { Observable } from 'rxjs';
import { baseUrl } from '../enviroment';

@Injectable({
  providedIn: 'root'
})
export class CoachportfolioService {

  private baseUrl = `${baseUrl}/CoachPortfolio`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Coachportfolio[]> {
    return this.http.get<Coachportfolio[]>(this.baseUrl);
  }

  getById(id: number) {
    return this.http.get<Coachportfolio>(`${this.baseUrl}/${id}`);
  }

  getByCoachId(coachId: string): Observable<any> {
    return this.http.get<Coachportfolio>(`${this.baseUrl}/byCoach/${coachId}`);
  }

  create(formData: FormData) {
    return this.http.post(this.baseUrl, formData);
  }

  update(id: number, formData: FormData) {
    return this.http.put(`${this.baseUrl}/${id}`, formData);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
