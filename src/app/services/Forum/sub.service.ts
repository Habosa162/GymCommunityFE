import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sub } from '../../domain/models/Forum/sub.model';

@Injectable({
  providedIn: 'root'
})
export class SubService {

  private apiUrl = 'https://localhost:7130/api/Sub'; 

  constructor(private http: HttpClient) {}

  getAll(): Observable<Sub[]> {
    return this.http.get<Sub[]>(this.apiUrl);
  }

  getById(id: number): Observable<Sub> {
    return this.http.get<Sub>(`${this.apiUrl}/${id}`);
  }

  create(sub: Sub): Observable<Sub> {
    return this.http.post<Sub>(this.apiUrl, sub);
  }

  update(id: number, sub: Sub): Observable<Sub> {
    return this.http.put<Sub>(`${this.apiUrl}/${id}`, sub);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
