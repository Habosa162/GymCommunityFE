import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClientInfoService {

  constructor(private http: HttpClient) { }

  private baseUrl = 'http://localhost:5299/api/ClientInfo';

  changeClientCoverImg(file: File) {
    return this.http.get(`${this.baseUrl}/ChangeCoverImg`);
  }
}
