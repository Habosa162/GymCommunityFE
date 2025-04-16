import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VoteReadDTO, VoteCreateDTO } from '../../domain/models/Forum/vote.model';

@Injectable({
  providedIn: 'root'
})
export class VoteService {

  private baseUrl = 'https://localhost:7130/api/Vote'; 

  constructor(private http: HttpClient) {}

  getAll(): Observable<VoteReadDTO[]> {
    return this.http.get<VoteReadDTO[]>(this.baseUrl);
  }

  getById(id: number): Observable<VoteReadDTO> {
    return this.http.get<VoteReadDTO>(`${this.baseUrl}/${id}`);
  }

  getByUser(userId: string): Observable<VoteReadDTO[]> {
    return this.http.get<VoteReadDTO[]>(`${this.baseUrl}/user/${userId}`);
  }

  getByPost(postId: number): Observable<VoteReadDTO[]> {
    return this.http.get<VoteReadDTO[]>(`${this.baseUrl}/post/${postId}`);
  }

  getByComment(commentId: number): Observable<VoteReadDTO[]> {
    return this.http.get<VoteReadDTO[]>(`${this.baseUrl}/comment/${commentId}`);
  }

  create(vote: VoteCreateDTO): Observable<VoteReadDTO> {
    return this.http.post<VoteReadDTO>(this.baseUrl, vote);
  }

  update(id: number, vote: VoteCreateDTO): Observable<VoteReadDTO> {
    return this.http.put<VoteReadDTO>(`${this.baseUrl}/${id}`, vote);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
