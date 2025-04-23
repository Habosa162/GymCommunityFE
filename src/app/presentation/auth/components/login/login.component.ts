import { AuthService } from './../../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginRequest } from '../../../../domain/models/auth.model';
import { CartService } from '../../../../services/Ecommerce/cart.service';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,

  imports: [ReactiveFormsModule, CommonModule, RouterModule, GoogleSigninButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  isLoading = false;
  errMgs: string = '';
  isGoogleLoading = false;
  

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cartService:CartService,
    private http: HttpClient
  ) {}
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

        google.accounts.id.initialize({
      client_id: '542482302983-oeddeor9j8rirdjnf99oe2um6sucgi58.apps.googleusercontent.com', // 🔁 Replace with your real client ID
      callback: (response: any) => this.handleCredentialResponse(response)
    });

    google.accounts.id.renderButton(
      document.getElementById("googleBtn"),
        {
    theme: "outline", // "outline", "filled_blue", or "filled_black"
    size: "large",         // "small", "medium", "large"
    text: "signin_with",   // "signin_with", "signup_with", "continue_with", or "signup"
    shape: "pill",         // "rectangular" or "pill"
    logo_alignment: "center",// "left" or "center"
    width: 300             // in pixels
  }
    );
  }

    handleCredentialResponse(response: any): void {
    this.isGoogleLoading = true;
    const idToken = response.credential;
    this.http.post('https://localhost:7130/api/Auth/externallogin', {
      provider: 'Google',
      idToken
    }).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        console.log('Login success', res);
        this.isGoogleLoading = false;
        if(res.isNewUser){
          this.router.navigate(['/Choose-role']);
        }
        else{
          this.router.navigate(['/']);
        }
        // optionally navigate or set user state
      },
      error: (err) => {
        console.error('Login failed', err);
        this.isGoogleLoading = false;
      }
    });
  }
  // //login with google
  // loginWithGoogle() {
  //   this.authService.loginWithGoogle();
  // }
  // //login with facebook
  // loginWithFacebook() {
  //   this.authService.loginWithFacebook();
  // }


  
  onSubmit() {
    this.submitted = true;
    if (this.loginForm.valid) {
      const userObj: LoginRequest = {
        Email: this.loginForm.value.email,
        Password: this.loginForm.value.password,
      };
      this.isLoading = true;
      this.authService.login(userObj).subscribe(
        (response) => {
          console.log('Login successful', response);
          localStorage.setItem('token', response.token);
          this.isLoading = false;
          this.router.navigate(['/']);
          this.cartService.setUser(this.authService.getUserId());
        },
        (error) => {
          console.error('Login failed', error.error.message);
          // Handle error (e.g., show a message to the user)
          this.errMgs = error.error.message;
          this.isLoading = false;
          this.loginForm.reset();
          this.submitted = false;
        }
      );
    }
  }
}
