import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface GymImgDTO {
  id: number;
  imageUrl: string;
}

export interface GymReadDTO {
  id: number;
  name: string;
  location: string;
  ownerId: string;
  images: GymImgDTO[];
}

export interface GymUpdateDTO {
  name: string;
  location: string;
  images: GymImgDTO[];
}

@Injectable({
  providedIn: 'root',
})
export class GymManagementService {
  private baseUrl = 'https://localhost:7130/api/Gym'; // Hardcoded URL (will be changed later)

  constructor(private http: HttpClient) {}

  getAllGyms(): Observable<GymReadDTO[]> {
    return this.http.get<GymReadDTO[]>(`${this.baseUrl}/all`);
  }

  updateGym(id: number, gymData: GymUpdateDTO): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/edit/${id}`, gymData);
  }

  deleteGym(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/delete/${id}`);
  }
}
