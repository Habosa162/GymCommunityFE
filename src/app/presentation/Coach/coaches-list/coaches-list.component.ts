import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
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
}

@Component({
    selector: 'app-coaches-list',
    templateUrl: './coaches-list.component.html',
    styleUrls: ['./coaches-list.component.css'],
    standalone: true,
    imports: [CommonModule]
})
export class CoachesListComponent implements OnInit {
    coaches: CoachDisplay[] = [];
    loading: boolean = true;

    constructor(
        private coachPortfolioService: CoachportfolioService,
        private coachRatingService: CoachratingService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadCoaches();
    }

    loadCoaches(): void {
        // Get all coach portfolios
        this.coachPortfolioService.getAll().subscribe({
            next: (portfolios: Coachportfolio[]) => {
                // Create coach display objects from portfolios
                const coachesWithDetails = portfolios.map(portfolio => {
                    const coach: CoachDisplay = {
                        id: portfolio.coachId,
                        firstName: '', // These will be populated from your user service if needed
                        lastName: '',
                        profileImage: portfolio.aboutMeImageUrl,
                        specialization: 'Fitness Coach', // Default or can be added to portfolio model
                        portfolio: portfolio,
                        certificates: [] // Will be populated if needed
                    };

                    // Get ratings for this coach
                    this.coachRatingService.getByCoachId(portfolio.coachId).subscribe({
                        next: (ratings: Coachrating[]) => {
                            if (ratings && ratings.length > 0) {
                                // Calculate average rating
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
                this.loading = false;
            },
            error: (error: any) => {
                console.error('Error loading coach portfolios:', error);
                this.loading = false;
            }
        });
    }

    viewCoachProfile(coachId: string): void {
        this.router.navigate(['/coach/profile', coachId]);
    }
} 