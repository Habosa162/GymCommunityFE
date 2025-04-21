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
  upload(protofolioId: number, description: string, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('ProtofolioId', protofolioId.toString());
    formData.append('Description', description);
    formData.append('Image', image);
    return this.http.post(`${this.baseUrl}`, formData);
  }

  create(formData: FormData) {
    return this.http.post(this.baseUrl, formData);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
