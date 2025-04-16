import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent implements OnInit {
  forgetPassForm!: FormGroup;
  submitted: boolean = false;
  message: string = '';
  isLoading: boolean = false;
  constructor(private fb: FormBuilder, private authService: AuthService) {}
  ngOnInit(): void {
    this.forgetPassForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.forgetPassForm.valid) {
      this.isLoading = true;
      const email = this.forgetPassForm.value.email;
      this.authService.forgotPassword(email).subscribe(
        (response) => {
          console.log('Forgot password successful', response);
          this.message = response.message;
          this.isLoading = false;
          this.forgetPassForm.reset();
          this.submitted = false;
        },
        (error) => {
          console.error('Forgot password failed', error.error.message);
          this.isLoading = false;
          this.message = error.error.message;
          this.forgetPassForm.reset();
          this.submitted = false;

          // Handle error (e.g., show a message to the user)
        }
      );
    }
  }
}
