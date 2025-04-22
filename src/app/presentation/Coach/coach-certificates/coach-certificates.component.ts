import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Coachcertficate } from '../../../domain/models/CoachModels/coachcertficate.model';
import { CoachcertficateService } from '../../../services/Coachservice/coachcertficate.service';
import { AuthService } from '../../../services/auth.service';
import { CoachportfolioService } from '../../../services/Coachservice/coachportfolio.service';
import { Coachportfolio } from '../../../domain/models/CoachModels/coachportfolio.model';

@Component({
  selector: 'app-coach-certificates',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './coach-certificates.component.html',
  styleUrl: './coach-certificates.component.css'
})
export class CoachCertificatesComponent implements OnInit {
  protofolioId!: number;
  certificates: Coachcertficate[] = [];
  selectedFile!: File;
  coachId!: string;
  portfolio!: Coachportfolio;
  loading = false;
  error: string | null = null;

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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        this.error = 'File size should not exceed 5MB';
        event.target.value = '';
        return;
      }
      if (!file.type.startsWith('image/')) {
        this.error = 'Only image files are allowed';
        event.target.value = '';
        return;
      }
      this.selectedFile = file;
      this.error = null;
    }
  }

  uploadCertificate() {
    if (!this.selectedFile || !this.protofolioId) {
      this.error = 'Please select a file and ensure portfolio ID is available';
      return;
    }

    this.loading = true;
    this.error = null;

    const formData = new FormData();
    formData.append('CertificateImage', this.selectedFile);
    formData.append('ProtofolioId', this.protofolioId.toString());

    this.certService.create(formData).subscribe({
      next: () => {
        this.loadCertificates();
        this.selectedFile = undefined!;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to upload certificate';
        this.loading = false;
        console.error('Upload failed:', err);
      }
    });
  }

  deleteCertificate(id: any) {
    if (confirm('Are you sure you want to delete this certificate?')) {
      this.loading = true;
      this.error = null;
      this.certService.delete(id).subscribe({
        next: () => {
          this.certificates = this.certificates.filter(c => c.id !== id);
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
}
