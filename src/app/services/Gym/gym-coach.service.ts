import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GymCoachCreateDTO, GymCoachDTO } from '../../domain/models/Gym/gym-coach.model';

@Injectable({
  providedIn: 'root'
})
export class GymCoachService {

  private baseUrl = 'https://localhost:7130/api/GymCoach';

  constructor(private http: HttpClient) {}

  createGymCoach(dto: GymCoachCreateDTO): Observable<GymCoachDTO> {
    return this.http.post<GymCoachDTO>(this.baseUrl, dto);
  }

  getAllGymCoaches(): Observable<GymCoachDTO[]> {
    return this.http.get<GymCoachDTO[]>(this.baseUrl);
  }

  getGymCoachById(id: number): Observable<GymCoachDTO> {
    return this.http.get<GymCoachDTO>(`${this.baseUrl}/${id}`);
  }

  updateGymCoach(id: number, dto: GymCoachCreateDTO): Observable<GymCoachDTO> {
    return this.http.put<GymCoachDTO>(`${this.baseUrl}/${id}`, dto);
  }

  deleteGymCoach(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getGymCoachesByGymId(gymId: number): Observable<GymCoachDTO[]> {
    return this.http.get<GymCoachDTO[]>(`${this.baseUrl}/gym/${gymId}`);
  }
}
