import { LoginRequest, RegisterRequest } from './../domain/models/auth.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private LoginEndPoint = `http://localhost:5299/api/Auth/login`;
  private RegisterEndPoint = `http://localhost:5299/api/Auth/Register`;
  private ForgotPasswordEndPoint = `http://localhost:5299/api/Auth/ForgotPassword`;
  private ResetPasswordEndPoint = `http://localhost:5299/api/Auth/ResetPassword`;

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<any> {
    console.log(data);
    return this.http.post(this.LoginEndPoint, data);
  }
  register(data: FormData): Observable<any> {
    console.log(data);
    return this.http.post(this.RegisterEndPoint, data);
  }
  forgotPassword(email: string): Observable<any> {
    const body = { email };
    return this.http.post(this.ForgotPasswordEndPoint, body);
  }
  resetPassword(
    token: string,
    email: string,
    newPassword: string,
    confirmPassword: string
  ): Observable<any> {
    const body = { Password: newPassword, RePassword: confirmPassword };
    return this.http.post(
      `${this.ResetPasswordEndPoint}?token=${token}&email=${email}`,
      body
    );
  }
}
