import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientInfoService {
  constructor(private http: HttpClient) {}

  private apiUrl = `${baseUrl}/ClientInfo`;

  changeCoverImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('img', file);
    return this.http.post(`${this.apiUrl}/ChangeCoverImg`, formData);
  }
}
