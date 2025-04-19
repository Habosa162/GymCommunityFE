import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../enviroment';

@Injectable({
  providedIn: 'root'
})
export class ClientInfoService {

  constructor(private http: HttpClient) { }

  private apiUrl = `${baseUrl}/ClientInfo`;

  changeClientCoverImg(file: File) {
    return this.http.get(`${this.apiUrl}/ChangeCoverImg`);
  }
}
