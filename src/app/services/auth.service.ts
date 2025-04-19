import { LoginRequest, RegisterRequest } from './../domain/models/auth.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private LoginEndPoint = `http://localhost:5299/api/Auth/login`;
  private RegisterEndPoint = `http://localhost:5299/api/Auth/Register`;
  private ForgotPasswordEndPoint = `http://localhost:5299/api/Auth/ForgotPassword`;
  private ResetPasswordEndPoint = `http://localhost:5299/api/Auth/ResetPassword`;

  constructor(private http: HttpClient) { }

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

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ✅ Decode token
  getDecodedToken(): any {
    const token = this.getToken();
    if (token) {
      try {
        return jwtDecode(token);
      } catch (e) {
        console.error('Invalid token');
      }
    }
    return null;
  }

  // ✅ Get CoachId from decoded token (assumes it's stored under 'coachId')
  getCoachId(): string | null {
    const decoded = this.getDecodedToken();

    // Extract using the full claim URI
    return decoded
      ? decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
      : null;
  }


}
