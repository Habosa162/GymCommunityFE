import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Coachworksample } from '../../../domain/models/CoachModels/coachworksample.model';
import { CoachworksampleService } from '../../../services/Coachservice/coachworksample.service';
import { AuthService } from '../../../services/auth.service';
import { CoachcertficateService } from '../../../services/Coachservice/coachcertficate.service';

@Component({
  selector: 'app-coach-work-samples',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './coach-work-samples.component.html',
  styleUrl: './coach-work-samples.component.css'
})
export class CoachWorkSamplesComponent implements OnInit {
  protofolioId!: number;
  workSamples: Coachworksample[] = [];
  selectedFile!: File;
  previewUrl: string | null = null;
  description: string = '';
  coachId!: string;
  loading = false;
  error: string | null = null;
  success: string | null = null;
  selectedWorkSample: Coachworksample | null = null;
  showModal = false;

  constructor(
    private workSampleService: CoachworksampleService,
    private route: ActivatedRoute,
    private authservice: AuthService,
    private certservice: CoachcertficateService
  ) { }

  ngOnInit(): void {
    this.coachId = this.authservice.getUserId() || this.route.snapshot.paramMap.get('coachId')!;
    if (this.coachId) {
      this.loadSamples();
    } else {
      this.error = 'Coach ID not found';
      console.error('Coach ID not found in token');
    }
  }

  loadSamples() {
    this.loading = true;
    this.error = null;
    this.certservice.getPortfolioIdByCoachId(this.coachId).subscribe({
      next: (res: any) => {
        this.protofolioId = res;
        this.workSampleService.getByPortfolioId(this.protofolioId).subscribe({
          next: (data) => {
            this.workSamples = data;
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Failed to load work samples';
            this.loading = false;
            console.error('Failed to load work samples:', err);
          }
        });
      },
      error: (err) => {
        this.error = 'You must create a portfolio before adding work samples';
        this.loading = false;
        console.error('Failed to get portfolio ID:', err);
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validate file type
      if (!file.type.match(/image\/(jpeg|png|jpg|gif)/)) {
        this.error = 'Please select a valid image file (JPEG, PNG, JPG, GIF)';
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.error = 'File size should not exceed 5MB';
        return;
      }

      this.selectedFile = file;
      this.error = null;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadSample() {
    if (!this.selectedFile || !this.description || !this.protofolioId) {
      this.error = 'Please fill all required fields';
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    const formData = new FormData();
    formData.append('worksampleimg', this.selectedFile);
    formData.append('Description', this.description);
    formData.append('PortfolioId', this.protofolioId.toString());

    this.workSampleService.create(formData).subscribe({
      next: () => {
        this.success = 'Work sample uploaded successfully!';
        this.loadSamples();
        this.description = '';
        this.selectedFile = undefined!;
        this.previewUrl = null;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to upload work sample';
        this.loading = false;
        console.error('Upload failed:', err);
      }
    });
  }

  deleteSample(id: any) {
    if (confirm('Are you sure you want to delete this work sample?')) {
      this.loading = true;
      this.error = null;
      this.success = null;

      this.workSampleService.delete(id).subscribe({
        next: () => {
          this.workSamples = this.workSamples.filter(s => s.id !== id);
          this.success = 'Work sample deleted successfully!';
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to delete work sample';
          this.loading = false;
          console.error('Error deleting work sample:', err);
        }
      });
    }
  }

  viewWorkSample(sample: Coachworksample) {
    this.selectedWorkSample = sample;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedWorkSample = null;
  }
}
