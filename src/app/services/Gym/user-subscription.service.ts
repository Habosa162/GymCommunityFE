import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserSubscriptionRead, UserSubscriptionCreate, UserSubscriptionUpdate } from '../../domain/models/Gym/user-subscription.model';

@Injectable({
  providedIn: 'root'
})
export class UserSubscriptionService {

  private apiUrl = 'https://localhost:7130/api/UserSubscription'; 

  constructor(private http: HttpClient) {}

  getAll(): Observable<UserSubscriptionRead[]> {
    return this.http.get<UserSubscriptionRead[]>(`${this.apiUrl}`);
  }

  getById(id: number): Observable<UserSubscriptionRead> {
    return this.http.get<UserSubscriptionRead>(`${this.apiUrl}/${id}`);
  }

  getByUserId(userId: string): Observable<UserSubscriptionRead[]> {
    return this.http.get<UserSubscriptionRead[]>(`${this.apiUrl}/user/${userId}`);
  }

  getByGymId(gymId: number): Observable<UserSubscriptionRead[]> {
    return this.http.get<UserSubscriptionRead[]>(`${this.apiUrl}/gym/${gymId}`);
  }

  getByPlanId(planId: number): Observable<UserSubscriptionRead[]> {
    return this.http.get<UserSubscriptionRead[]>(`${this.apiUrl}/plan/${planId}`);
  }

  getByOwnerId(ownerId: string): Observable<UserSubscriptionRead[]>{
    return this.http.get<UserSubscriptionRead[]>(`${this.apiUrl}/ownerId/${ownerId}`);

  }

  create(sub: UserSubscriptionCreate): Observable<UserSubscriptionRead> {
    return this.http.post<UserSubscriptionRead>(`${this.apiUrl}`, sub);
  }

  update(id: number, sub: UserSubscriptionUpdate): Observable<UserSubscriptionRead> {
    return this.http.put<UserSubscriptionRead>(`${this.apiUrl}?id=${id}`, sub);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  validateQrCode(qrCodeData: string): Observable<UserSubscriptionRead> {
    return this.http.get<UserSubscriptionRead>(`${this.apiUrl}/validate/${qrCodeData}`);
  }
}
