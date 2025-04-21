import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GymPlanCreate, GymPlanRead } from '../../domain/models/Gym/gym-plan.model';

@Injectable({
  providedIn: 'root'
})
export class GymPlanService {

  private apiUrl = 'https://localhost:7130/api/GymPlan'; 

  constructor(private http: HttpClient) {}

  create(plan: GymPlanCreate): Observable<GymPlanRead> {
    return this.http.post<GymPlanRead>(`${this.apiUrl}`, plan);
  }

  getAll(): Observable<GymPlanRead[]> {
    return this.http.get<GymPlanRead[]>(`${this.apiUrl}`);
  }

  getById(id: number): Observable<GymPlanRead> {
    return this.http.get<GymPlanRead>(`${this.apiUrl}/${id}`);
  }

  getByGymId(gymId: number): Observable<GymPlanRead[]> {
    return this.http.get<GymPlanRead[]>(`${this.apiUrl}/gym/${gymId}`);
  }

  update(id: number, plan: GymPlanCreate): Observable<GymPlanRead> {
    return this.http.put<GymPlanRead>(`${this.apiUrl}/${id}`, plan);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
