import { Component, OnInit } from '@angular/core';
import { Coachportfolio } from '../../../domain/models/CoachModels/coachportfolio.model';
import { Coachcertficate } from '../../../domain/models/CoachModels/coachcertficate.model';
import { Coachworksample } from '../../../domain/models/CoachModels/coachworksample.model';
import { Coachrating } from '../../../domain/models/CoachModels/coachrating.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CoachportfolioService } from '../../../services/Coachservice/coachportfolio.service';
import { CoachcertficateService } from '../../../services/Coachservice/coachcertficate.service';
import { CoachworksampleService } from '../../../services/Coachservice/coachworksample.service';
import { CoachratingService } from '../../../services/Coachservice/coachrating.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CoachRatingComponent } from '../coach-rating/coach-rating.component';
import { AuthService } from '../../../services/auth.service';
import { ClientProfileService } from '../../../services/Client/client-profile.service';

interface RatingWithClientName extends Coachrating {
  clientName?: string;
}

@Component({
  selector: 'app-public-coach-profile',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterModule, CoachRatingComponent],
  templateUrl: './public-coach-profile.component.html',
  styleUrl: './public-coach-profile.component.css'
})
export class PublicCoachProfileComponent implements OnInit {
  coachId!: string;
  portfolio!: Coachportfolio;
  certificates: Coachcertficate[] = [];
  workSamples: Coachworksample[] = [];
  ratings: RatingWithClientName[] = [];
  isCurrentCoach: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private portfolioService: CoachportfolioService,
    private certificateService: CoachcertficateService,
    private workSampleService: CoachworksampleService,
    private ratingService: CoachratingService,
    public  authservice: AuthService, 
    private clientProfileService: ClientProfileService
  ) { }

  ngOnInit(): void {
    this.coachId = this.authservice.getUserId() || this.route.snapshot.paramMap.get('coachId')!;
    console.log(this.coachId)
    if (this.coachId) {
      this.loadPortfolio();
    } else {
      console.error('Coach ID not found in token');
    }
    this.checkIfCurrentCoach();
  }

  checkIfCurrentCoach(): void {
    if (this.authservice.isLoggedIn() && this.authservice.getUserRole() === 'Coach') {
      const currentUserId = this.authservice.getUserId();
      this.isCurrentCoach = currentUserId === this.coachId;
    }
  }

  loadPortfolio() {
    this.portfolioService.getByCoachId(this.coachId).subscribe(port => {
      this.portfolio = port;

      // Load rest using portfolioId
      this.certificateService.getByPortfolioId(port.id!).subscribe(certs => this.certificates = certs);
      this.workSampleService.getByPortfolioId(port.id!).subscribe(samples => this.workSamples = samples);
      this.ratingService.getByCoachId(this.coachId).subscribe(rates => {
        this.ratings = rates;
        // Load client names for each rating
        this.ratings.forEach(rating => {
          this.clientProfileService.getClientProfileById(rating.clientId).subscribe({
            next: (response: any) => {
              if (response && response.data) {
                rating.clientName = `${response.data.firstName} ${response.data.lastName}`;
              }
            },
            error: (error) => {
              console.error('Error loading client profile:', error);
              rating.clientName = 'Unknown Client';
            }
          });
        });
      });
    });
  }

  calculateAverageRating(): string {
    if (!this.ratings || this.ratings.length === 0) {
      return 'No ratings yet';
    }

    const totalRating = this.ratings.reduce((sum, rating) => sum + rating.rate, 0);
    const average = totalRating / this.ratings.length;
    return average.toFixed(1);
  }
}
