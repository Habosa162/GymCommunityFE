import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoachOfferService } from '../../../services/Coachservice/coach-offer.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { CoachOffer } from '../../../domain/models/CoachModels/coach-offer.model';

@Component({
  selector: 'app-coach-offers',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './coach-offers.component.html',
  styleUrl: './coach-offers.component.css'
})
export class CoachOffersComponent implements OnInit {
  offerForm: FormGroup;
  selectedImage?: File;
  previewUrl: string = '';
  offers: CoachOffer[] = [];
  coachId: string | null = null;
  editingOfferId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private offerService: CoachOfferService,
    private router: Router,
    private authService: AuthService
  ) {
    this.offerForm = this.fb.group({
      title: ['', Validators.required],
      desc: [''],
      price: [null, [Validators.required, Validators.min(0)]],
      durationMonths: [1, [Validators.required, Validators.min(1)]],
      image: [null]
    });
  }

  ngOnInit(): void {
    this.coachId = this.authService.getUserId();
    if (this.coachId) {
      this.loadOffers();
    }
  }

  loadOffers(): void {
    if (!this.coachId) return;
    this.offerService.getByCoachId(this.coachId).subscribe({
      next: (offers) => this.offers = offers || [],
      error: (err) => { this.offers = []; console.error(err); }
    });
  }

  deleteOffer(offerId: number): void {
    if (!confirm('Are you sure you want to delete this offer?')) return;
    this.offerService.delete(offerId).subscribe({
      next: () => {
        this.offers = this.offers.filter(o => o.id !== offerId);
      },
      error: (err) => alert('Failed to delete offer')
    });
  }

  startEditOffer(offer: CoachOffer): void {
    this.editingOfferId = offer.id || null;
    this.offerForm.patchValue({
      title: offer.title,
      desc: offer.desc,
      price: offer.price,
      durationMonths: offer.durationMonths
    });
    this.previewUrl = offer.imageUrl || '';
    this.selectedImage = undefined;
  }

  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.offerForm.invalid) return;

    const formData = new FormData();
    formData.append('Title', this.offerForm.get('title')?.value);
    formData.append('Desc', this.offerForm.get('desc')?.value || '');
    formData.append('Price', this.offerForm.get('price')?.value);
    formData.append('DurationMonths', this.offerForm.get('durationMonths')?.value);
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    if (this.editingOfferId) {
      // Update existing offer
      this.offerService.update(this.editingOfferId, formData).subscribe({
        next: () => {
          alert('Offer updated successfully');
          this.editingOfferId = null;
          this.offerForm.reset({ durationMonths: 1 });
          this.previewUrl = '';
          this.selectedImage = undefined;
          this.loadOffers();
        },
        error: err => {
          console.error(err);
          alert('Failed to update offer');
        }
      });
    } else {
      // Create new offer
      this.offerService.create(formData).subscribe({
        next: () => {
          alert('Offer added successfully');
          this.offerForm.reset({ durationMonths: 1 });
          this.previewUrl = '';
          this.selectedImage = undefined;
          this.loadOffers();
        },
        error: err => {
          console.error(err);
          alert('Failed to add offer');
        }
      });
    }
  }
}
