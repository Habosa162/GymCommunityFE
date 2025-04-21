import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Coachcertficate } from '../../domain/models/CoachModels/coachcertficate.model';
import { baseUrl } from '../enviroment';

@Injectable({
  providedIn: 'root'
})
export class CoachcertficateService {
  private baseUrl = `${baseUrl}/CoachCertificate`;

  constructor(private http: HttpClient) { }

  getByPortfolioId(portfolioId: any): Observable<Coachcertficate[]> {
    return this.http.get<Coachcertficate[]>(`${this.baseUrl}/byPortfolio/${portfolioId}`);
  }

  getPortfolioIdByCoachId(coachId: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/GetPortfolioIdByCoachId/${coachId}`);
  }
  // create(formData: FormData): Observable<any> {
  //   const token = localStorage.getItem('token');

  //   return this.http.post(`${this.baseUrl}/CoachCertificate/Create`, formData, {
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     }
  //   });
  // }
  create(formData: FormData) {
    return this.http.post(`${this.baseUrl}/create`, formData);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
