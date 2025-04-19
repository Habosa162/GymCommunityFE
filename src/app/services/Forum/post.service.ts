import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostReadDTO, PostCreateDTO } from '../../domain/models/Forum/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private baseUrl = 'https://localhost:7130/api/Post'; 

  constructor(private http: HttpClient) {}

  getAll(): Observable<PostReadDTO[]> {
    return this.http.get<PostReadDTO[]>(this.baseUrl);
  }

  getById(id: number): Observable<PostReadDTO> {
    return this.http.get<PostReadDTO>(`${this.baseUrl}/${id}`);
  }

  getByUser(userId: string): Observable<PostReadDTO[]> {
    return this.http.get<PostReadDTO[]>(`${this.baseUrl}/user/${userId}`);
  }

  getBySub(subId: number): Observable<PostReadDTO[]> {
    return this.http.get<PostReadDTO[]>(`${this.baseUrl}/sub/${subId}`);
  }

  create(post: PostCreateDTO, image?: File): Observable<PostReadDTO> {
    const formData = new FormData();
    formData.append('title', post.title);
    formData.append('content', post.content);
    formData.append('userId', post.userId);
    formData.append('subId', post.subId.toString());
    if (image) {
      formData.append('image', image);
    }

    return this.http.post<PostReadDTO>(this.baseUrl, formData);
  }

  update(id: number, post: PostCreateDTO, image?: File): Observable<PostReadDTO> {
    const formData = new FormData();
    formData.append('title', post.title);
    formData.append('content', post.content);
    formData.append('userId', post.userId);
    formData.append('subId', post.subId.toString());
  
    // Only append new image if there is one
    if (image) {
      formData.append('image', image);
    }
  
    return this.http.put<PostReadDTO>(`${this.baseUrl}/${id}`, formData);
  }
  
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  getTopRated(): Observable<PostReadDTO[]> {
    return this.http.get<PostReadDTO[]>(`${this.baseUrl}/topRated`);
  }
  getCurrentUserId(): Observable<any> {
    return this.http.get(`${this.baseUrl}/currentUserId`);
  }
}
