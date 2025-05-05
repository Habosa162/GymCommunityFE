import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthService,
} from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest } from './../domain/models/auth.model';
import { baseUrl } from './enviroment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private LoginEndPoint = `${baseUrl}/Auth/login`;
  private RegisterEndPoint = `${baseUrl}/Auth/Register`;
  private ForgotPasswordEndPoint = `${baseUrl}/Auth/ForgotPassword`;
  private ResetPasswordEndPoint = `${baseUrl}/Auth/ResetPassword`;

  // Observable to track authentication state changes
  public authStateChanged = new BehaviorSubject<boolean>(this.isLoggedIn());

  constructor(
    private http: HttpClient,
    private router: Router,
    private SocialAuthService: SocialAuthService
  ) {}

  login(data: LoginRequest): Observable<any> {
    console.log(data);
    return this.http.post(this.LoginEndPoint, data).pipe(
      tap((response: any) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          // Notify subscribers that auth state has changed
          this.authStateChanged.next(true);
        }
      })
    );
  }
  register(data: FormData): Observable<any> {
    console.log(data);
    return this.http.post(this.RegisterEndPoint, data).pipe(
      tap((response: any) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          // Notify subscribers that auth state has changed
          this.authStateChanged.next(true);
        }
      })
    );
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
  getNameFromToken(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.Name || null;
  }
  getToken(): string | null {
    // Try both storage keys for backwards compatibility
    const token = localStorage.getItem('token') || localStorage.getItem('jwt');
    if (!token) {
      console.log('No token found in localStorage');
    }
    return token;
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
  getUserRole(): string | null {
    const decoded = this.getDecodedToken();
    return decoded
      ? decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      : 'Client';
  }

  public getUserId(): string | null {
    const decoded = this.getDecodedToken();
    return decoded
      ? decoded[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
        ]
      : null;
  }
  getUserEmail(): string | null {
    const decoded = this.getDecodedToken();
    return decoded
      ? decoded[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
        ]
      : null;
  }

  getUserName(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.Name || null;
  }
  IsUserPremium(): boolean {
    const decoded = this.getDecodedToken();
    return decoded?.IsPremium === 'True' ? true : false;
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

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Notify subscribers that auth state has changed
    this.authStateChanged.next(false);
    this.router.navigate(['/login']);
  }

  loginWithGoogle() {
    this.SocialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      (user) => {
        console.log('Google ID Token:', user.idToken);
        this.externalLogin('Google', user.idToken);
      }
    );
  }
  loginWithFacebook() {
    this.SocialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then(
      (user) => {
        this.externalLogin('Facebook', user.authToken);
      }
    );
  }

  externalLogin(provider: string, token: string) {
    this.http
      .post('https://localhost:7130/api/auth/externallogin', {
        provider,
        idToken: token,
      })
      .subscribe(
        (res: any) => {
          // Store token in both locations for compatibility
          localStorage.setItem('jwt', res.token);
          localStorage.setItem('token', res.token);

          // Notify subscribers that auth state has changed
          this.authStateChanged.next(true);

          if (res.isNewUser) {
            this.router.navigate(['/choose-role']);
          } else {
            this.router.navigate(['/']);
          }
        },
        (error: any) => {
          console.error('External login failed:', error);
        }
      );
  }
}
