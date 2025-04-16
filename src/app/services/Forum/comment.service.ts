import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommentReadDTO, CommentCreateDTO } from '../../domain/models/Forum/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private baseUrl = 'https://localhost:7130/api/Comment'; 

  constructor(private http: HttpClient) {}

  getAll(): Observable<CommentReadDTO[]> {
    return this.http.get<CommentReadDTO[]>(this.baseUrl);
  }

  getById(id: number): Observable<CommentReadDTO> {
    return this.http.get<CommentReadDTO>(`${this.baseUrl}/${id}`);
  }

  getByUser(userId: string): Observable<CommentReadDTO[]> {
    return this.http.get<CommentReadDTO[]>(`${this.baseUrl}/user/${userId}`);
  }

  getByPost(postId: number): Observable<CommentReadDTO[]> {
    return this.http.get<CommentReadDTO[]>(`${this.baseUrl}/post/${postId}`);
  }

  create(comment: CommentCreateDTO): Observable<CommentReadDTO> {
    return this.http.post<CommentReadDTO>(this.baseUrl, comment);
  }

  update(id: number, comment: CommentCreateDTO): Observable<CommentReadDTO> {
    return this.http.put<CommentReadDTO>(`${this.baseUrl}/${id}`, comment);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
