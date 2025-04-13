import { LoginRequest, RegisterRequest } from './../domain/models/auth.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private LoginEndPoint = `http://localhost:5299/api/Auth/login`;
  private RegisterEndPoint = `http://localhost:5299/api/Auth/register`;

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<any> {
    console.log(data);
    return this.http.post(this.LoginEndPoint, data);
  }
  register(data: RegisterRequest): Observable<any> {
    console.log(data);
    return this.http.post(this.RegisterEndPoint, data);
  }
}
