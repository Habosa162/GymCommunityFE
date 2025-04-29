import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoachportfolioService } from '../../../services/Coachservice/coachportfolio.service';
import { CoachratingService } from '../../../services/Coachservice/coachrating.service';
import { Coachportfolio } from '../../../domain/models/CoachModels/coachportfolio.model';
import { Coachrating } from '../../../domain/models/CoachModels/coachrating.model';

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
    imports: [CommonModule, FormsModule]
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

    constructor(
        private coachPortfolioService: CoachportfolioService,
        private coachRatingService: CoachratingService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadCoaches();
    }

    loadCoaches(): void {
        this.coachPortfolioService.getAll().subscribe({
            next: (portfolios: Coachportfolio[]) => {
                const coachesWithDetails = portfolios.map(portfolio => {
                    const coach: CoachDisplay = {
                        id: portfolio.coachId,
                        firstName: portfolio.coachFirstName || '',
                        lastName: portfolio.coachLastName || '',
                        profileImage: portfolio.aboutMeImageUrl,
                        specialization: 'Fitness Coach', // Default specialization
                        portfolio: portfolio,
                        certificates: [],
                        skills: portfolio.skillsJson || [],
                        socialMediaLinks: portfolio.socialMediaLinksJson || []
                    };

                    this.coachRatingService.getByCoachId(portfolio.coachId).subscribe({
                        next: (ratings: Coachrating[]) => {
                            if (ratings && ratings.length > 0) {
                                const totalRating = ratings.reduce((sum, rating) => sum + rating.rate, 0);
                                coach.rating = (totalRating / ratings.length).toFixed(1);
                            } else {
                                coach.rating = 'New';
                            }
                        },
                        error: (error: any) => {
                            console.error(`Error loading ratings for coach ${portfolio.coachId}:`, error);
                            coach.rating = 'New';
                        }
                    });

                    return coach;
                });

                this.coaches = coachesWithDetails;
                this.filteredCoaches = [...this.coaches];
                this.loading = false;
            },
            error: (error: any) => {
                console.error('Error loading coach portfolios:', error);
                this.loading = false;
            }
        });
    }

    parseSkills(skillsJson: string): string[] {
        try {
            return JSON.parse(skillsJson);
        } catch (error) {
            console.error('Error parsing skills:', error);
            return [];
        }
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
} 