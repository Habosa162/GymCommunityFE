import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Coachcertficate } from '../../domain/models/CoachModels/coachcertficate.model';

@Injectable({
  providedIn: 'root'
})
export class CoachcertficateService {
  private baseUrl = 'https://localhost:5299/api/CoachCertificate';

  constructor(private http: HttpClient) { }

  getByPortfolioId(portfolioId: number): Observable<Coachcertficate[]> {
    return this.http.get<Coachcertficate[]>(`${this.baseUrl}/byPortfolio/${portfolioId}`);
  }

  addCertificate(cert: Coachcertficate): Observable<any> {
    return this.http.post(this.baseUrl, cert);
  }

  deleteCertificate(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
