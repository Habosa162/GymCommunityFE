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

@Component({
  selector: 'app-login',
  standalone: true,

  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  isLoading = false;
  errMgs: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

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
