import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoachportfolioService } from '../../../services/Coachservice/coachportfolio.service';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-coach-portfolio',
  imports: [CommonModule , FormsModule , RouterModule ,ReactiveFormsModule],
  templateUrl: './coach-portfolio.component.html',
  styleUrl: './coach-portfolio.component.css'
})
export class CoachPortfolioComponent implements OnInit{
  portfolioForm!: FormGroup;
  selectedImage!: File;
  skillsInput = '';
  socialLinksInput = '';
  coachId !:string; // Replace with real logged-in ID

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private portfolioService: CoachportfolioService ,
    private authservice :AuthService
  ) {}

  ngOnInit(): void {
    this.coachId = this.authservice.getUserId() || this.route.snapshot.paramMap.get('coachId')!;
    console.log(this.coachId)
    if (this.coachId) {
      this.portfolioForm = this.fb.group({
        aboutMeDescription: ['', Validators.required],
        qualifications: ['', Validators.required],
        experienceYears: [0, Validators.required]
      });
    } else {
      console.error('Coach ID not found in token');
    }
   

    // Optionally: Load existing data for update
    this.portfolioService.getByCoachId(this.coachId).subscribe(data => {
      this.portfolioForm.patchValue(data);
      this.skillsInput = data.skillsJson?.join(', ') || '';
      this.socialLinksInput = data.socialMediaLinksJson?.join(', ') || '';
    });
  }

  handleSkills() {
    this.skillsInput = this.skillsInput.trim();
  }

  handleSocialLinks() {
    this.socialLinksInput = this.socialLinksInput.trim();
  }

  onFileSelected(event: any) {
    this.selectedImage = event.target.files[0];
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('CoachId', this.coachId);
    formData.append('AboutMeDescription', this.portfolioForm.value.aboutMeDescription);
    formData.append('Qualifications', this.portfolioForm.value.qualifications);
    formData.append('ExperienceYears', this.portfolioForm.value.experienceYears);
    formData.append('SkillsJson', JSON.stringify(this.skillsInput.split(',').map(s => s.trim())));
    formData.append('SocialMediaLinksJson', JSON.stringify(this.socialLinksInput.split(',').map(l => l.trim())));
    if (this.selectedImage) formData.append('AboutMeImage', this.selectedImage);

    this.portfolioService.create(formData).subscribe({
      next: () => alert('Portfolio saved successfully!'),
      error: (err:any) => alert('Error: ' + err.message)
    });
  }
}
