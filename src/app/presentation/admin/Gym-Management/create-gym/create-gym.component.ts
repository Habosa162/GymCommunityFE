import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  GymManagementService,
  GymUpdateDTO,
} from '../../../../services/admin/gym-management.service';

@Component({
  selector: 'app-create-gym',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container p-4">
      <div class="row">
        <div class="col-lg-8 mx-auto">
          <div class="card shadow">
            <div class="card-header bg-primary text-white">
              <h4 class="mb-0">Create New Gym</h4>
            </div>
            <div class="card-body">
              <form [formGroup]="gymForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="name" class="form-label">Gym Name</label>
                  <input
                    type="text"
                    class="form-control"
                    id="name"
                    formControlName="name"
                    [ngClass]="{ 'is-invalid': submitted && f['name'].errors }"
                  />
                  <div
                    class="invalid-feedback"
                    *ngIf="submitted && f['name'].errors"
                  >
                    <div *ngIf="f['name'].errors['required']">
                      Gym name is required
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="location" class="form-label">Location</label>
                  <input
                    type="text"
                    class="form-control"
                    id="location"
                    formControlName="location"
                    [ngClass]="{
                      'is-invalid': submitted && f['location'].errors
                    }"
                  />
                  <div
                    class="invalid-feedback"
                    *ngIf="submitted && f['location'].errors"
                  >
                    <div *ngIf="f['location'].errors['required']">
                      Location is required
                    </div>
                  </div>
                </div>

                <!-- Currently we don't handle image uploads in this form -->

                <div class="d-flex justify-content-between mt-4">
                  <a routerLink="/gym-management" class="btn btn-secondary">
                    <i class="bi bi-arrow-left me-2"></i>Back to List
                  </a>
                  <button
                    type="submit"
                    class="btn btn-primary"
                    [disabled]="isSubmitting"
                  >
                    <i class="bi bi-plus-circle me-2"></i>Create Gym
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .card {
        border-radius: 0.5rem;
        overflow: hidden;
      }

      .form-control:focus {
        box-shadow: none;
        border-color: var(--bs-primary);
      }

      .btn-primary {
        background-color: var(--bs-primary);
        border-color: var(--bs-primary);
      }

      .btn-secondary {
        background-color: #6c757d;
        border-color: #6c757d;
      }

      :host-context(body.dark-mode) .card {
        background-color: #222;
        color: white;
        border-color: #333;
      }

      :host-context(body.dark-mode) .form-control {
        background-color: #2a2a2a;
        color: white;
        border-color: #2a2a2a;
      }
    `,
  ],
})
export class CreateGymComponent {
  gymForm: FormGroup;
  isSubmitting: boolean = false;
  submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private gymService: GymManagementService,
    private toastr: ToastrService
  ) {
    this.gymForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      location: ['', [Validators.required]],
      ownerId: [''], // This would typically come from authentication service
    });
  }

  get f() {
    return this.gymForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.gymForm.invalid) {
      return;
    }

    this.isSubmitting = true;

    const gymData: GymUpdateDTO = {
      name: this.gymForm.value.name,
      location: this.gymForm.value.location,
      images: [],
    };

    // Note: The actual implementation would need to create a new gym
    // Since we don't have an endpoint for creating a gym, this is a placeholder
    this.toastr.info('This is a demo - no actual gym will be created');

    setTimeout(() => {
      this.toastr.success('Gym created successfully', 'Success');
      this.router.navigate(['/gym-management']);
    }, 1500);
  }
}
