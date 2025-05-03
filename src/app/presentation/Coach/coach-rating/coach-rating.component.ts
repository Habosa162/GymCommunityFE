import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CoachratingService } from '../../../services/Coachservice/coachrating.service';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-coach-rating',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './coach-rating.component.html',
  styleUrl: './coach-rating.component.css',
})
export class CoachRatingComponent implements OnInit {
  @Input() coachIdFromParent?: string;
  ratingForm!: FormGroup;
  clientId!: string;

  constructor(
    private fb: FormBuilder,
    private ratingService: CoachratingService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  @Input() showRateForm: boolean = false;
  @Output() showRateFormChange = new EventEmitter<boolean>();

  closeForm() {
    this.showRateFormChange.emit(false); // notify parent to hide form
  }

  ngOnInit(): void {
    this.clientId = this.authService.getUserId()!;
    console.log('coach ID:', this.coachIdFromParent);
    this.ratingForm = this.fb.group({
      rate: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.ratingForm.valid) {
      const ratingData = {
        coachId: this.coachIdFromParent,
        clientId: this.authService.getUserId(),
        rate: this.ratingForm.value.rate,
        comment: this.ratingForm.value.comment,
      };

      this.ratingService.addRating(ratingData).subscribe({
        next: () => {
          this.ratingForm.reset({ rate: 5, comment: '' });
          this.closeForm(); // close the form after submission
        },
        error: (err) => alert('Error: ' + err.message),
      });
    }
  }
  faces = ['😡', '😕', '🙂', '😃', '🤩'];
  selectedRate: number = 1;

  setRating(value: number) {
    this.selectedRate = value;
    this.ratingForm.get('rate')?.setValue(value);
  }
}
