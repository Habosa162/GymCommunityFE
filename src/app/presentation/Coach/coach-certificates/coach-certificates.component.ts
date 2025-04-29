import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Coachcertficate } from '../../../domain/models/CoachModels/coachcertficate.model';
import { CoachcertficateService } from '../../../services/Coachservice/coachcertficate.service';
import { AuthService } from '../../../services/auth.service';
import { CoachportfolioService } from '../../../services/Coachservice/coachportfolio.service';
import { Coachportfolio } from '../../../domain/models/CoachModels/coachportfolio.model';

@Component({
  selector: 'app-coach-certificates',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './coach-certificates.component.html',
  styleUrl: './coach-certificates.component.css'
})
export class CoachCertificatesComponent implements OnInit {
  protofolioId!: number;
  certificates: Coachcertficate[] = [];
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  coachId!: string;
  portfolio!: Coachportfolio;
  loading = false;
  error: string | null = null;
  success: string | null = null;
  selectedCertificate: Coachcertficate | null = null;
  showModal = false;

  constructor(
    private certService: CoachcertficateService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private portfolioService: CoachportfolioService
  ) { }

  ngOnInit(): void {
    this.coachId = this.authService.getUserId() || this.route.snapshot.paramMap.get('coachId')!;
    if (this.coachId) {
      this.loadCertificates();
    } else {
      this.error = 'Coach ID not found';
      console.error('Coach ID not found in token');
    }
  }

  loadCertificates() {
    this.loading = true;
    this.error = null;
    this.certService.getPortfolioIdByCoachId(this.coachId).subscribe({
      next: (res: any) => {
        this.protofolioId = res;
        this.certService.getByPortfolioId(this.protofolioId).subscribe({
          next: (data) => {
            this.certificates = data;
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Failed to load certificates';
            this.loading = false;
            console.error('Failed to load certificates:', err);
          }
        });
      },
      error: (err) => {
        this.error = 'Failed to get portfolio ID';
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

  uploadCertificate() {
    if (!this.selectedFile || !this.protofolioId) {
      this.error = 'Please select a valid certificate image';
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    const formData = new FormData();
    formData.append('CertificateImage', this.selectedFile);
    formData.append('ProtofolioId', this.protofolioId.toString());

    this.certService.create(formData).subscribe({
      next: () => {
        this.success = 'Certificate uploaded successfully!';
        this.loadCertificates();
        this.resetForm();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to upload certificate';
        this.loading = false;
        console.error('Upload failed:', err);
      }
    });
  }

  deleteCertificate(id: number) {
    if (confirm('Are you sure you want to delete this certificate?')) {
      this.loading = true;
      this.error = null;
      this.success = null;

      this.certService.delete(id).subscribe({
        next: () => {
          this.certificates = this.certificates.filter(c => c.id !== id);
          this.success = 'Certificate deleted successfully!';
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to delete certificate';
          this.loading = false;
          console.error('Error deleting certificate:', err);
        }
      });
    }
  }

  viewCertificate(certificate: Coachcertficate) {
    this.selectedCertificate = certificate;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedCertificate = null;
  }

  private resetForm() {
    this.selectedFile = null;
    this.previewUrl = null;
  }
}