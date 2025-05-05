import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Coachportfolio } from '../../../domain/models/CoachModels/coachportfolio.model';
import { CoachService } from '../../../services/Coachservice/coach.service';
import { CoachcertficateService } from '../../../services/Coachservice/coachcertficate.service';
import { CoachportfolioService } from '../../../services/Coachservice/coachportfolio.service';
import { AuthService } from '../../../services/auth.service';

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
  isNewPortfolio: boolean = false;
  coachProfileImage: string = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private portfolioService: CoachportfolioService,
    private authservice: AuthService,
    private certservice: CoachcertficateService,
    private router: Router,
    private coachService: CoachService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.coachId =
      this.authservice.getUserId() ||
      this.route.snapshot.paramMap.get('coachId')!;
    this.initForm();

    if (this.coachId) {
      // Get the coach's profile image from their user profile
      this.coachProfileImage = this.authservice.getProfileImg() || '';
      // Load the portfolio
      this.loadPortfolio();
    } else {
      this.toastr.error('Coach ID not found', 'Error');
      console.error('Coach ID not found in token');
      this.isLoading = false;
    }
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
          this.portfolioid = data.id!;
          this.existingImageUrl =
            data.aboutMeImageUrl || this.coachProfileImage;
          this.isNewPortfolio = false;

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
            skills: this.safeParseArray(data.skillsJson).join(', '),
            socialLinks: this.safeParseArray(data.socialMediaLinksJson).join(
              ', '
            ),
          });
        } else {
          this.isNewPortfolio = true;
          this.existingImageUrl = this.coachProfileImage;
        }
        this.isLoading = false;
      },
      error: (err) => {
        // this.toastr.error('Failed to load portfolio', 'Error');
        console.error('Error loading portfolio:', err);
        this.isNewPortfolio = true;
        this.existingImageUrl = this.coachProfileImage;
        this.isLoading = false;
      },
    });
  }

  private safeParseArray(value: any): string[] {
    if (Array.isArray(value)) return value;
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match(/image\/(jpeg|png|jpg|gif)/)) {
        this.toastr.error(
          'Please select a valid image file (JPEG, PNG, JPG, GIF)',
          'Error'
        );
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        this.toastr.error('File size should not exceed 2MB', 'Error');
        return;
      }

      this.selectedImage = file;
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.existingImageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
      this.toastr.success('Image selected successfully', 'Success');
    }
  }

  onSubmit(): void {
    if (this.portfolioForm.valid) {
      const formData = new FormData();

      // Add required fields
      formData.append('CoachId', this.coachId);
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

      // Handle skills array
      const skillsValue = this.portfolioForm.get('skills')?.value;
      const skillsArray = skillsValue
        ? skillsValue
            .split(',')
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [];
      formData.append('SkillsJson', JSON.stringify(skillsArray));

      // Handle social media links array
      const socialLinksValue = this.portfolioForm.get('socialLinks')?.value;
      const socialLinksArray = socialLinksValue
        ? socialLinksValue
            .split(',')
            .map((l: string) => l.trim())
            .filter(Boolean)
        : [];
      formData.append('SocialMediaLinksJson', JSON.stringify(socialLinksArray));

      // Always include AboutMeImageUrl field
      if (this.selectedImage) {
        formData.append('AboutMeImageUrl', this.selectedImage);
      } else if (this.existingImageUrl) {
        formData.append('AboutMeImageUrl', this.existingImageUrl);
      } else {
        // Use the coach's profile image as default
        formData.append('AboutMeImageUrl', this.coachProfileImage);
      }

      // Add ID for update operation
      if (!this.isNewPortfolio && this.portfolioid) {
        formData.append('Id', this.portfolioid.toString());
      }

      // Show loading state
      this.isLoading = true;
      this.toastr.info('Saving portfolio...', 'Please wait');

      const saveObservable = this.isNewPortfolio
        ? this.portfolioService.create(formData)
        : this.portfolioService.update(this.portfolioid, formData);

      saveObservable.subscribe({
        next: () => {
          this.toastr.success('Portfolio saved successfully!', 'Success');
          this.router.navigate(['/coach/dashboard']);
        },
        error: (err) => {
          console.error('Error saving portfolio:', err);
          let errorMessage = 'Failed to save portfolio. ';

          if (err.error?.errors) {
            // Handle validation errors
            const validationErrors = Object.values(err.error.errors).flat();
            errorMessage += validationErrors.join('\n');
          } else if (err.error?.message) {
            errorMessage += err.error.message;
          }

          this.toastr.error(errorMessage, 'Error');
          this.isLoading = false;
        },
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.portfolioForm.controls).forEach((key) => {
        const control = this.portfolioForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
      this.toastr.error(
        'Please fill in all required fields',
        'Validation Error'
      );
    }
  }
}
