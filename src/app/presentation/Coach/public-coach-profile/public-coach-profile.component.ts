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
  ratings: Coachrating[] = [];

  constructor(
    private route: ActivatedRoute,
    private portfolioService: CoachportfolioService,
    private certificateService: CoachcertficateService,
    private workSampleService: CoachworksampleService,
    private ratingService: CoachratingService,
    private authservice: AuthService
  ) { }

  ngOnInit(): void {
    this.coachId = this.authservice.getUserId() || this.route.snapshot.paramMap.get('coachId')!;
    console.log(this.coachId)
    if (this.coachId) {
      this.loadPortfolio();
    } else {
      console.error('Coach ID not found in token');
    }
    //   this.coachId = this.route.snapshot.paramMap.get('coachId')!;
    //   console.log(this.coachId)
    //   this.loadPortfolio();
  }

  loadPortfolio() {

    this.portfolioService.getByCoachId(this.coachId).subscribe(port => {
      this.portfolio = port;

      // Load rest using portfolioId
      this.certificateService.getByPortfolioId(port.id!).subscribe(certs => this.certificates = certs);
      this.workSampleService.getByPortfolioId(port.id!).subscribe(samples => this.workSamples = samples);
      this.ratingService.getByCoachId(this.coachId).subscribe(rates => this.ratings = rates);
    });
  }
}
