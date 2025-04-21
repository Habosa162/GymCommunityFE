import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GymImgReadDTO, GymImgCreateDTO } from '../../domain/models/Gym/gym-img.model';

@Injectable({
  providedIn: 'root'
})
export class GymImgService {

  private baseUrl = 'https://localhost:7130/api/GymImgs';

  constructor(private http: HttpClient) {}

  getAll(): Observable<GymImgReadDTO[]> {
    return this.http.get<GymImgReadDTO[]>(`${this.baseUrl}`);
  }

  getById(id: number): Observable<GymImgReadDTO> {
    return this.http.get<GymImgReadDTO>(`${this.baseUrl}/${id}`);
  }

  getByGymId(gymId: number): Observable<GymImgReadDTO[]> {
    return this.http.get<GymImgReadDTO[]>(`${this.baseUrl}/gym/${gymId}`);
  }

  create(dto: GymImgCreateDTO, imageFile?: File): Observable<GymImgReadDTO> {
    const formData = new FormData();
    formData.append('gymId', dto.gymId.toString());
    if (imageFile) {
      formData.append('image', imageFile);
    }
    return this.http.post<GymImgReadDTO>(this.baseUrl, formData);
  }

  update(id: number, dto: GymImgCreateDTO, imageFile?: File): Observable<GymImgReadDTO> {
    const formData = new FormData();
    formData.append('gymId', dto.gymId.toString());
    if (dto.imageUrl) {
      formData.append('imageUrl', dto.imageUrl);
    }
    if (imageFile) {
      formData.append('image', imageFile);
    }
    return this.http.put<GymImgReadDTO>(`${this.baseUrl}/${id}`, formData);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
