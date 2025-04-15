import { AuthService } from './../../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { RegisterRequest } from '../../../../domain/models/auth.model';
import { MatRadioModule } from '@angular/material/radio';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [
    CommonModule,
    // BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  mainForm: FormGroup;
  selectedImage: string | ArrayBuffer | null = null;
  selectedFile!: File;
  @ViewChild('stepper') stepper!: MatStepper;
  emailError: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.mainForm = this.fb.group({
      step1: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        gender: ['', Validators.required],
        address: ['', Validators.required],
        birthDate: ['', Validators.required],
        phone: ['', Validators.required],
      }),
      step2: this.fb.group(
        {
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required, Validators.minLength(6)]],
          confirmPassword: ['', Validators.required],
        },
        { validators: this.passwordMatchValidator }
      ),
      step3: this.fb.group({
        role: ['', Validators.required],
      }),
      step4: this.fb.group({
        image: [null, Validators.required],
      }),
    });
  }

  //password match
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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.step4.get('image')?.setValue(file);
      const reader = new FileReader();
      reader.onload = (e) => (this.selectedImage = reader.result);
      reader.readAsDataURL(file);
      this.selectedFile = file;
    }
  }

  get step1() {
    return this.mainForm.get('step1') as FormGroup;
  }

  get step2() {
    return this.mainForm.get('step2') as FormGroup;
  }

  get step3() {
    return this.mainForm.get('step3') as FormGroup;
  }

  get step4() {
    return this.mainForm.get('step4') as FormGroup;
  }

  //calling api

  // submit() {
  //   if (this.mainForm.valid) {
  //     const formData = new FormData();

  //     const birthDate = new Date(this.step1.value.birthDate)
  //       .toISOString()
  //       .split('T')[0];

  //     formData.append('FirstName', this.mainForm.value.step1.firstName);
  //     formData.append('LastName', this.mainForm.get('step1')?.value.lastName);
  //     formData.append('Address', this.step1.value.address);
  //     formData.append('Phone', this.step1.value.phone);
  //     formData.append('BirthDate', birthDate);
  //     formData.append('Gender', this.step1.value.gender);
  //     formData.append('Email', this.step2.value.email);
  //     formData.append('Password', this.step2.value.password);
  //     formData.append('Role', this.step3.value.role);
  //     formData.append('profileImg', this.selectedFile); // Append the image file
  //     for (const [key, value] of formData.entries()) {
  //       console.log(`${key}:`, value);
  //     }
  //     this.authService.register(formData).subscribe({
  //       next: (response) => {
  //         console.log('Registration successful', response);
  //         // localStorage.setItem('token', response.token);
  //         this.router.navigate(['/login']);
  //       },
  //       error: (error) => {
  //         console.error('Registration failed', error.error.message);
  //         // Handle error (e.g., show a message to the user)
  //         alert(error.error.message);
  //         // this.mainForm.reset();
  //       },
  //     });
  //   }

  //   console.log(this.mainForm.value);
  //   alert('Form Submitted!');
  // }

  submit() {
    if (this.mainForm.valid) {
      const formData = new FormData();

      const birthDate = new Date(this.step1.value.birthDate)
        .toISOString()
        .split('T')[0];

      formData.append('FirstName', this.step1.value.firstName);
      formData.append('LastName', this.step1.value.lastName);
      formData.append('Address', this.step1.value.address);
      formData.append('Phone', this.step1.value.phone);
      formData.append('BirthDate', birthDate);
      formData.append('Email', this.step2.value.email);
      formData.append('Password', this.step2.value.password);
      formData.append('Role', this.step3.value.role);
      formData.append('profileImg', this.step4.value.image);
      formData.append('Gender', 'm');

      // Debug: log each formData entry
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      this.authService.register(formData).subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Registration failed', error);

          if (error.error.message == 'Email already exists') {
            this.emailError = error.error.message;
            this.stepper.selectedIndex = 1;
          }

          if (error.error && error.error.errors) {
            for (const key in error.error.errors) {
              console.error(`${key}: ${error.error.errors[key]}`);
            }
          }
        },
      });
    }
  }

  //remove img
  removeImage(): void {
    this.selectedImage = null;
    const input = document.getElementById('fileInput') as HTMLInputElement;
    if (input) {
      input.value = ''; // Clear the input value
    }
  }
}
