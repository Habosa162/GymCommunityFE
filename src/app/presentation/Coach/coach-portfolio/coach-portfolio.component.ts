import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CoachportfolioService } from '../../../services/Coachservice/coachportfolio.service';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CoachcertficateService } from '../../../services/Coachservice/coachcertficate.service';
import { Coachportfolio } from '../../../domain/models/CoachModels/coachportfolio.model';

@Component({
  selector: 'app-coach-portfolio',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './coach-portfolio.component.html',
  styleUrl: './coach-portfolio.component.css',
})
export class CoachPortfolioComponent implements OnInit {
  portfolioForm!: FormGroup;
  selectedImage!: File;
  coachId!: string;
  portfolioid!: number;
  existingImageUrl: string = '';
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private portfolioService: CoachportfolioService,
    private authservice: AuthService,
    private certservice: CoachcertficateService
  ) {}

  ngOnInit(): void {
    this.coachId =
      this.authservice.getUserId() ||
      this.route.snapshot.paramMap.get('coachId')!;

    this.certservice.getPortfolioIdByCoachId(this.coachId).subscribe({
      next: (res: any) => {
        this.portfolioid = res;
        if (this.coachId) {
          this.initForm();
          this.loadPortfolio();
        } else {
          console.error('Coach ID not found in token');
        }
      },
      error: (err) => {
        console.error('Error getting portfolio ID:', err);
        this.isLoading = false;
      },
    });
    this.initForm();
  }

  private initForm() {
    this.portfolioForm = this.fb.group({
      aboutMeDescription: ['', Validators.required],
      qualifications: ['', Validators.required],
      experienceYears: [0, [Validators.required, Validators.min(0)]],
      skills: [''],
      socialLinks: [''],
    });
  }

  private loadPortfolio() {
    this.isLoading = true;
    this.portfolioService.getByCoachId(this.coachId).subscribe({
      next: (data: Coachportfolio) => {
        if (data) {
          this.existingImageUrl = data.aboutMeImageUrl || '';
          console.log(data);

          // Convert arrays to comma-separated strings
          const skillsString = Array.isArray(data.skillsJson)
            ? data.skillsJson.join(', ')
            : typeof data.skillsJson === 'string'
            ? data.skillsJson
            : '';

          const socialLinksString = Array.isArray(data.socialMediaLinksJson)
            ? data.socialMediaLinksJson.join(', ')
            : typeof data.socialMediaLinksJson === 'string'
            ? data.socialMediaLinksJson
            : '';

          // Update form with existing data
          this.portfolioForm.patchValue({
            aboutMeDescription: data.aboutMeDescription || '',
            qualifications: data.qualifications || '',
            experienceYears: data.experienceYears || 0,
            skills: skillsString,
            socialLinks: socialLinksString,
          });
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading portfolio:', err);
        this.isLoading = false;
      },
    });
  }

  resetForm(): void {
    if (
      confirm(
        'Are you sure you want to reset the form? All unsaved changes will be lost.'
      )
    ) {
      this.loadPortfolio(); // Reload the original data
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.existingImageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.portfolioForm.valid) {
      const formData = new FormData();
      formData.append('CoachId', this.coachId);
      formData.append('Id', this.portfolioid.toString());
      formData.append(
        'AboutMeDescription',
        this.portfolioForm.get('aboutMeDescription')?.value || ''
      );
      formData.append(
        'Qualifications',
        this.portfolioForm.get('qualifications')?.value || ''
      );
      formData.append(
        'ExperienceYears',
        this.portfolioForm.get('experienceYears')?.value?.toString() || '0'
      );
      formData.append(
        'SkillsJson',
        JSON.stringify(
          this.portfolioForm
            .get('skills')
            ?.value?.split(',')
            .map((s: string) => s.trim()) || []
        )
      );
      formData.append(
        'SocialMediaLinksJson',
        JSON.stringify(
          this.portfolioForm
            .get('socialLinks')
            ?.value?.split(',')
            .map((l: string) => l.trim()) || []
        )
      );

      if (this.selectedImage) {
        formData.append('AboutMeImageUrl', this.selectedImage);
      } else if (this.existingImageUrl) {
        // If no new image is selected, preserve the existing image URL
        formData.append('AboutMeImageUrl', this.existingImageUrl);
      }

      this.portfolioService.update(this.portfolioid, formData).subscribe({
        next: () => {
          alert('Portfolio updated successfully!');
          this.loadPortfolio(); // Reload the updated data
        },
        error: (err) => {
          console.error('Error updating portfolio:', err);
          alert('Error: ' + (err.error?.message || 'Failed to save portfolio'));
        },
      });
    }
  }
}
