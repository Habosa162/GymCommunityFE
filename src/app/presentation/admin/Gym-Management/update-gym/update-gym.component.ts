import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  GymManagementService,
  GymReadDTO,
  GymUpdateDTO,
} from '../../../../services/Admin/gym-management.service';

@Component({
  selector: 'app-update-gym',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container p-4">
      <div class="row">
        <div class="col-lg-8 mx-auto">
          <div class="card shadow">
            <div class="card-header bg-primary text-white">
              <h4 class="mb-0">Update Gym</h4>
            </div>
            <div class="card-body">
              <form
                [formGroup]="gymForm"
                (ngSubmit)="onSubmit()"
                *ngIf="!isLoading"
              >
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

                <!-- Currently we don't handle image updates in this form -->

                <div class="d-flex justify-content-between mt-4">
                  <a routerLink="/gym-management" class="btn btn-secondary">
                    <i class="bi bi-arrow-left me-2"></i>Back to List
                  </a>
                  <button
                    type="submit"
                    class="btn btn-primary"
                    [disabled]="isSubmitting"
                  >
                    <i class="bi bi-save me-2"></i>Save Changes
                  </button>
                </div>
              </form>

              <!-- Loading state -->
              <div *ngIf="isLoading" class="text-center p-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Loading gym data...</p>
              </div>
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
export class UpdateGymComponent implements OnInit {
  gymForm!: FormGroup;
  isLoading: boolean = true;
  isSubmitting: boolean = false;
  submitted: boolean = false;
  gymId!: number;
  currentGym?: GymReadDTO;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private gymService: GymManagementService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.gymForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      location: ['', [Validators.required]],
    });

    this.route.params.subscribe((params) => {
      this.gymId = +params['id']; // Convert string to number
      this.loadGymData();
    });
  }

  get f() {
    return this.gymForm.controls;
  }

  loadGymData(): void {
    this.isLoading = true;
    this.gymService.getAllGyms().subscribe(
      (gyms) => {
        const gym = gyms.find((g) => g.id === this.gymId);
        if (gym) {
          this.currentGym = gym;
          this.gymForm.patchValue({
            name: gym.name,
            location: gym.location,
          });
        } else {
          this.toastr.error('Gym not found', 'Error');
          this.router.navigate(['/gym-management']);
        }
        this.isLoading = false;
      },
      (error) => {
        this.toastr.error('Failed to load gym data', 'Error');
        this.isLoading = false;
      }
    );
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
      images: this.currentGym?.images || [],
    };

    this.gymService.updateGym(this.gymId, gymData).subscribe(
      () => {
        this.toastr.success('Gym updated successfully', 'Success');
        this.router.navigate(['/gym-management']);
      },
      (error) => {
        this.toastr.error('Failed to update gym', 'Error');
        this.isSubmitting = false;
      }
    );
  }
}
