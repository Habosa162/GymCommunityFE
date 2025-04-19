import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Coachworksample } from '../../domain/models/CoachModels/coachworksample.model';

@Injectable({
  providedIn: 'root'
})
export class CoachworksampleService {
  private baseUrl = 'https://localhost:7130/api/WorkSample';

  constructor(private http: HttpClient) { }

  getByPortfolioId(portfolioId: number): Observable<Coachworksample[]> {
    return this.http.get<Coachworksample[]>(`${this.baseUrl}/byPortfolio/${portfolioId}`);
  }

  addSample(sample: Coachworksample): Observable<any> {
    return this.http.post(this.baseUrl, sample);
  }

  deleteSample(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
