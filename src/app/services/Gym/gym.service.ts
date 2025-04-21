import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GymReadDTO, GymCreateDTO } from '../../domain/models/Gym/gym.model';

@Injectable({
  providedIn: 'root'
})
export class GymService {
  private baseUrl = 'https://localhost:7130/api/Gym';

  constructor(private http: HttpClient) {}

  getAllGyms(): Observable<GymReadDTO[]> {
    return this.http.get<GymReadDTO[]>(`${this.baseUrl}`);
  }

  getGymById(id: number): Observable<GymReadDTO> {
    return this.http.get<GymReadDTO>(`${this.baseUrl}/${id}`);
  }

  createGym(gym: GymCreateDTO): Observable<GymReadDTO> {
    return this.http.post<GymReadDTO>(`${this.baseUrl}`, gym);
  }

  updateGym(id: number, gym: GymCreateDTO): Observable<GymReadDTO> {
    return this.http.put<GymReadDTO>(`${this.baseUrl}/${id}`, gym);
  }

  deleteGym(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getNearbyGyms(lat: number, lng: number, radiusInKm: number): Observable<GymReadDTO[]> {
    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lng', lng.toString())
      .set('radiusInKm', radiusInKm.toString());

    return this.http.get<GymReadDTO[]>(`${this.baseUrl}/nearby`, { params });
  }
}
