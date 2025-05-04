import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoachportfolioService } from '../../../services/Coachservice/coachportfolio.service';
import { CoachratingService } from '../../../services/Coachservice/coachrating.service';
import { Coachportfolio } from '../../../domain/models/CoachModels/coachportfolio.model';
import { Coachrating } from '../../../domain/models/CoachModels/coachrating.model';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface CoachDisplay {
    id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
    specialization?: string;
    rating?: string | number;
    portfolio?: Coachportfolio;
    certificates?: any[];
    skills?: string[];
    socialMediaLinks?: string[];
}

@Component({
    selector: 'app-coaches-list',
    templateUrl: './coaches-list.component.html',
    styleUrls: ['./coaches-list.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule]
})
export class CoachesListComponent implements OnInit {
    coaches: CoachDisplay[] = [];
    filteredCoaches: CoachDisplay[] = [];
    loading: boolean = true;
    searchTerm: string = '';
    selectedSpecialization: string = '';
    selectedRating: string = '';
    selectedExperience: string = '';
    specializations: string[] = ['Fitness Coach', 'Personal Trainer', 'Yoga Instructor', 'Nutritionist'];
    ratings: string[] = ['All', '4+', '3+', '2+', '1+'];
    experienceRanges: string[] = ['All', '0-2 years', '2-5 years', '5+ years'];
    defaultProfileImage: string = 'assets/default-coach.jpg';

    constructor(
        private coachPortfolioService: CoachportfolioService,
        private coachRatingService: CoachratingService,
        private router: Router
    ) { }

    ngOnInit(): void {
        console.log('Component initialized');
        this.loadCoaches();
    }

    private parseJsonArray(value: any): string[] {
        if (Array.isArray(value)) return value;
        if (typeof value === 'string') {
            try {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed) ? parsed : [];
            } catch {
                return [];
            }
        }
        return [];
    }

    loadCoaches(): void {

        this.coachPortfolioService.getAll().subscribe({
            next: (portfolios: Coachportfolio[]) => {

                if (!portfolios || portfolios.length === 0) {
                    console.log('No portfolios found');
                    this.coaches = [];
                    this.filteredCoaches = [];
                    this.loading = false;
                    return;
                }

                // Create coach objects first
                this.coaches = portfolios.map(portfolio => ({
                    id: portfolio.coachId,
                    firstName: portfolio.coachFirstName || '',
                    lastName: portfolio.coachLastName || '',
                    profileImage: portfolio.aboutMeImageUrl || this.defaultProfileImage,
                    specialization: 'Fitness Coach',
                    portfolio: portfolio,
                    certificates: [],
                    skills: this.parseJsonArray(portfolio.skillsJson),
                    socialMediaLinks: this.parseJsonArray(portfolio.socialMediaLinksJson),
                    rating: 'New' // Default rating
                }));

                // Set filtered coaches immediately
                this.filteredCoaches = [...this.coaches];
                this.loading = false;

                // Load ratings separately for each coach
                this.coaches.forEach((coach, index) => {
                    this.coachRatingService.getByCoachId(coach.id).subscribe({
                        next: (ratings) => {
                            if (ratings && ratings.length > 0) {
                                const totalRating = ratings.reduce((sum, rating) => sum + rating.rate, 0);
                                this.coaches[index].rating = (totalRating / ratings.length).toFixed(1);
                                // Update filtered coaches with new rating
                                this.filteredCoaches = [...this.coaches];
                            }
                        },
                        error: (error) => {
                            console.error(`Error loading ratings for coach ${coach.id}:`, error);
                            // Keep the default 'New' rating if there's an error
                        }
                    });
                });
            },
            error: (error) => {
                console.error('Error loading portfolios:', error);
                this.coaches = [];
                this.filteredCoaches = [];
                this.loading = false;
            }
        });
    }

    applyFilters(): void {
        this.filteredCoaches = this.coaches.filter(coach => {
            // Search term filter
            const matchesSearch = !this.searchTerm ||
                coach.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                coach.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                coach.specialization?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                coach.skills?.some(skill => skill.toLowerCase().includes(this.searchTerm.toLowerCase()));

            // Specialization filter
            const matchesSpecialization = !this.selectedSpecialization ||
                coach.specialization === this.selectedSpecialization;

            // Rating filter
            const matchesRating = !this.selectedRating ||
                this.selectedRating === 'All' ||
                (coach.rating !== 'New' && parseFloat(coach.rating as string) >= parseFloat(this.selectedRating));

            // Experience filter
            const matchesExperience = !this.selectedExperience ||
                this.selectedExperience === 'All' ||
                (this.selectedExperience === '0-2 years' && (coach.portfolio?.experienceYears || 0) <= 2) ||
                (this.selectedExperience === '2-5 years' && (coach.portfolio?.experienceYears || 0) > 2 && (coach.portfolio?.experienceYears || 0) <= 5) ||
                (this.selectedExperience === '5+ years' && (coach.portfolio?.experienceYears || 0) > 5);

            return matchesSearch && matchesSpecialization && matchesRating && matchesExperience;
        });
    }

    clearFilters(): void {
        this.searchTerm = '';
        this.selectedSpecialization = '';
        this.selectedRating = '';
        this.selectedExperience = '';
        this.applyFilters();
    }

    viewCoachProfile(coachId: string): void {
        this.router.navigate(['/coach/profile', coachId]);
    }

    isEmail(link: string): boolean {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(link);
    }

    getSocialIcon(link: string): string {
        if (this.isEmail(link)) {
            return 'bi bi-envelope-fill';
        }

        // Check for social media platforms
        if (link.includes('twitter.com') || link.startsWith('@')) {
            return 'bi bi-twitter';
        } else if (link.includes('facebook.com')) {
            return 'bi bi-facebook';
        } else if (link.includes('instagram.com')) {
            return 'bi bi-instagram';
        } else if (link.includes('linkedin.com')) {
            return 'bi bi-linkedin';
        } else if (link.includes('youtube.com')) {
            return 'bi bi-youtube';
        } else if (link.includes('github.com')) {
            return 'bi bi-github';
        }

        // Default icon for other links
        return 'bi bi-link-45deg';
    }
}