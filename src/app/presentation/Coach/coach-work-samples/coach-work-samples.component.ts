import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Coachworksample } from '../../../domain/models/CoachModels/coachworksample.model';
import { CoachworksampleService } from '../../../services/Coachservice/coachworksample.service';
import { AuthService } from '../../../services/auth.service';
import { CoachcertficateService } from '../../../services/Coachservice/coachcertficate.service';

@Component({
  selector: 'app-coach-work-samples',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './coach-work-samples.component.html',
  styleUrl: './coach-work-samples.component.css'
})
export class CoachWorkSamplesComponent implements OnInit {
  protofolioId!: number;
  workSamples: Coachworksample[] = [];
  selectedFile!: File;
  description: string = '';
  coachId!: string;


  constructor(
    private workSampleService: CoachworksampleService,
    private route: ActivatedRoute,
    private authservice: AuthService,
    private certservice: CoachcertficateService
  ) { }

  ngOnInit(): void {
    this.coachId = this.authservice.getUserId() || this.route.snapshot.paramMap.get('coachId')!;
    console.log(this.coachId)
    if (this.coachId) {
      this.loadSamples();
    } else {
      console.error('Coach ID not found in token');
    }
  }

  loadSamples() {
    this.certservice.getPortfolioIdByCoachId(this.coachId).subscribe({
      next: (res: any) => {
        this.protofolioId = res;
        this.workSampleService.getByPortfolioId(this.protofolioId).subscribe(data => {
          this.workSamples = data;

        });
      },
      error: (err) => {
        console.error('Failed to get portfolio ID:', err);
      }
    });

  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadSample() {
    if (!this.selectedFile || !this.description) return;

    const formData = new FormData();
    formData.append('worksampleimg', this.selectedFile); // must match [FromForm] name
    formData.append('description', this.description); // must match WorkSampleDto field

    this.workSampleService.create(formData).subscribe({
      next: () => {
        this.loadSamples();
        this.selectedFile = undefined!;
        this.description = '';
      },
      error: err => {
        console.error("Upload failed:", err);
        alert("Upload failed: " + (err.error?.error || 'Unexpected error'));
      }
    });
  }


  deleteSample(id: number) {
    const isConfirmed = window.confirm('Are you sure you want to delete this worksample?');

    if (isConfirmed) {
      this.workSampleService.delete(id).subscribe({
        next: () => {
          this.workSamples = this.workSamples.filter(c => c.id !== id);
          console.log('worksample deleted successfully');
        },
        error: err => {
          console.error('Error deleting worksample:', err);
          alert('Failed to delete the worksample');
        }
      });
    } else {
      console.log('Delete action was canceled');
    }
  }
}
