import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoachportfolioService } from '../../../services/Coachservice/coachportfolio.service';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CoachcertficateService } from '../../../services/Coachservice/coachcertficate.service';

@Component({
  selector: 'app-coach-portfolio',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './coach-portfolio.component.html',
  styleUrl: './coach-portfolio.component.css'
})
export class CoachPortfolioComponent implements OnInit {
  portfolioForm!: FormGroup;
  selectedImage!: File;
  coachId!: string;
  portfolioid!: number;
  existingImageUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private portfolioService: CoachportfolioService,
    private authservice: AuthService,
    private certservice: CoachcertficateService
  ) { }

  ngOnInit(): void {
    this.coachId = this.authservice.getUserId() || this.route.snapshot.paramMap.get('coachId')!;
    this.certservice.getPortfolioIdByCoachId(this.coachId).subscribe({
      next: (res: any) => {
        this.portfolioid = res;
      },
    })
    if (this.coachId) {
      this.initForm();
      this.loadPortfolio();
    } else {
      console.error('Coach ID not found in token');
    }
  }

  private initForm() {
    this.portfolioForm = this.fb.group({
      aboutMeDescription: ['', Validators.required],
      qualifications: ['', Validators.required],
      experienceYears: [0, [Validators.required, Validators.min(0)]],
      skills: [''],
      socialLinks: ['']
    });
  }

  private loadPortfolio() {
    this.portfolioService.getByCoachId(this.coachId).subscribe({
      next: (data) => {
        if (data) {
          this.existingImageUrl = data.aboutMeImageUrl || '';
          this.portfolioForm.patchValue({
            aboutMeDescription: data.aboutMeDescription || '',
            qualifications: data.qualifications || '',
            experienceYears: data.experienceYears || 0,
            skills: data.skillsJson?.join(', ') || '',
            socialLinks: data.socialMediaLinksJson?.join(', ') || ''
          });
        }
      },
      error: (err) => console.error('Error loading portfolio:', err)
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  onSubmit() {
    if (this.portfolioForm.valid) {
      const formData = new FormData();
      formData.append('CoachId', this.coachId);
      formData.append('Id', this.portfolioid.toString());
      formData.append('AboutMeDescription', this.portfolioForm.get('aboutMeDescription')?.value || '');
      formData.append('Qualifications', this.portfolioForm.get('qualifications')?.value || '');
      formData.append('ExperienceYears', this.portfolioForm.get('experienceYears')?.value?.toString() || '0');
      formData.append('SkillsJson', JSON.stringify(this.portfolioForm.get('skills')?.value?.split(',').map((s: string) => s.trim()) || []));
      formData.append('SocialMediaLinksJson', JSON.stringify(this.portfolioForm.get('socialLinks')?.value?.split(',').map((l: string) => l.trim()) || []));

      if (this.selectedImage) {
        formData.append('AboutMeImageUrl', this.selectedImage);
      } else if (this.existingImageUrl) {
        // If no new image is selected, preserve the existing image URL
        formData.append('AboutMeImageUrl', this.existingImageUrl);
      }

      // Log the form data for debugging
      console.log('Form data being sent:', {
        CoachId: this.coachId,
        Id: this.portfolioid,
        AboutMeDescription: this.portfolioForm.get('aboutMeDescription')?.value,
        Qualifications: this.portfolioForm.get('qualifications')?.value,
        ExperienceYears: this.portfolioForm.get('experienceYears')?.value,
        SkillsJson: this.portfolioForm.get('skills')?.value,
        SocialMediaLinksJson: this.portfolioForm.get('socialLinks')?.value,
        HasImage: !!this.selectedImage,
        ExistingImageUrl: this.existingImageUrl
      });

      this.portfolioService.update(this.portfolioid, formData).subscribe({
        next: () => alert('Portfolio saved successfully!'),
        error: (err) => {
          console.error('Error updating portfolio:', err);
          alert('Error: ' + (err.error?.message || 'Failed to save portfolio'));
        }
      });
    }
  }
}
