import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Coachcertficate } from '../../../domain/models/CoachModels/coachcertficate.model';
import { CoachcertficateService } from '../../../services/Coachservice/coachcertficate.service';
import { AuthService } from '../../../services/auth.service';
import { CoachportfolioService } from '../../../services/Coachservice/coachportfolio.service';
import { Coachportfolio } from '../../../domain/models/CoachModels/coachportfolio.model';
import { ToastrService } from 'ngx-toastr';

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
    private portfolioService: CoachportfolioService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.coachId = this.authService.getUserId() || this.route.snapshot.paramMap.get('coachId')!;
    if (this.coachId) {
      this.loadCertificates();
    } else {
      this.toastr.error('Coach ID not found', 'Error');
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
            this.toastr.error('Failed to load certificates', 'Error');
            this.loading = false;
            console.error('Failed to load certificates:', err);
          }
        });
      },
      error: (err) => {
        this.toastr.error('You must create a portfolio before adding certificates', 'Error');
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
        this.toastr.error('Please select a valid image file (JPEG, PNG, JPG, GIF)', 'Error');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.toastr.error('File size should not exceed 5MB', 'Error');
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
      this.toastr.error('Please select a valid certificate image', 'Error');
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    const formData = new FormData();
    formData.append('CertificateImage', this.selectedFile);
    formData.append('ProtofolioId', this.protofolioId.toString());

    this.toastr.info('Uploading certificate...', 'Please wait');

    this.certService.create(formData).subscribe({
      next: () => {
        this.toastr.success('Certificate uploaded successfully!', 'Success');
        this.loadCertificates();
        this.resetForm();
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Failed to upload certificate', 'Error');
        this.loading = false;
        console.error('Upload failed:', err);
      }
    });
  }

  deleteCertificate(id: number | undefined) {
    if (!id) {
      this.toastr.error('Invalid certificate ID', 'Error');
      return;
    }

    const toastRef = this.toastr.warning('Are you sure you want to delete this certificate?', 'Confirm Delete', {
      timeOut: 5000,
      positionClass: 'toast-top-center',
      closeButton: true,
      tapToDismiss: true
    });

    toastRef.onTap.subscribe(() => {
      this.loading = true;
      this.error = null;
      this.success = null;

      this.certService.delete(id).subscribe({
        next: () => {
          this.certificates = this.certificates.filter(c => c.id !== id);
          this.toastr.success('Certificate deleted successfully!', 'Success');
          this.loading = false;
        },
        error: (err) => {
          this.toastr.error('Failed to delete certificate', 'Error');
          this.loading = false;
          console.error('Error deleting certificate:', err);
        }
      });
    });
  }

  viewCertificate(certificate: Coachcertficate) {
    this.selectedCertificate = certificate;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedCertificate = null;
  }

  resetForm() {
    this.selectedFile = null;
    this.previewUrl = null;
  }
}