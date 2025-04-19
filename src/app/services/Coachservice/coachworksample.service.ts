import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Coachworksample } from '../../domain/models/CoachModels/coachworksample.model';
import { baseUrl } from '../enviroment';

@Injectable({
  providedIn: 'root'
})
export class CoachworksampleService {
  private baseUrl = `${baseUrl}/WorkSample`;

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
