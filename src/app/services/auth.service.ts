import { LoginRequest, RegisterRequest } from './../domain/models/auth.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { baseUrl } from './enviroment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private LoginEndPoint = `${baseUrl}/Auth/login`;
  private RegisterEndPoint = `${baseUrl}/Auth/Register`;
  private ForgotPasswordEndPoint = `${baseUrl}/Auth/ForgotPassword`;
  private ResetPasswordEndPoint = `${baseUrl}/Auth/ResetPassword`;

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
  getUserRole():string | null{
    const decoded = this.getDecodedToken();
    return decoded
      ? decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      : null;
  }

  getUserId(): string | null {
    const decoded = this.getDecodedToken();
    return decoded
      ? decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
      : null;
  }
  getUserEmail(): string | null {
    const decoded = this.getDecodedToken();
    return decoded
      ? decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']
      : null;
  }
  
  getUserName(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.Name || null;
  }
  
  getProfileImg(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.ProfileImg || null;
  }

isLoggedIn(): boolean {
  const token = this.getToken();
  if (!token) return false;

  const decodedToken = this.getDecodedToken();
  if (!decodedToken || !decodedToken.exp) return false;

  const expirationDate = new Date(decodedToken.exp * 1000);
  return expirationDate > new Date();
}

}
