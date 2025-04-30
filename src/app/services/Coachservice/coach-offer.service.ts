import { Injectable } from '@angular/core';
import { baseUrl } from '../enviroment';
import { Observable } from 'rxjs';
import { CoachOffer } from '../../domain/models/CoachModels/coach-offer.model';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CoachOfferService {

private baseUrl = `${baseUrl}/CoachOffers`;

constructor(private http: HttpClient) {}

  getAll(): Observable<CoachOffer[]> {
    return this.http.get<CoachOffer[]>(this.baseUrl);
  }

  getByCoachId(coachId: string): Observable<CoachOffer[]> {
    return this.http.get<CoachOffer[]>(`${this.baseUrl}/coach/${coachId}`);
  }

  create(formData: FormData): Observable<CoachOffer> {
    return this.http.post<CoachOffer>(this.baseUrl, formData);
  }

  update(id: number, formData: FormData): Observable<CoachOffer> {
    return this.http.put<CoachOffer>(`${this.baseUrl}/${id}`, formData);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
 
}
