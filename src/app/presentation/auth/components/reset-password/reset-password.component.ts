import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}
  ResetPassFrom!: FormGroup;
  submitted: boolean = false;
  message: string = '';
  isLoading: boolean = false;

  token: string = '';
  email: string = '';

  ngOnInit(): void {
    this.ResetPassFrom = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );

    const rawUrl = window.location.href;
    const url = new URL(rawUrl);
    this.token = url.searchParams.get('token') ?? '';
    this.email = url.searchParams.get('email') ?? '';

    console.log('Encoded Token (raw):', encodeURIComponent(this.token));
    console.log('Encoded Email:', this.email);
  }

  passwordMatchValidator(group: FormGroup): null | object {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    if (!password || !confirmPassword) return null;

    const mismatch = password.value !== confirmPassword.value;

    if (mismatch) {
      confirmPassword.setErrors({ ...confirmPassword.errors, mismatch: true });
    } else {
      const errors = confirmPassword.errors;
      if (errors) {
        delete errors['mismatch'];
        if (Object.keys(errors).length === 0) {
          confirmPassword.setErrors(null);
        } else {
          confirmPassword.setErrors(errors);
        }
      }
    }

    return null;
  }

  onSubmit() {
    this.submitted = true;

    if (this.ResetPassFrom.valid) {
      this.isLoading = true;
      const password = this.ResetPassFrom.value.password;
      const confirmPassword = this.ResetPassFrom.value.confirmPassword;
      this.authService
        .resetPassword(
          encodeURIComponent(this.token),
          encodeURIComponent(this.email),
          password,
          confirmPassword
        )
        .subscribe(
          (response) => {
            console.log(this.email, this.token, password, confirmPassword);
            console.log('Reset password successful', response);
            this.message = response.message;
            this.isLoading = false;
            this.ResetPassFrom.reset();
            this.submitted = false;
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          },
          (error) => {
            console.error('Reset password failed', error.error.message);
            console.log(this.email, this.token, password, confirmPassword);
            this.isLoading = false;
            this.message = error.error.message;
            this.ResetPassFrom.reset();
            this.submitted = false;
          }
        );
    }
  }
}
