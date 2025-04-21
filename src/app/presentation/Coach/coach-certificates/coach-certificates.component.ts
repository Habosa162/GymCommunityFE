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
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './coach-certificates.component.html',
  styleUrl: './coach-certificates.component.css'
})
export class CoachCertificatesComponent implements OnInit {
  protofolioId!: number;
  certificates: Coachcertficate[] = [];
  selectedFile!: File;
  coachId !: string;
  portfolio!: Coachportfolio;

  constructor(
    private certService: CoachcertficateService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private portfolioService: CoachportfolioService
  ) { }

  ngOnInit(): void {
    this.coachId = this.authService.getUserId() || this.route.snapshot.paramMap.get('coachId')!;
    console.log(this.coachId)
    if (this.coachId) {
      this.loadCertificates();
    } else {
      console.error('Coach ID not found in token');
    }
  }

  loadCertificates() {
    this.certService.getPortfolioIdByCoachId(this.coachId).subscribe({
      next: (res: any) => {
        this.protofolioId = res;
        this.certService.getByPortfolioId(this.protofolioId).subscribe(data => {
          this.certificates = data;
          console.log('Certificates:', this.certificates);
        });
      },
      error: (err) => {
        console.error('Failed to get portfolio ID:', err);
      }
    });

    // const id = this.route.snapshot.paramMap.get('id');
    // if (id) {
    //   this.portfolioService.getByCoachId(id).subscribe({
    //     next: (res) => {
    //       this.portfolio = res;
    //       this.certService.getByPortfolioId(this.portfolio.id).subscribe(data => {
    //         this.certificates = data;
    //         console.log(this.certificates);
    //       });
    //     },
    //     error: (err) => {
    //       console.error('Failed to fetch portfolio:', err);
    //     }
    //   });
    // } else {
    //   console.error("No 'id' param found in route");
    // }
  }


  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadCertificate() {
    if (!this.selectedFile || !this.protofolioId) return;

    const formData = new FormData();
    formData.append('CertificateImage', this.selectedFile); // use exact parameter name expected by backend
    formData.append('ProtofolioId', this.protofolioId.toString()); // required for CoachCertificateDto

    this.certService.create(formData).subscribe({
      next: () => {
        this.loadCertificates();  // reload list
        this.selectedFile = undefined!;
      },
      error: err => {
        console.error("Upload failed:", err);
        alert("Upload failed: " + (err.error?.message || 'Unexpected error'));
      }
    });
  }


  deleteCertificate(id: number) {
    // Ask for confirmation before proceeding with deletion
    const isConfirmed = window.confirm('Are you sure you want to delete this certificate?');

    if (isConfirmed) {
      this.certService.delete(id).subscribe({
        next: () => {
          this.certificates = this.certificates.filter(c => c.id !== id);
          console.log('Certificate deleted successfully');
        },
        error: err => {
          console.error('Error deleting certificate:', err);
          alert('Failed to delete the certificate');
        }
      });
    } else {
      console.log('Delete action was canceled');
    }
  }

}
